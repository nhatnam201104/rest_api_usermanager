package com.example.backend.validation.PhoneValidator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PhoneValidator implements ConstraintValidator<Phone, String> {

    @Override
    public boolean isValid(String phone, ConstraintValidatorContext context) {
        if (phone == null || phone.isBlank()) {
            return true;
        }

        String value = phone.trim();

        if (value.length() == 10 && value.charAt(0) == '0') {
            return hasOnlyDigits(value, 0) && hasVietnamMobilePrefix(value.charAt(1), value.charAt(2));
        }

        if (value.length() == 12 && value.startsWith("+84")) {
            return hasOnlyDigits(value, 1) && hasVietnamMobilePrefix(value.charAt(3), value.charAt(4));
        }

        if (value.length() == 11 && value.startsWith("84")) {
            return hasOnlyDigits(value, 0) && hasVietnamMobilePrefix(value.charAt(2), value.charAt(3));
        }

        return false;
    }

    private static boolean hasOnlyDigits(String value, int start) {
        for (int i = start; i < value.length(); i++) {
            char digit = value.charAt(i);
            if (digit < '0' || digit > '9') {
                return false;
            }
        }

        return true;
    }

    private static boolean hasVietnamMobilePrefix(char first, char second) {
        return switch (first) {
            case '3' -> second >= '2' && second <= '9';
            case '5' -> second == '2' || second == '5' || second == '6' || second == '8' || second == '9';
            case '7' -> second == '0' || (second >= '6' && second <= '9');
            case '8' -> second >= '1' && second <= '9';
            case '9' -> (second >= '0' && second <= '4') || (second >= '6' && second <= '9');
            default -> false;
        };
    }
    
}
