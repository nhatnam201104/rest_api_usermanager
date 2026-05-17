package com.example.backend.controllers;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.Api.ApiResponse;
import com.example.backend.dto.Auth.Request.LoginRequest;
import com.example.backend.dto.Auth.Request.LogoutRequest;
import com.example.backend.dto.Auth.Request.RegisterRequest;
import com.example.backend.dto.Auth.Request.RefreshTokenRequest;
import com.example.backend.dto.Auth.Request.VerifyOtpRequest;
import com.example.backend.dto.Auth.Response.RegisterResponse;
import com.example.backend.dto.Auth.Response.TokenResponse;
import com.example.backend.services.AuthService;
import com.example.backend.services.EmailService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class AuthController {
    private static final String REFRESH_TOKEN_COOKIE = "refreshToken";

    @Value("${jwt.refreshtoken.expiration}")
    long jwtRefreshExpiration;

    @Value("${app.cookie.secure:false}")
    boolean secureCookie;

    final AuthService authService;
    final EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterRequest request) {
        String otp = authService.register(request);
        emailService.sendOtpEmail(request.getEmail(), otp);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<String>builder()
                        .data(otp)
                        .success(true)
                        .statusCode(HttpStatus.CREATED.value())
                        .message("Otp will be sent to your email, if did not receive it, please try again later")
                        .build());
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<RegisterResponse>> login(@Valid @RequestBody LoginRequest request) {
        RegisterResponse response = authService.login(request);
        ResponseCookie refreshCookie = createRefreshCookie(response.getRefreshToken());
        response.setRefreshToken(null);

        return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(ApiResponse.<RegisterResponse>builder()
                        .data(response)
                        .success(true)
                        .statusCode(HttpStatus.OK.value())
                        .message("Login successful")
                        .build());
    }

    @PostMapping({ "/verify-otp", "/verify-register" })
    public ResponseEntity<ApiResponse<RegisterResponse>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        RegisterResponse response = authService.verify(request.getOtp(), request.getEmail());
        ResponseCookie refreshCookie = createRefreshCookie(response.getRefreshToken());
        response.setRefreshToken(null);

        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(ApiResponse.<RegisterResponse>builder()
                        .data(response)
                        .success(true)
                        .statusCode(HttpStatus.CREATED.value())
                        .message("Registration successful")
                        .build());
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<TokenResponse>> refreshToken(
            @CookieValue(name = REFRESH_TOKEN_COOKIE, required = false) String cookieRefreshToken,
            @RequestBody(required = false) RefreshTokenRequest request) {
        String refreshToken = firstNonBlank(cookieRefreshToken,
                request != null ? request.getRefreshToken() : null);
        var tokenResponse = authService.refresh(refreshToken);
        ResponseCookie refreshCookie = createRefreshCookie(tokenResponse.getRefreshToken());
        tokenResponse.setRefreshToken(null);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(ApiResponse.<TokenResponse>builder()
                        .data(tokenResponse)
                        .success(true)
                        .statusCode(HttpStatus.OK.value())
                        .message("Token refreshed successfully")
                        .build());
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @CookieValue(name = REFRESH_TOKEN_COOKIE, required = false) String cookieRefreshToken,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader,
            @RequestBody(required = false) LogoutRequest request) {
        String refreshToken = firstNonBlank(cookieRefreshToken,
                request != null ? request.getRefreshToken() : null);
        String accessToken = firstNonBlank(extractBearerToken(authorizationHeader),
                request != null ? request.getAccessToken() : null);

        authService.logout(refreshToken, accessToken);

        ResponseCookie deleteCookie = deleteRefreshCookie();

        return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                .body(ApiResponse.<Void>builder()
                        .success(true)
                        .statusCode(HttpStatus.OK.value())
                        .message("Logout successful")
                        .build());
    }

    private String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return null;
        }

        return cleanToken(authorizationHeader.substring(7));
    }

    private String firstNonBlank(String first, String second) {
        String cleanFirst = cleanToken(first);
        if (cleanFirst != null && !cleanFirst.isBlank()) {
            return cleanFirst;
        }

        String cleanSecond = cleanToken(second);
        return cleanSecond != null && !cleanSecond.isBlank() ? cleanSecond : null;
    }

    private String cleanToken(String token) {
        if (token == null) {
            return null;
        }

        String cleanToken = token.trim();
        if (cleanToken.startsWith("Bearer ")) {
            cleanToken = cleanToken.substring(7).trim();
        }
        if (cleanToken.length() >= 2 && cleanToken.startsWith("\"") && cleanToken.endsWith("\"")) {
            cleanToken = cleanToken.substring(1, cleanToken.length() - 1);
        }

        return cleanToken;
    }

    private ResponseCookie createRefreshCookie(String refreshToken) {
        return ResponseCookie.from(REFRESH_TOKEN_COOKIE, refreshToken)
                .httpOnly(true)
                .secure(secureCookie)
                .sameSite("Strict")
                .path("/api/auth")
                .maxAge(Duration.ofSeconds(jwtRefreshExpiration))
                .build();
    }

    private ResponseCookie deleteRefreshCookie() {
        return ResponseCookie.from(REFRESH_TOKEN_COOKIE, "")
                .httpOnly(true)
                .secure(secureCookie)
                .sameSite("Strict")
                .path("/api/auth")
                .maxAge(0)
                .build();
    }

}
