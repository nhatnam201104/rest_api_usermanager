package com.example.backend.dto.Auth.Request;

import com.example.backend.validation.PhoneValidator.Phone;
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
public class RegisterRequest {

    @Phone(message = "Phone is invalid")
    @NotBlank(message = "Phone is not empty")
    String phone;

    @Email(message = "Email is invalid")
    @NotBlank(message = "Email is not empty")
    String email;

    @JsonAlias({ "fullname", "full_name" })
    @NotBlank(message = "Full name is not empty")
    @Size(min = 3, max = 100, message = "Full name must be between 3 and 100 characters")
    String fullName;

    @NotBlank(message = "Password is not empty")
    @Size(min = 6, max = 20, message = "Password must be between 6 and 20 characters")
    String password;

    @NotBlank(message = "Role is not empty")
    String role;

}
