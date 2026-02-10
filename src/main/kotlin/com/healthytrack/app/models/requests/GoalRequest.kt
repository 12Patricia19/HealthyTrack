package com.healthytrack.app.models.requests

import java.math.BigDecimal
import java.time.LocalDate

data class GoalRequest(
    val goalType: String,
    val goalName: String,
    val description: String? = null,
    val targetValue: BigDecimal,
    val unit: String,
    val frequency: String? = null,
    val startDate: LocalDate,
    val endDate: LocalDate? = null
)
