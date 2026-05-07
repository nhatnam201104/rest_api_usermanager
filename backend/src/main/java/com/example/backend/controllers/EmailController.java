package com.example.backend.controllers;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.example.backend.services.EmailService;

@RestController
@RequestMapping("/api/emails")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    @PostMapping("/send")
    public String sendEmail(@RequestParam String to) {
        emailService.sendSimpleEmail(
                to,
                "Test Spring Boot Email",
                "Đây là email test từ Spring Boot"
        );

        return "Email sent successfully";
    }
}