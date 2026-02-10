package com.healthytrack.app.repositories

import com.healthytrack.app.models.entities.DailyHabit
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.time.LocalDate

@Repository
interface DailyHabitRepository : JpaRepository<DailyHabit, Long> {
    fun findByUserId(userId: Long): List<DailyHabit>
    fun findByUserIdAndDate(userId: Long, date: LocalDate): List<DailyHabit>
    fun findByUserIdAndHabitType(userId: Long, habitType: String): List<DailyHabit>
    
    fun countByUserId(userId: Long): Long
    fun countByUserIdAndDateBetween(userId: Long, startDate: LocalDate, endDate: LocalDate): Long
    
    @Query(value = "SELECT dh.habit_type, COUNT(dh) FROM daily_habits dh WHERE dh.user_id = :userId GROUP BY dh.habit_type ORDER BY COUNT(dh) DESC LIMIT 5", nativeQuery = true)
    fun findTopHabitTypesByUserId(@Param("userId") userId: Long): List<Array<Any>>
}

