package com.healthytrack.app.mappers

import com.healthytrack.app.models.entities.DailyHabit
import com.healthytrack.app.models.entities.User
import com.healthytrack.app.models.requests.DailyHabitRequest
import com.healthytrack.app.models.responses.DailyHabitResponse
import org.springframework.stereotype.Component
import java.time.LocalDateTime

@Component
class DailyHabitMapper {
    
    fun toEntity(request: DailyHabitRequest, user: User): DailyHabit {
        return DailyHabit(
            user = user,
            date = request.date,
            timestamp = LocalDateTime.now(),
            habitType = request.habitType,
            habitName = request.habitName,
            value = request.value,
            unit = request.unit,
            description = request.description,
            notes = request.notes,
            entryMethod = request.entryMethod ?: "manual"
        )
    }
    
    fun toResponse(dailyHabit: DailyHabit): DailyHabitResponse {
        return DailyHabitResponse(
            id = dailyHabit.id,
            userId = dailyHabit.user.id,
            date = dailyHabit.date,
            timestamp = dailyHabit.timestamp,
            habitType = dailyHabit.habitType,
            habitName = dailyHabit.habitName,
            value = dailyHabit.value,
            unit = dailyHabit.unit,
            description = dailyHabit.description,
            notes = dailyHabit.notes,
            entryMethod = dailyHabit.entryMethod,
            createdAt = dailyHabit.createdAt,
            updatedAt = dailyHabit.updatedAt
        )
    }
}
