package com.example.backend.dto.User;

import com.example.backend.enums.UserStatus;
import com.example.backend.model.Role;

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
public class UserResponse {
    private int id;
    private String fullName;
    private String email;
    private String avatar;
    private UserStatus status;
    private Role role;
}
