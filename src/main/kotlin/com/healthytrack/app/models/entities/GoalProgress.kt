package com.healthytrack.app.models.entities

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDate
import com.fasterxml.jackson.annotation.JsonIgnore

@Entity
@Table(name = "goals_progress")
data class GoalProgress(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "goal_id", nullable = false)
    @JsonIgnore
    val goal: Goal,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    val user: User,

    @Column(nullable = false)
    val date: LocalDate,

    @Column(name = "current_value", nullable = false, precision = 10, scale = 2)
    val currentValue: BigDecimal,

    @Column(name = "target_value", nullable = false, precision = 10, scale = 2)
    val targetValue: BigDecimal,

    @Column(name = "is_achieved")
    val isAchieved: Boolean = false
) : BaseEntity()
