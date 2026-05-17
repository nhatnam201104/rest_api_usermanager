package com.example.backend.services;

import java.time.Duration;
import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.dto.Auth.Request.LoginRequest;
import com.example.backend.dto.Auth.Request.RegisterRequest;
import com.example.backend.dto.Auth.Response.RegisterResponse;
import com.example.backend.dto.Auth.Response.TokenResponse;
import com.example.backend.enums.TokenType;
import com.example.backend.exception.Auth.AuthException;
import com.example.backend.exception.Auth.InvalidCredentialsException;
import com.example.backend.exception.Auth.JwtTokenException;
import com.example.backend.mapper.AuthMapper;
import com.example.backend.mapper.UserMapper;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.RoleRepo;
import com.example.backend.repository.UserRepo;
import com.example.backend.utils.HashUtils;
import com.example.backend.utils.OtpUtils;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class AuthService {
    private static final Duration OTP_TTL = Duration.ofSeconds(300);

    @Value("${jwt.refreshtoken.expiration}")
    private long jwtRefreshExpiration;

    final PasswordEncoder passwordEncoder;
    final UserRepo userRepo;
    final RedisService redis;
    final AuthMapper authMapper;
    final UserMapper userMapper;
    final RoleRepo roleRepo;
    final JwtService jwtService;
    final AuthenticationManager authenticationManager;

    public String register(RegisterRequest request) {
        if (userRepo.existsByEmail(request.getEmail())) {
            throw new AuthException("Email already exists");
        }
        if (userRepo.existsByPhone(request.getPhone())) {
            throw new AuthException("Phone number already exists");
        }

        String roleName = request.getRole().toUpperCase(Locale.ROOT);
        Role role = roleRepo.findByRoleName(roleName)
                .orElseThrow(() -> new AuthException("Role not found"));

        String otp = OtpUtils.generateOtp();

        User user = authMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        redis.set(otpKey(request.getEmail()), otp, OTP_TTL);
        cachePendingUser(user, roleName);

        return otp;
    }

    public RegisterResponse verify(String otpRequest, String email) {
        var otp = redis.get(otpKey(email));

        if (otp == null || !otp.equals(otpRequest)) {
            throw new AuthException("Invalid OTP or OTP has expired");
        }

        User user = userRepo.save(getPendingUser(email));
        redis.delete(otpKey(email));

        deletePendingUser(email);
        String accessToken = jwtService.generateToken(user, TokenType.ACCESS.name());
        String refreshToken = jwtService.generateToken(user, TokenType.REFRESH.name());

        storeRefreshToken(user, refreshToken);

        return RegisterResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(userMapper.toUserResponse(user))
                .build();

    }

    public RegisterResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        } catch (AuthenticationException ex) {
            throw new InvalidCredentialsException("Email or password is incorrect", ex);
        }

        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Email or password is incorrect"));
        String accessToken = jwtService.generateToken(user, TokenType.ACCESS.name());
        String refreshToken = jwtService.generateToken(user, TokenType.REFRESH.name());

        storeRefreshToken(user, refreshToken);

        return RegisterResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(userMapper.toUserResponse(user))
                .build();
    }

    public TokenResponse refresh(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new AuthException("Refresh token is required", "MISSING_REFRESH_TOKEN", HttpStatus.BAD_REQUEST);
        }

        Object tokenType;
        try {
            tokenType = jwtService.extractAllClaims(refreshToken).get("token_type");
        } catch (JwtTokenException ex) {
            throw new AuthException("Invalid or expired refresh token", "TOKEN_EXPIRED", HttpStatus.UNAUTHORIZED, ex);
        }

        if (!TokenType.REFRESH.name().equals(tokenType)) {
            throw new AuthException("Invalid token type", "INVALID_TOKEN_TYPE", HttpStatus.UNAUTHORIZED);
        }

        String tokenHash = HashUtils.sha256(refreshToken);
        String key = "refresh_token:" + tokenHash;
        var value = redis.get(key);

        if (!(value instanceof Number userId)) {
            throw new AuthException("Refresh token has been revoked", "TOKEN_REVOKED", HttpStatus.UNAUTHORIZED);
        }

        redis.delete(key);

        User user = userRepo.findById(userId.intValue())
                .orElseThrow(() -> new AuthException("Refresh token has been revoked", "TOKEN_REVOKED",
                        HttpStatus.UNAUTHORIZED));
        String newRefreshToken = jwtService.generateToken(user, TokenType.REFRESH.name());
        storeRefreshToken(user, newRefreshToken);

        return TokenResponse.builder()
                .accessToken(jwtService.generateToken(user, TokenType.ACCESS.name()))
                .refreshToken(newRefreshToken)
                .build();
    }

    public void logout(String refreshToken, String accessToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new AuthException("Refresh token is required", "MISSING_REFRESH_TOKEN", HttpStatus.BAD_REQUEST);
        }

        if (refreshToken != null && !refreshToken.isBlank()) {
            String tokenHash = HashUtils.sha256(refreshToken);
            String key = "refresh_token:" + tokenHash;
            var user = redis.get(key);
            if (user != null) {
                redis.delete(key);
            }
        }

        try {
            if (accessToken != null && !accessToken.isBlank()
                    && jwtService.IsAccessToken(accessToken)) {
                var timeRemain = jwtService.getRemainingValidity(accessToken);
                redis.set("blacklist:access:" + HashUtils.sha256(accessToken), accessToken, timeRemain);
            }
        } catch (JwtTokenException ex) {
            log.debug("Skip access-token blacklist because token is invalid during logout", ex);
        }
    }

    private void storeRefreshToken(User user, String refreshToken) {
        String hashRefresh = HashUtils.sha256(refreshToken);
        if (redis.get("refresh_token:" + hashRefresh) != null) {
            redis.delete("refresh_token:" + hashRefresh);
        }

        redis.set("refresh_token:" + hashRefresh, user.getId(), Duration.ofSeconds(jwtRefreshExpiration));
    }

    private void cachePendingUser(User user, String roleName) {
        String email = user.getEmail();

        redis.set(pendingUserKey(email, "fullName"), user.getFullName(), OTP_TTL);
        redis.set(pendingUserKey(email, "phone"), user.getPhone(), OTP_TTL);
        redis.set(pendingUserKey(email, "password"), user.getPassword(), OTP_TTL);
        redis.set(pendingUserKey(email, "role"), roleName, OTP_TTL);
    }

    private User getPendingUser(String email) {
        String roleName = getRequiredPendingValue(email, "role");
        Role role = roleRepo.findByRoleName(roleName)
                .orElseThrow(() -> new AuthException("Role not found"));

        return User.builder()
                .email(email)
                .fullName(getRequiredPendingValue(email, "fullName"))
                .phone(getRequiredPendingValue(email, "phone"))
                .password(getRequiredPendingValue(email, "password"))
                .role(role)
                .build();
    }

    private String getRequiredPendingValue(String email, String field) {
        Object value = redis.get(pendingUserKey(email, field));
        if (!(value instanceof String text) || text.isBlank()) {
            throw new AuthException("User not found");
        }

        return text;
    }

    private void deletePendingUser(String email) {
        redis.delete(pendingUserKey(email, "fullName"));
        redis.delete(pendingUserKey(email, "phone"));
        redis.delete(pendingUserKey(email, "password"));
        redis.delete(pendingUserKey(email, "role"));
    }

    private String otpKey(String email) {
        return "otp:" + email;
    }

    private String pendingUserKey(String email, String field) {
        return "user:" + email + ":" + field;
    }

}
