package com.healthytrack.app.models.responses

import java.time.LocalDateTime
import java.time.LocalDate
import java.math.BigDecimal

data class AuthResponse(
    val id: Long,
    val email: String,
    val fullName: String,
    val role: String,
    val token: String? = null
)

data class UserDetailResponse(
    val id: Long,
    val email: String,
    val fullName: String,
    val dateOfBirth: LocalDate? = null,
    val gender: String? = null,
    val weightKg: BigDecimal? = null,
    val heightCm: BigDecimal? = null,
    val role: String,
    val emailVerified: Boolean,
    val isActive: Boolean,
    val lastLogin: LocalDateTime? = null,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
