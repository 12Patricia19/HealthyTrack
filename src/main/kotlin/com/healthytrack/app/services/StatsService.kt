package com.healthytrack.app.services

import com.healthytrack.app.models.responses.HabitTypeCount
import com.healthytrack.app.models.responses.UserStatsResponse
import com.healthytrack.app.repositories.DailyHabitRepository
import com.healthytrack.app.repositories.GoalProgressRepository
import com.healthytrack.app.repositories.GoalRepository
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class StatsService(
    private val dailyHabitRepository: DailyHabitRepository,
    private val goalRepository: GoalRepository,
    private val goalProgressRepository: GoalProgressRepository
) {
    fun getUserStats(userId: Long): UserStatsResponse {
        val today = LocalDate.now()
        val startOfWeek = today.minusDays(today.dayOfWeek.value.toLong() - 1)
        val startOfMonth = today.withDayOfMonth(1)
        
        val totalHabits = dailyHabitRepository.countByUserId(userId)
        val habitsToday = dailyHabitRepository.findByUserIdAndDate(userId, today).size.toLong()
        val habitsThisWeek = dailyHabitRepository.countByUserIdAndDateBetween(userId, startOfWeek, today)
        val habitsThisMonth = dailyHabitRepository.countByUserIdAndDateBetween(userId, startOfMonth, today)
        
        val activeGoals = goalRepository.findByUserIdAndIsActive(userId, true).size
        
        val achievedGoalsToday = goalRepository.findByUserIdAndIsActive(userId, true)
            .count { goal ->
                val progress = goalProgressRepository.findByGoalIdAndDate(goal.id, today)
                progress?.isAchieved == true
            }
        
        val topHabits = dailyHabitRepository.findTopHabitTypesByUserId(userId)
            .map { result ->
                HabitTypeCount(
                    habitType = result[0] as String,
                    count = (result[1] as Long),
                    totalValue = null
                )
            }
        
        return UserStatsResponse(
            totalHabits = totalHabits,
            habitsToday = habitsToday,
            habitsThisWeek = habitsThisWeek,
            habitsThisMonth = habitsThisMonth,
            activeGoals = activeGoals,
            achievedGoalsToday = achievedGoalsToday,
            topHabits = topHabits
        )
    }
}
