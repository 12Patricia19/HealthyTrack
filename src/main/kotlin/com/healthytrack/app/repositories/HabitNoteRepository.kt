package com.healthytrack.app.repositories

import com.healthytrack.app.models.entities.HabitNote
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface HabitNoteRepository : JpaRepository<HabitNote, Long> {
    fun findByDailyHabitId(dailyHabitId: Long): List<HabitNote>
    
    @Query("SELECT hn FROM HabitNote hn WHERE hn.dailyHabit.user.id = :userId")
    fun findByUserId(@Param("userId") userId: Long): List<HabitNote>
}