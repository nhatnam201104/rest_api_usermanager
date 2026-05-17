package com.example.backend.dto.Auth.Request;

import com.example.backend.validation.PhoneValidator.Phone;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class LoginRequest {
    @Email(message = "Email is invalid")
    public String email;

    @Phone(message = "Phone is invalid")
    public String phone;

    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    public String password;

    @JsonIgnore
    @AssertTrue(message = "Email or phone is required")
    public boolean isEmailOrPhoneProvided() {
        return hasText(email) || hasText(phone);
    }

    @JsonIgnore
    @AssertTrue(message = "Password is not empty")
    public boolean isPasswordProvided() {
        return hasText(password);
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
