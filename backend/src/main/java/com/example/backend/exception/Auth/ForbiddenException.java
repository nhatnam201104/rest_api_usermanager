package com.example.backend.exception.Auth;

/**
 * Thrown when user is authenticated but lacks required permissions
 */
public class ForbiddenException extends AuthException {
    public ForbiddenException(String message) {
        super(message, "FORBIDDEN");
    }

    public ForbiddenException(String message, Throwable cause) {
        super(message, "FORBIDDEN", cause);
    }
}
