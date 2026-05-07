# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
./mvnw compile
./mvnw spring-boot:run
./mvnw test
./mvnw package
```

## Architecture

### Layer Structure
- `controllers/` - REST API endpoints
- `services/` - Business logic layer
- `repositories/` - JPA data access
- `models/` - JPA entities
- `dtos/` - Request/Response objects
- `enums/` - Domain enumerations
- `config/` - Spring configuration classes
- `security/` - JWT and Spring Security components
- `exception/` - Exception handling

### Domain Model
- **User** → Role, Posts, Comments, Likes
- **Post** → User, Comments, Likes, PostModeration
- **Comment** → User, Post
- **Like** → User, Post (unique constraint: user+post)
- **Role** → Users
- Moderation: PostModeration, UserModeration

### Entity Inheritance
- `BaseEntity` — id, createdAt
- `BaseTimestampEntity extends BaseEntity` — adds updatedAt

### Key Enums
- UserStatus: ACTIVE, BANNED, INACTIVE
- PostVisibility: PUBLIC, PRIVATE, DRAFT, PUBLISHED
- ModerationStatus: PENDING, APPROVED, REJECTED
- ModerationAction: APPROVE, REJECT, DELETE
- CommentStatus: VISIBLE, HIDDEN, DELETED

### API Response Format
`ApiResponse<T>` with fields: `data`, `message`, `statusCode`, `success`

## Tech Stack
- Spring Boot 3.5.15, Java 21
- Spring Security with JWT
- JPA/Hibernate with MySQL
- Lombok for boilerplate reduction
- Builder pattern for entity construction

## Configuration
- MySQL: `socialmanagement` on localhost:3306
- Server port: 8082
- JPA ddl-auto: create (development only)
- Secrets via environment variables

## Conventions
- Constructor injection (no field injection)
- Domain-specific unchecked exceptions
- GlobalExceptionHandler at controller advice level
- Use records for immutable DTOs where appropriate
