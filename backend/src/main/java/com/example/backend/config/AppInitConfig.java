package com.example.backend.config;

import java.util.List;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.backend.model.Role;
import com.example.backend.repository.RoleRepo;

@Configuration
public class AppInitConfig {

    private static final List<String> DEFAULT_ROLES = List.of("USER", "ADMIN", "MODERATOR");

    @Bean
    ApplicationRunner seedRoles(RoleRepo roleRepo) {
        return args -> DEFAULT_ROLES.forEach(roleName -> {
            if (!roleRepo.existsByRoleName(roleName)) {
                roleRepo.save(Role.builder()
                        .roleName(roleName)
                        .build());
            }
        });
    }
}
