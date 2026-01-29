package com.healthytrack.app.models.entities

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table

@Entity
@Table(name = "habit_notes")
data class HabitNote(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "daily_habit_id", nullable = false)
    val dailyHabit: DailyHabit,

    @Column(length = 2000, nullable = false)
    val note: String
) : BaseEntity()