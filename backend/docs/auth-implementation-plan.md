# Authentication Feature - Implementation Plan

## Requirements Summary

### 1. Login
- Authenticate with email + password
- Send OTP via email after successful login
- OTP valid for **5 minutes**
- Resend OTP support (after 1 minute cooldown)
- Return **refresh token** after OTP verification

### 2. Register
- Fields: email (unique), phone (unique), password (6-20 chars), fullname (3-50 chars)
- Default status: **ACTIVE**
- Send OTP via email before saving to database (5 min expiry, 1 min resend cooldown)
- BCrypt password hashing
- Return **access token** after OTP verification

### 3. Logout
- Delete/revoke access token (token blacklist)

### 4. Forget Password
- Send reset password link via email

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Spring Boot 3.5.15, Java 21 |
| Security | Spring Security 6 + JWT (jjwt 0.12.5) |
| OTP Storage | Redis (TTL-based) |
| Email | Spring Mail (SMTP) |
| Validation | Jakarta Bean Validation |
| Password Hash | BCrypt (strength >= 10) |

---

## Implementation Phases

### Phase 1: Infrastructure Configuration
**New Files:**
- `src/main/resources/application-auth.properties` - JWT, email, Redis config
- `src/main/java/com/socialmanagement/exception/AuthException.java`
- `src/main/java/com/socialmanagement/exception/OtpExpiredException.java`
- `src/main/java/com/socialmanagement/exception/InvalidTokenException.java`

### Phase 2: Entity & Repository
**New Files:**
- `src/main/java/com/socialmanagement/entity/RefreshToken.java`
- `src/main/java/com/socialmanagement/entity/EmailVerification.java`
- `src/main/java/com/socialmanagement/repository/RefreshTokenRepository.java`
- `src/main/java/com/socialmanagement/repository/EmailVerificationRepository.java`

**Update:**
- `src/main/java/com/socialmanagement/entity/User.java` - Add fields if needed

### Phase 3: DTOs
**Request DTOs:**
- `LoginRequest.java` - email, password
- `RegisterRequest.java` - email, phone, password, fullname
- `VerifyOtpRequest.java` - email, otpCode
- `ResendOtpRequest.java` - email
- `RefreshTokenRequest.java` - refreshToken
- `ForgotPasswordRequest.java` - email
- `ResetPasswordRequest.java` - token, newPassword

**Response DTOs:**
- `AuthResponse.java` - accessToken, refreshToken, userInfo
- `TokenResponse.java` - accessToken, refreshToken
- `MessageResponse.java` - message

### Phase 4: Security
**New/Update Files:**
- `src/main/java/com/socialmanagement/security/JwtTokenProvider.java` - Generate, validate JWT
- `src/main/java/com/socialmanagement/security/JwtAuthenticationFilter.java` - Extract & validate JWT
- `src/main/java/com/socialmanagement/config/SecurityConfig.java` - Configure filter chain

**JwtTokenProvider Methods:**
```
generateAccessToken(UserDetails, User) -> 15 min expiry
generateRefreshToken(UserDetails) -> 7 days expiry
validateToken(String token) -> boolean
extractUsername(String token) -> String
isTokenExpired(String token) -> boolean
```

### Phase 5: Services
**New Files:**
- `src/main/java/com/socialmanagement/service/AuthService.java`
  - login(email, password) -> send OTP
  - verifyLoginOtp(email, otp) -> return refresh token
  - register(RegisterRequest) -> send OTP
  - verifyRegisterOtp(email, otp) -> create user + return access token
  - logout(refreshToken)
  - forgotPassword(email) -> send reset link
  - resetPassword(token, newPassword)

- `src/main/java/com/socialmanagement/service/OtpService.java`
  - Redis keys:
    - `otp:{email}` -> {otpCode}, TTL: 300s (5 min)
    - `otp_cooldown:{email}` -> "1", TTL: 60s (1 min)

