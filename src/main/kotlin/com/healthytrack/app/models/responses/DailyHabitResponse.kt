package com.healthytrack.app.models.responses

import com.fasterxml.jackson.annotation.JsonProperty
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime

data class DailyHabitResponse(
    val id: Long,

    @JsonProperty("user_id")
    val userId: Long,

    val date: LocalDate,

    val timestamp: LocalDateTime,

    @JsonProperty("habit_type")
    val habitType: String,

    val value: BigDecimal?,

    val unit: String?,

    val description: String?,

    val notes: String?,

    @JsonProperty("entry_method")
    val entryMethod: String?,

    @JsonProperty("created_at")
    val createdAt: LocalDateTime,

    @JsonProperty("updated_at")
    val updatedAt: LocalDateTime
)
