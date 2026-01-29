package com.healthytrack.app.models.requests

data class HabitNoteRequest(
    val dailyHabitId: Long,
    val note: String
)