- `src/main/java/com/socialmanagement/service/EmailService.java`
  - sendOtpEmail(email, otpCode)
  - sendPasswordResetEmail(email, resetLink)

- `src/main/java/com/socialmanagement/service/RefreshTokenService.java`
  - createRefreshToken(User) -> RefreshToken
  - validateRefreshToken(String token) -> boolean
  - revokeRefreshToken(String token)

### Phase 6: Controller
**New File:**
- `src/main/java/com/socialmanagement/controller/AuthController.java`

**Endpoints:**
```
POST /api/auth/register
  Request: {email, phone, password, fullname}
  Response: {message: "OTP sent to email"}

POST /api/auth/verify-register
  Request: {email, otpCode}
  Response: {accessToken, user info}
  Error 400: Invalid/expired OTP

POST /api/auth/login
  Request: {email, password}
  Response: {message: "OTP sent to email"}
  Error 401: Invalid credentials

POST /api/auth/verify-login
  Request: {email, otpCode}
  Response: {accessToken, refreshToken}
  Error 400: Invalid/expired OTP

POST /api/auth/resend-otp
  Request: {email}
  Response: {message: "OTP resent"}
  Error 429: Cooldown not expired

POST /api/auth/refresh
  Request: {refreshToken}
  Response: {accessToken, refreshToken}

POST /api/auth/logout
  Request: {refreshToken}
  Response: {message: "Logged out"}

POST /api/auth/forgot-password
  Request: {email}
  Response: {message: "Reset link sent"}

POST /api/auth/reset-password
  Request: {token, newPassword}
  Response: {message: "Password reset successful"}
```

### Phase 7: Testing
- `src/test/java/com/socialmanagement/service/JwtTokenProviderTest.java`
- `src/test/java/com/socialmanagement/service/OtpServiceTest.java`
- `src/test/java/com/socialmanagement/service/AuthServiceTest.java`
- `src/test/java/com/socialmanagement/controller/AuthControllerTest.java`

---

## File Structure

```
src/main/java/com/socialmanagement/
├── config/
│   └── SecurityConfig.java (update)
├── controller/
│   └── AuthController.java (new)
├── dto/
│   ├── request/
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── VerifyOtpRequest.java
│   │   ├── ResendOtpRequest.java
│   │   ├── RefreshTokenRequest.java
│   │   ├── ForgotPasswordRequest.java
│   │   └── ResetPasswordRequest.java
│   └── response/
│       ├── AuthResponse.java
│       ├── TokenResponse.java
│       └── MessageResponse.java
├── entity/
│   ├── RefreshToken.java (new)
│   └── EmailVerification.java (new)
├── exception/
│   ├── AuthException.java (new)
│   ├── OtpExpiredException.java (new)
│   └── InvalidTokenException.java (new)
├── repository/
│   ├── RefreshTokenRepository.java (new)
│   └── EmailVerificationRepository.java (new)
├── security/
│   ├── JwtTokenProvider.java (new/update)
│   └── JwtAuthenticationFilter.java (update)
└── service/
    ├── AuthService.java (new)
    ├── OtpService.java (new)
    ├── EmailService.java (new)
    └── RefreshTokenService.java (new)
```

---

## Dependencies (pom.xml additions)

```xml
<!-- JWT -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.5</version>
    <scope>runtime</scope>
</dependency>

<!-- Redis -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-pool2</artifactId>
</dependency>

<!-- Mail -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>

<!-- Validation -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

---

## Configuration (application-auth.properties)

```properties
# JWT
app.security.jwt.secret=${JWT_SECRET}
app.security.jwt.access-token-expiration-ms=900000
app.security.jwt.refresh-token-expiration-ms=604800000

# Redis
spring.data.redis.host=localhost
spring.data.redis.port=6379

# Email
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# OTP
app.otp.expiration-seconds=300
app.otp.cooldown-seconds=60
```
