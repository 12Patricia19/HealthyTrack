package com.healthytrack.app.mappers

import com.healthytrack.app.models.entities.Goal
import com.healthytrack.app.models.entities.User
import com.healthytrack.app.models.requests.GoalRequest
import com.healthytrack.app.models.responses.GoalResponse
import com.healthytrack.app.repositories.GoalProgressRepository
import org.springframework.stereotype.Component
import java.math.BigDecimal
import java.time.LocalDate

@Component
class GoalMapper(
    private val goalProgressRepository: GoalProgressRepository
) {
    fun toEntity(request: GoalRequest, user: User): Goal =
        Goal(
            user = user,
            goalType = request.goalType,
            goalName = request.goalName,
            description = request.description,
            targetValue = request.targetValue,
            unit = request.unit,
            frequency = request.frequency,
            startDate = request.startDate,
            endDate = request.endDate
        )

    fun toResponse(goal: Goal): GoalResponse {
        val currentValue = calculateCurrentProgress(goal)
        return GoalResponse(
            id = goal.id,
            userId = goal.user.id,
            goalType = goal.goalType,
            goalName = goal.goalName,
            description = goal.description,
            targetValue = goal.targetValue,
            currentValue = currentValue,
            unit = goal.unit,
            frequency = goal.frequency,
            isActive = goal.isActive,
            startDate = goal.startDate,
            endDate = goal.endDate,
            createdAt = goal.createdAt,
            updatedAt = goal.updatedAt
        )
    }

    private fun calculateCurrentProgress(goal: Goal): BigDecimal {
        val today = LocalDate.now()
        return when (goal.frequency?.lowercase()) {
            "diario" -> {
                val progress = goalProgressRepository.findByGoalIdAndDate(goal.id, today)
                progress?.currentValue ?: BigDecimal.ZERO
            }
            "semanal" -> {
                val startOfWeek = today.minusDays(today.dayOfWeek.value.toLong() - 1)
                goalProgressRepository.sumProgressByGoalAndDateRange(goal.id, startOfWeek, today)
            }
            "mensual" -> {
                val startOfMonth = today.withDayOfMonth(1)
                goalProgressRepository.sumProgressByGoalAndDateRange(goal.id, startOfMonth, today)
            }
            else -> BigDecimal.ZERO
        }
    }
}
