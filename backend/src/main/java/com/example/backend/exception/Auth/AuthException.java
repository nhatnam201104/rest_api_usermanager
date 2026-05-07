package com.example.backend.exception.Auth;

import org.springframework.http.HttpStatus;

/**
 * Base authentication exception for all auth-related errors
 */
public class AuthException extends RuntimeException {
    private final String errorCode;
    private final HttpStatus status;

    public AuthException(String message) {
        super(message);
        this.errorCode = "AUTH_ERROR";
        this.status = HttpStatus.UNAUTHORIZED;
    }

    public AuthException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
        this.status = HttpStatus.UNAUTHORIZED;
    }

    public AuthException(String message, String errorCode, HttpStatus status) {
        super(message);
        this.errorCode = errorCode;
        this.status = status;
    }

    public AuthException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = "AUTH_ERROR";
        this.status = HttpStatus.UNAUTHORIZED;
    }

    public AuthException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.status = HttpStatus.UNAUTHORIZED;
    }

    public AuthException(String message, String errorCode, HttpStatus status, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.status = status;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
