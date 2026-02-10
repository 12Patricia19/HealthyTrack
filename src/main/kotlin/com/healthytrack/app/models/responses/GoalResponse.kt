package com.healthytrack.app.models.responses

import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime

data class GoalResponse(
    val id: Long,
    val userId: Long,
    val goalType: String,
    val goalName: String,
    val description: String? = null,
    val targetValue: BigDecimal,
    val currentValue: BigDecimal = BigDecimal.ZERO,
    val unit: String,
    val frequency: String? = null,
    val isActive: Boolean,
    val startDate: LocalDate,
    val endDate: LocalDate? = null,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
