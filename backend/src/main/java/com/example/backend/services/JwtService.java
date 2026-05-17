package com.example.backend.services;

import java.time.Duration;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.example.backend.exception.Auth.JwtTokenException;
import com.example.backend.model.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.accesstoken.expiration}")
    private long jwtExpiration;

    @Value("${jwt.refreshtoken.expiration}")
    private long jwtRefreshExpiration;

    public String generateToken(User userDetails, String token_type_claim) {
        long expirationSeconds = "ACCESS".equals(token_type_claim) ? jwtExpiration : jwtRefreshExpiration;
        return Jwts.builder()
                .setSubject(userDetails.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + Duration.ofSeconds(expirationSeconds).toMillis()))
                .claim("token_type", token_type_claim)
                .signWith(getSignInKey())
                .compact();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);

        return username.equals(userDetails.getUsername())
                && !isTokenExpired(token);
    }

    public boolean isTokenValid(String token) {
        return !isTokenExpired(token);
    }

    public boolean IsAccessToken(String token) {
        return "ACCESS".equals(extractAllClaims(token).get("token_type"));
    }

    public Duration getRemainingValidity(String token) {
        long remainingMs = extractExpiration(token).getTime() - System.currentTimeMillis();
        return Duration.ofMillis(Math.max(remainingMs, 0));
    }

    public Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSignInKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException | IllegalArgumentException ex) {
            throw new JwtTokenException("Invalid or expired token", ex);
        }
    }

    private SecretKey getSignInKey() {
        byte[] keyBytes = secret.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
