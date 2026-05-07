package com.example.backend.dto.Auth.Request;

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
public class ResetPasswordRequest {

    @NotBlank(message = "Reset token is not empty")
    String token;

    @NotBlank(message = "Password is not empty")
    @Size(min = 6, max = 20, message = "Password must be between 6 and 20 characters")
    String newPassword;
}
