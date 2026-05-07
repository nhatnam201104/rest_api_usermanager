package com.example.backend.exception.Auth;

/**
 * Thrown when JWT token is invalid or expired
 */
public class JwtTokenException extends AuthException {
    public JwtTokenException(String message) {
        super(message, "INVALID_TOKEN");
    }

    public JwtTokenException(String message, Throwable cause) {
        super(message, "INVALID_TOKEN", cause);
    }
}
