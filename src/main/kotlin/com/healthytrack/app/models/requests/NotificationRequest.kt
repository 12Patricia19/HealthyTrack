package com.healthytrack.app.models.requests

import java.time.LocalDateTime

data class NotificationRequest(
    val notificationType: String,
    val title: String,
    val message: String,
    val scheduledTime: LocalDateTime? = null,
    val priority: String = "normal"
)
