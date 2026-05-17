# Authentication Best Practices & References - 2025

## Sources

1. [Java Code Geeks - Secure REST APIs with Spring Security and JWT (2025 Edition)](https://www.javacodegeeks.com/2025/05/how-to-secure-rest-apis-with-spring-security-and-jwt-2025-edition.html)
2. [DevPro Portal - Mastering Spring Security 6: JWT Authentication & Authorization Guide (2025)](https://devproportal.com/languages/java/spring-security-jwt-authentication-authorization-guide-2025/)
3. [SpringJavaLab - Spring Security JWT Authentication with Refresh Token](https://www.springjavalab.com/2025/11/spring-boot-jwt-authentication-refresh-token-role-based-access-complete-guide.html)
4. [Nashtech Blog - JWT Expiration, Refresh Tokens, Spring Security Best Practices](https://blog.nashtechglobal.com/jwt-expiration-refresh-tokens-and-security-best-practices-with-spring-boot/)
5. [Medium - Email Verification Flows with Spring Boot](https://medium.com/@AlexanderObregon/email-verification-flows-with-spring-boot-and-expiring-tokens-e9b2a238d917)
6. [Medium - User Registration and JWT Authentication with Spring Boot 3 Part 2](https://medium.com/@max.difranco/user-registration-and-jwt-authentication-with-spring-boot-3-part-2-email-verification-otp-9613e90437aa)
7. [KindsonTheGenius - Spring Boot Password Reset](https://www.kindsonthegenius.com/spring-boot/spring-boot-password-reset/)
8. [Java Code Geeks - Managing JWT Refresh Tokens in Spring Security](https://www.javacodegeeks.com/2024/12/managing-jwt-refresh-tokens-in-spring-security-a-complete-guide.html)

---

## JWT Best Practices

### Token Structure

| Token Type | Lifetime | Storage | Purpose |
|------------|----------|---------|---------|
| Access Token | 5-15 min | Client memory / HTTP-only cookie | API authorization |
| Refresh Token | 7-30 days | HTTP-only cookie / encrypted DB | Obtain new access tokens |

### Security Rules

1. **Never hardcode secrets** - Use environment variables
2. **Use strong keys** - HS256 with at least 256-bit key
3. **Short-lived access tokens** - Reduces exposure window if compromised
4. **HTTPS only** - Protect tokens in transit
5. **Token rotation** - Issue new refresh token on each refresh

### JWT Generation Code Pattern (2025)

```java
@Service
public class JwtTokenProvider {

    @Value("${app.security.jwt.secret}")
    private String secretKey;

    @Value("${app.security.jwt.access-token-expiration-ms}")
    private long accessTokenExpirationMs;

    @Value("${app.security.jwt.refresh-token-expiration-ms}")
    private long refreshTokenExpirationMs;

    public String generateAccessToken(UserDetails userDetails) {
        return generateToken(userDetails, accessTokenExpirationMs);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return generateToken(userDetails, refreshTokenExpirationMs);
    }

    private String generateToken(UserDetails userDetails, long expirationMs) {
        return Jwts.builder()
            .subject(userDetails.getUsername())
            .issuedAt(new Date(System.currentTimeMillis()))
            .expiration(new Date(System.currentTimeMillis() + expirationMs))
            .signWith(getSignInKey(), Jwts.SIG.HS256)
            .compact();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(
            Base64.getEncoder().encodeToString(secretKey.getBytes())
        );
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
```

---

## Spring Security 6 Configuration (2025)

```java
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
```

---

## OTP Best Practices

### Storage with Redis

```
Key: otp:{email}
Value: {otpCode}
TTL: 300 seconds (5 minutes)

Key: otp_cooldown:{email}
Value: "1"
TTL: 60 seconds (1 minute cooldown for resend)
```

### OTP Generation

```java
public String generateOtp() {
    return String.format("%06d", new Random().nextInt(1000000));
}
```

### Verification Flow

1. Check OTP exists in Redis
2. Compare provided OTP with stored OTP
3. Check TTL not expired
4. Delete OTP after successful verification
5. Return error if expired or invalid

### Rate Limiting

- Max 5 OTP verification attempts per email
- Lockout for 15 minutes after 5 failed attempts
- Log all OTP failures for audit

---

## Email Verification Best Practices

### Token Structure

- Signed JWT containing: email, purpose, issuedAt, expiresAt
- Short-lived: 5-15 minutes
- One-time use: invalidate after successful verification

### Email Content

```html
Subject: [SocialManagement] Verify Your Email

Your verification code is: <strong>123456</strong>

This code expires in 5 minutes.

If you didn't request this, please ignore this email.
```

### Security Notes

- Never include passwords or sensitive data in email
- Don't expose raw tokens in logs or error responses
- Send verification emails only after real registration events
- Rate limit resend requests (1 per minute)

---

## Password Reset Best Practices

### Reset Token Flow

1. User requests password reset with email
2. Generate secure token (UUID or signed JWT)
3. Store token in DB with expiration (1 hour)
4. Send email with reset link: `/reset-password?token={token}`
5. Validate token on reset page
6. Require both password and token confirmation
7. Invalidate token after successful reset
8. Optional: revoke all existing sessions

### Implementation Pattern

```java
public void resetPassword(String token, String newPassword) {
    SecureToken secureToken = secureTokenRepository.findByToken(token);

    if (secureToken == null || secureToken.isExpired()) {
        throw new InvalidTokenException("Token invalid or expired");
    }

    User user = secureToken.getUser();
    user.setPassword(passwordEncoder.encode(newPassword));
    userRepository.save(user);

    secureTokenRepository.delete(secureToken);
}
```

---

## Refresh Token Best Practices

### Storage Strategy

| Environment | Storage |
|-------------|---------|
| Production | HTTP-only cookie or encrypted DB |
| Development | Can use localStorage with caution |

### Refresh Flow

```
1. User logs in -> Server returns accessToken + refreshToken
2. Client stores refreshToken securely
3. Access token expires -> Client calls /refresh with refreshToken
4. Server validates refreshToken -> Returns new accessToken + new refreshToken
5. Old refreshToken is invalidated (token rotation)
```

### Token Revocation on Logout

```java
public void logout(String refreshToken) {
    RefreshToken token = refreshTokenRepository
        .findByToken(refreshToken)
        .orElseThrow(() -> new InvalidTokenException("Token not found"));

    token.setRevoked(true);
    token.setExpired(true);
    refreshTokenRepository.save(token);
}
```

---

## Security Checklist

- [ ] JWT secret key from environment variable (256-bit minimum)
- [ ] Access token expiry: <= 15 minutes
- [ ] Refresh token expiry: 7-30 days
- [ ] BCrypt password hashing (strength >= 10)
- [ ] OTP stored in Redis with TTL (5 min)
- [ ] OTP resend cooldown (1 min)
- [ ] HTTPS in production
- [ ] Rate limiting on auth endpoints
- [ ] Token blacklist for logout
- [ ] Input validation on all fields
- [ ] No sensitive data in logs or error messages
- [ ] Email verification before account activation
- [ ] Password reset token one-time use

---

## Common Mistakes to Avoid

| Mistake | Consequence | Solution |
|---------|-------------|----------|
| Long-lived access tokens | Extended attack window if stolen | Keep <= 15 min |
| Storing tokens in localStorage | XSS can steal tokens | Use HTTP-only cookies |
| No token revocation | Can't force logout | Implement blacklist |
| Revealing email exists | User enumeration attack | Generic "If exists, email sent" |
| No rate limiting | Brute force attacks | Implement rate limits |
| Weak password hashing | Rainbow table attacks | BCrypt with adequate rounds |

---

## High-Security Additions (Optional)

For banking/healthcare applications:

1. **Asymmetric keys (RSA/ECDSA)** - Rotate keys without invalidating all tokens
2. **Token binding** - Bind token to device/fingerprint
3. **IP/device checks** - Flag suspicious refresh attempts
4. **Step-up authentication** - Require re-auth for sensitive operations
