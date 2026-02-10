package com.healthytrack.app.models.responses

import java.math.BigDecimal

data class UserStatsResponse(
    val totalHabits: Long,
    val habitsToday: Long,
    val habitsThisWeek: Long,
    val habitsThisMonth: Long,
    val activeGoals: Int,
    val achievedGoalsToday: Int,
    val topHabits: List<HabitTypeCount>
)

data class HabitTypeCount(
    val habitType: String,
    val count: Long,
    val totalValue: BigDecimal?
)
