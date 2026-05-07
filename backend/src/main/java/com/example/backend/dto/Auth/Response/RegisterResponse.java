package com.example.backend.dto.Auth.Response;

import com.example.backend.dto.User.UserResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterResponse {
    String refreshToken;
    String accessToken;
    UserResponse user;
}
