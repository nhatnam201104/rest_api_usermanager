# Authentication Techniques - Spring Boot 3

## 10 Techniques Learned

### 1. JWT (JSON Web Tokens)
- Access token: 15 minutes expiry
- Refresh token: 7-30 days expiry
- HS256 signing algorithm
- Claims: subject (username), issuedAt, expiration
- Token generation pattern with Jwts.builder()

### 2. Spring Security 6
- SecurityFilterChain configuration
- Stateless session policy (SessionCreationPolicy.STATELESS)
- JwtAuthenticationFilter extends OncePerRequestFilter
- Whitelist auth endpoints: /api/auth/**
- Add filter before UsernamePasswordAuthenticationFilter

### 3. Redis OTP Storage
- Key format: `otp:{email}` -> TTL 300s (5 min)
- Cooldown key: `otp_cooldown:{email}` -> TTL 60s (1 min)
- 6-digit OTP: String.format("%06d", new Random().nextInt(1000000))
- Delete OTP after successful verification

### 4. BCrypt Password Hashing
- Strength >= 10
- PasswordEncoder bean with BCryptPasswordEncoder
- Encode before save, compare with matches()

### 5. Java Mail Sender
- Spring Boot starter-mail
- SimpleMailMessage or MimeMessage
- Async sending with @Async
- SMTP configuration: host, port, username, password

### 6. Bean Validation
- @Email, @NotBlank, @NotNull
- @Size(min=, max=)
- @Pattern(regexp=)
- @Valid annotation on controller params

### 7. Token Revocation/Blacklist
- RefreshToken entity with revoked/expired flags
- Logout: set revoked=true, save
- Blacklist check in JwtAuthenticationFilter

### 8. OTP Rate Limiting
- Max 5 verification attempts per email
- Lockout 15 minutes after 5 failed attempts
- Log all OTP failures for audit

### 9. Signed JWT Verification Tokens
- Email verification uses signed JWT
- Claims: email, purpose (VERIFY_EMAIL), issuedAt, expiresAt
- Short-lived: 5-15 minutes
- One-time use: invalidate after verification

### 10. Refresh Token Rotation
- Issue new refresh token on each /refresh call
- Revoke old refresh token immediately
- Prevents token reuse if stolen

---

## Security Best Practices

### JWT Security
- JWT secret from environment variable (256-bit minimum)
- Access token expiry <= 15 minutes
- Refresh token expiry 7-30 days
- HTTPS only in production
- Token blacklist for logout
- Never log tokens or expose in error messages

### Password Security
- BCrypt hashing (strength >= 10)
- Password validation: min 6, max 20
- Password never stored in plain text
- Password reset token one-time use

### OTP Security
- 6-digit OTP (1000000 possibilities)
- 5-minute expiry
- 1-minute resend cooldown
- Max 5 attempts, then lockout
- Generic error messages

### General Security
- Rate limiting on all auth endpoints
- Input validation on all fields
- No sensitive data in logs
- User enumeration prevention (generic messages)

---

## Pain Points & Lessons

### Common Mistakes to Avoid

| Mistake | Consequence | Solution |
|---------|-------------|----------|
| Long-lived access tokens | Extended attack window if stolen | Keep <= 15 min |
| localStorage for tokens | XSS can steal tokens | Use HTTP-only cookies |
| No token revocation | Can't force logout | Implement blacklist |
| Revealing email exists | User enumeration attack | Generic "If exists, email sent" |
| No rate limiting | Brute force attacks | Implement rate limits |
| Weak password hashing | Rainbow table attacks | BCrypt with adequate rounds |
| Hardcoded secrets | Secret exposure in repo | Use environment variables |
| Generic 403 errors | Confuses debugging | Specific error messages |

### Implementation Mistakes

| Mistake | Fix |
|---------|-----|
| Forgot to delete OTP after verify | Always delete on success |
| Token not invalidated on reset | One-time use pattern |
| No validation on reset token expiry | Check both null AND expired |
| Logging password attempts | Never log passwords |
| Same token for verify & login | Separate token purposes |
| Token in URL (GET request) | Use POST with body or secure cookie |
| Redis connection failure | Graceful degradation or circuit breaker |
| Email in spam folder | SPF/DKIM configuration |

### Pain Points Summary

| Pain Point | Cause | Solution |
|-----------|-------|----------|
| Token replay attacks | No revocation | Short expiry + blacklist |
| OTP brute force | No rate limiting | Attempt counter + lockout |
| User enumeration | Different messages for valid/invalid email | Generic message |
| Session fixation | Session ID not regenerated | Regenerate after login |
| Redis down | Single point of failure | Fallback or graceful degradation |

---

## Key Code Patterns

### JWT Generation
```java
public String generateAccessToken(UserDetails userDetails) {
    return Jwts.builder()
        .subject(userDetails.getUsername())
        .issuedAt(new Date())
        .expiration(new Date(System.currentTimeMillis() + accessTokenExpirationMs))
        .signWith(getSignInKey(), Jwts.SIG.HS256)
        .compact();
}
```

### Redis OTP
```java
// Store
redisTemplate.opsForValue().set("otp:" + email, otp, Duration.ofSeconds(300));

// Verify
String stored = redisTemplate.opsForValue().get("otp:" + email);
if (stored != null && stored.equals(otp)) {
    redisTemplate.delete("otp:" + email); // One-time use
}
```

### Password Reset
```java
public void resetPassword(String token, String newPassword) {
    SecureToken secureToken = secureTokenRepository.findByToken(token);
    if (secureToken == null || secureToken.isExpired()) {
        throw new InvalidTokenException("Token invalid or expired");
    }
    User user = secureToken.getUser();
    user.setPassword(passwordEncoder.encode(newPassword));
    userRepository.save(user);
    secureTokenRepository.delete(secureToken); // One-time use
}
```

### Security Config
```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
        .csrf(AbstractHttpConfigurer::disable)
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            .anyRequest().authenticated()
        )
        .sessionManagement(session -> session
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
        .build();
}
```

---

## Tech Stack Summary

| Component | Technology |
|-----------|------------|
| Framework | Spring Boot 3.5.15, Java 21 |
| Security | Spring Security 6 + JWT (jjwt 0.12.5) |
| OTP Storage | Redis |
| Email | Spring Mail |
| Validation | Jakarta Validation |
| Hash | BCrypt |

---

## Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Send OTP for registration |
| POST | /api/auth/verify-register | Verify OTP, create user, return access token |
| POST | /api/auth/login | Send OTP for login |
| POST | /api/auth/verify-login | Verify OTP, return refresh token |
| POST | /api/auth/resend-otp | Resend OTP (1 min cooldown) |
| POST | /api/auth/refresh | Refresh access token |
| POST | /api/auth/logout | Revoke refresh token |
| POST | /api/auth/forgot-password | Send reset link |
| POST | /api/auth/reset-password | Reset password with token |

---

## Sources

1. Java Code Geeks - Secure REST APIs with Spring Security and JWT (2025 Edition)
2. DevPro Portal - Mastering Spring Security 6: JWT Authentication Guide (2025)
3. SpringJavaLab - Spring Security JWT Authentication with Refresh Token
4. Nashtech Blog - JWT Expiration, Refresh Tokens, Best Practices
5. Medium - Email Verification Flows with Spring Boot
6. Medium - User Registration and JWT Authentication Part 2
7. KindsonTheGenius - Spring Boot Password Reset
8. Java Code Geeks - Managing JWT Refresh Tokens in Spring Security
