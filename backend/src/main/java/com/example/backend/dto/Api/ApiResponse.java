package com.example.backend.dto.Api;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class ApiResponse <T>{
    public T data ;
    public String message;
    public int statusCode;
    public boolean success;
}
