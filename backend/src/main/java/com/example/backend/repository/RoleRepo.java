package com.example.backend.repository;



import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.Role;

public interface RoleRepo extends JpaRepository<Role, Integer> {
    boolean existsByRoleName(String roleName);
    Optional<Role> findByRoleName(String roleName);
}
