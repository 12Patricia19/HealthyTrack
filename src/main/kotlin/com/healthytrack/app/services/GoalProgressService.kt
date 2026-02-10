package com.healthytrack.app.services

import com.healthytrack.app.models.entities.GoalProgress
import com.healthytrack.app.repositories.GoalProgressRepository
import com.healthytrack.app.repositories.GoalRepository
import com.healthytrack.app.repositories.UserRepository
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.time.LocalDate

@Service
class GoalProgressService(
    private val goalProgressRepository: GoalProgressRepository,
    private val goalRepository: GoalRepository,
    private val userRepository: UserRepository
) {
    fun updateProgress(userId: Long, habitType: String, value: BigDecimal, date: LocalDate) {
        val activeGoals = goalRepository.findByUserIdAndIsActive(userId, true)
        
        activeGoals.filter { it.goalType.equals(habitType, ignoreCase = true) }
            .forEach { goal ->
                val user = userRepository.findById(userId).orElseThrow()
                val existingProgress = goalProgressRepository.findByGoalIdAndDate(goal.id, date)
                
                if (existingProgress != null) {
                    val updatedProgress = existingProgress.copy(
                        currentValue = existingProgress.currentValue.add(value)
                    )
                    goalProgressRepository.save(updatedProgress)
                } else {
                    val newProgress = GoalProgress(
                        goal = goal,
                        user = user,
                        date = date,
                        currentValue = value,
                        targetValue = goal.targetValue,
                        isAchieved = value >= goal.targetValue
                    )
                    goalProgressRepository.save(newProgress)
                }
            }
    }
}
