package com.healthytrack.app.mappers

import com.healthytrack.app.models.entities.HabitNote
import com.healthytrack.app.models.entities.DailyHabit
import com.healthytrack.app.models.requests.HabitNoteRequest
import com.healthytrack.app.models.responses.HabitNoteResponse
import org.springframework.stereotype.Component

@Component
class HabitNoteMapper {
    fun toEntity(request: HabitNoteRequest, dailyHabit: DailyHabit): HabitNote =
        HabitNote(
            dailyHabit = dailyHabit,
            note = request.note
        )

    fun toResponse(habitNote: HabitNote): HabitNoteResponse =
        HabitNoteResponse(
            id = habitNote.id,
            dailyHabitId = habitNote.dailyHabit.id,
            note = habitNote.note,
            createdAt = habitNote.createdAt,
            updatedAt = habitNote.updatedAt
        )
}