package com.healthytrack.app.models.requests

import com.fasterxml.jackson.annotation.JsonProperty
import java.math.BigDecimal
import java.time.LocalDate

data class DailyHabitRequest(
    @JsonProperty("user_id")
    val userId: Long,

    val date: LocalDate,

    @JsonProperty("habit_type")
    val habitType: String,

    val value: BigDecimal? = null,

    val unit: String? = null,

    val description: String? = null,

    val notes: String? = null,

    @JsonProperty("entry_method")
    val entryMethod: String? = "manual"
)
