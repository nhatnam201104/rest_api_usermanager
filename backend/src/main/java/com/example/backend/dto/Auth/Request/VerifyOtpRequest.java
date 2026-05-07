package com.example.backend.dto.Auth.Request;

import com.fasterxml.jackson.annotation.JsonAlias;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerifyOtpRequest {

    @Email(message = "Email is invalid")
    @NotBlank(message = "Email is not empty")
    String email;

    @JsonAlias("otpCode")
    @NotBlank(message = "Otp is not empty")
    @Size(min = 6, max = 6, message = "Otp must be 6 characters")
    String otp;
}
