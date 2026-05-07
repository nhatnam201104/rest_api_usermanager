package com.example.backend.dto.Auth.Request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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
public class ResendOtpRequest {

    @Email(message = "Email is invalid")
    @NotBlank(message = "Email is not empty")
    String email;

    @Builder.Default
    String purpose = "register";
}
