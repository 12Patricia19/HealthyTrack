package com.healthytrack.app.models.responses

import java.time.LocalDateTime

data class UserResponse(
    val id: Long,
    val firstName: String,
    val lastName: String,
    val email: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)