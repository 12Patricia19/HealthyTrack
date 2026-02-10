package com.healthytrack.app.models.requests

import com.fasterxml.jackson.annotation.JsonAlias
import com.fasterxml.jackson.annotation.JsonProperty
import java.math.BigDecimal
import java.time.LocalDate

data class DailyHabitRequest(
    @JsonProperty("user_id")
    @JsonAlias("userId")
    val userId: Long,

    val date: LocalDate,

    @JsonProperty("habit_type")
    @JsonAlias("habitType")
    val habitType: String,

    @JsonProperty("habit_name")
    @JsonAlias("habitName")
    val habitName: String? = null,

    val value: BigDecimal? = null,

    val unit: String? = null,

    val description: String? = null,

    val notes: String? = null,

    @JsonProperty("entry_method")
    @JsonAlias("entryMethod")
    val entryMethod: String? = "manual"
)
