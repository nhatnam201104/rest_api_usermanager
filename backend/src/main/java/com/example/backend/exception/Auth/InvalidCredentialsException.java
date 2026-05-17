package com.example.backend.exception.Auth;

/**
 * Thrown when authentication credentials are invalid
 */
public class InvalidCredentialsException extends AuthException {
    public InvalidCredentialsException(String message) {
        super(message, "INVALID_CREDENTIALS");
    }

    public InvalidCredentialsException(String message, Throwable cause) {
        super(message, "INVALID_CREDENTIALS", cause);
    }
}
