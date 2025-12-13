package com.healthytrack.app.repositories

import com.healthytrack.app.models.entities.DailyHabit
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDate

@Repository
interface DailyHabitRepository : JpaRepository<DailyHabit, Long> {
    fun findByUserId(userId: Long): List<DailyHabit>
    fun findByUserIdAndDate(userId: Long, date: LocalDate): List<DailyHabit>
    fun findByUserIdAndHabitType(userId: Long, habitType: String): List<DailyHabit>
}
