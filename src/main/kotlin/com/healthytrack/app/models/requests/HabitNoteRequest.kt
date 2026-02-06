package com.healthytrack.app.models.requests

import com.fasterxml.jackson.annotation.JsonAlias
import com.fasterxml.jackson.annotation.JsonProperty

data class HabitNoteRequest(
    @JsonProperty("daily_habit_id")
    @JsonAlias("dailyHabitId")
    val dailyHabitId: Long,
    
    val note: String
)