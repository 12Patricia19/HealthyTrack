package com.healthytrack.app.repositories

import com.healthytrack.app.models.entities.HabitNote
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface HabitNoteRepository : JpaRepository<HabitNote, Long> {
    fun findByDailyHabitId(dailyHabitId: Long): List<HabitNote>
}