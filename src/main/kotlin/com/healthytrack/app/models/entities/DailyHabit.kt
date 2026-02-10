package com.healthytrack.app.models.entities

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Table
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime

import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import com.fasterxml.jackson.annotation.JsonIgnore

@Entity
@Table(name = "daily_habits")
data class DailyHabit(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    val user: User,

    @Column(nullable = false)
    val date: LocalDate,

    @Column(name = "habit_timestamp", nullable = false)
    val timestamp: LocalDateTime = LocalDateTime.now(),

    @Column(name = "habit_type", nullable = false, length = 50)
    val habitType: String,

    @Column(name = "habit_name")
    val habitName: String? = null,

    @Column(name = "habit_value", precision = 10, scale = 2)
    val value: BigDecimal? = null,

    @Column(length = 50)
    val unit: String? = null,

    @Column(length = 1000)
    val description: String? = null,

    @Column(length = 2000)
    val notes: String? = null,

    @Column(name = "entry_method")
    val entryMethod: String? = null // manual, google_fit, automatico
) : BaseEntity()
