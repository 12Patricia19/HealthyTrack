package com.healthytrack.app.models.responses

import java.time.LocalDateTime

data class HabitNoteResponse(
    val id: Long,
    val dailyHabitId: Long,
    val note: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)