package com.example.backend.model;

import com.example.backend.enums.ModerationAction;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_moderations", indexes = {
        @Index(name = "idx_user_mod_target_user_id", columnList = "target_user_id"),
        @Index(name = "idx_user_mod_moderator_id", columnList = "moderator_id"),
        @Index(name = "idx_user_mod_action", columnList = "action"),
        @Index(name = "idx_user_mod_created_at", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserModeration extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_user_id", nullable = false)
    private User targetUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "moderator_id", nullable = false)
    private User moderator;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ModerationAction action;

    @Column(columnDefinition = "TEXT")
    private String reason;
}
