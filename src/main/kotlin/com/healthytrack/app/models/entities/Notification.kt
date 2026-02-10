package com.healthytrack.app.models.entities

import jakarta.persistence.*
import java.time.LocalDateTime
import com.fasterxml.jackson.annotation.JsonIgnore

@Entity
@Table(name = "notifications")
data class Notification(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    val user: User,

    @Column(name = "notification_type", nullable = false, length = 50)
    val notificationType: String,

    @Column(nullable = false)
    val title: String,

    @Column(nullable = false, columnDefinition = "TEXT")
    val message: String,

    @Column(name = "scheduled_time")
    val scheduledTime: LocalDateTime? = null,

    @Column(name = "sent_at")
    val sentAt: LocalDateTime? = null,

    @Column(name = "is_read")
    val isRead: Boolean = false,

    @Column(name = "is_sent")
    val isSent: Boolean = false,

    @Column(length = 20)
    val priority: String = "normal"
) : BaseEntity()
