package com.example.backend.exception;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.backend.dto.Api.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler (Exception.class) 
    public ApiResponse<?> UnCatchException (Exception ex) {
        return ApiResponse.<Object>builder()
                .data(null)
                .message(ex.getMessage())
                .statusCode(500)
                .success(false)
                .build();
    }

}
