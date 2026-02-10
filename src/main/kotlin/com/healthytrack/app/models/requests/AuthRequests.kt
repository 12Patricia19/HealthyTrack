package com.healthytrack.app.models.requests

import java.math.BigDecimal
import java.time.LocalDate

data class RegisterRequest(
    val email: String,
    val password: String,
    val fullName: String,
    val dateOfBirth: LocalDate? = null,
    val gender: String? = null,
    val weightKg: BigDecimal? = null,
    val heightCm: BigDecimal? = null
)

data class LoginRequest(
    val email: String,
    val password: String
)

data class UpdateUserRequest(
    val fullName: String? = null,
    val dateOfBirth: LocalDate? = null,
    val gender: String? = null,
    val weightKg: BigDecimal? = null,
    val heightCm: BigDecimal? = null
)
