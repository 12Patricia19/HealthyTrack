package com.healthytrack.app.models.entities

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDate
import com.fasterxml.jackson.annotation.JsonIgnore

@Entity
@Table(name = "goals")
data class Goal(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    val user: User,

    @Column(name = "goal_type", nullable = false, length = 50)
    val goalType: String,

    @Column(name = "goal_name", nullable = false)
    val goalName: String,

    @Column(columnDefinition = "TEXT")
    val description: String? = null,

    @Column(name = "target_value", nullable = false, precision = 10, scale = 2)
    val targetValue: BigDecimal,

    @Column(nullable = false, length = 50)
    val unit: String,

    @Column(length = 20)
    val frequency: String? = null,

    @Column(name = "is_active")
    val isActive: Boolean = true,

    @Column(name = "start_date", nullable = false)
    val startDate: LocalDate,

    @Column(name = "end_date")
    val endDate: LocalDate? = null
) : BaseEntity()
