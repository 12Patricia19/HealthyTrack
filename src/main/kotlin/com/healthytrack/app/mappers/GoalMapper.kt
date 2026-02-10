package com.healthytrack.app.mappers

import com.healthytrack.app.models.entities.Goal
import com.healthytrack.app.models.entities.User
import com.healthytrack.app.models.requests.GoalRequest
import com.healthytrack.app.models.responses.GoalResponse
import org.springframework.stereotype.Component

@Component
class GoalMapper {
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

    fun toResponse(goal: Goal): GoalResponse =
        GoalResponse(
            id = goal.id,
            userId = goal.user.id,
            goalType = goal.goalType,
            goalName = goal.goalName,
            description = goal.description,
            targetValue = goal.targetValue,
            unit = goal.unit,
            frequency = goal.frequency,
            isActive = goal.isActive,
            startDate = goal.startDate,
            endDate = goal.endDate,
            createdAt = goal.createdAt,
            updatedAt = goal.updatedAt
        )
}
