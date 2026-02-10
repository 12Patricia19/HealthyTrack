package com.healthytrack.app.models.responses

import java.time.LocalDateTime

data class NotificationResponse(
    val id: Long,
    val userId: Long,
    val notificationType: String,
    val title: String,
    val message: String,
    val scheduledTime: LocalDateTime?,
    val sentAt: LocalDateTime?,
    val isRead: Boolean,
    val isSent: Boolean,
    val priority: String,
    val createdAt: LocalDateTime
)
