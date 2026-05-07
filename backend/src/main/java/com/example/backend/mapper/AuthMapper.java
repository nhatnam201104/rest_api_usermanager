package com.example.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.backend.dto.Auth.Request.RegisterRequest;
import com.example.backend.model.User;

@Mapper(componentModel = "spring")
public interface AuthMapper {

    @Mapping(target = "role", ignore = true)
    @Mapping(target = "status", ignore = true)
    public User toUser(RegisterRequest request);

}
