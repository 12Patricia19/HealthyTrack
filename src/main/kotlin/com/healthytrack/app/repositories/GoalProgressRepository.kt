package com.healthytrack.app.repositories

import com.healthytrack.app.models.entities.GoalProgress
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.time.LocalDate

@Repository
interface GoalProgressRepository : JpaRepository<GoalProgress, Long> {
    fun findByGoalIdAndDate(goalId: Long, date: LocalDate): GoalProgress?
    
    @Query("SELECT COALESCE(SUM(gp.currentValue), 0) FROM GoalProgress gp WHERE gp.goal.id = :goalId AND gp.date >= :startDate AND gp.date <= :endDate")
    fun sumProgressByGoalAndDateRange(
        @Param("goalId") goalId: Long,
        @Param("startDate") startDate: LocalDate,
        @Param("endDate") endDate: LocalDate
    ): java.math.BigDecimal
    
    fun findByGoalId(goalId: Long): List<GoalProgress>
}
