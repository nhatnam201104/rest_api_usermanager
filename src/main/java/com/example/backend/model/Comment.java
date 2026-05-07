package com.example.backend.model;

import com.example.backend.enums.CommentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "comments", indexes = {
        @Index(name = "idx_comments_user_id", columnList = "user_id"),
        @Index(name = "idx_comments_post_id", columnList = "post_id"),
        @Index(name = "idx_comments_status", columnList = "status"),
        @Index(name = "idx_comments_created_at", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment extends BaseTimestampEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private CommentStatus status = CommentStatus.VISIBLE;

    @Column(name = "deleted_at")
    private Instant deletedAt;
}
