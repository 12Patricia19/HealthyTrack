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
    
    @Query("SELECT dh.habitType, COUNT(dh) FROM DailyHabit dh WHERE dh.user.id = :userId GROUP BY dh.habitType ORDER BY COUNT(dh) DESC")
    fun findTopHabitTypesByUserId(@Param("userId") userId: Long, limit: Int = 5): List<Array<Any>>
}

