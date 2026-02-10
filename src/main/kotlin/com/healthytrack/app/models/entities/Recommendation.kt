package com.healthytrack.app.models.entities

import jakarta.persistence.*
import java.time.LocalDateTime
import com.fasterxml.jackson.annotation.JsonIgnore

@Entity
@Table(name = "recommendations")
data class Recommendation(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    val user: User,

    @Column(name = "recommendation_type", nullable = false, length = 50)
    val recommendationType: String,

    @Column(nullable = false)
    val title: String,

    @Column(nullable = false, columnDefinition = "TEXT")
    val description: String,

    @Column(name = "recommendation_text", nullable = false, columnDefinition = "TEXT")
    val recommendationText: String,

    @Column(name = "trigger_condition", columnDefinition = "TEXT")
    val triggerCondition: String? = null,

    @Column(name = "based_on_data", columnDefinition = "JSONB")
    val basedOnData: String? = null,

    @Column(name = "is_active")
    val isActive: Boolean = true,

    @Column(name = "is_viewed")
    val isViewed: Boolean = false,

    @Column(name = "viewed_at")
    val viewedAt: LocalDateTime? = null,

    @Column(name = "expires_at")
    val expiresAt: LocalDateTime? = null
) : BaseEntity()
