package com.example.backend.model;

import com.example.backend.enums.ModerationAction;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "post_moderations", indexes = {
        @Index(name = "idx_post_mod_post_id", columnList = "post_id"),
        @Index(name = "idx_post_mod_moderator_id", columnList = "moderator_id"),
        @Index(name = "idx_post_mod_action", columnList = "action"),
        @Index(name = "idx_post_mod_created_at", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostModeration extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "moderator_id", nullable = false)
    private User moderator;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ModerationAction action;

    @Column(columnDefinition = "TEXT")
    private String reason;
}
