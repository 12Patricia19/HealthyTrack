package com.healthytrack.app.models.entities


import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import jakarta.persistence.FetchType
import com.fasterxml.jackson.annotation.JsonIgnore


@Entity
@Table(name = "users")
data class User(
    @Column(name = "first_name", nullable = false)
    val firstName: String,

    @Column(name = "last_name", nullable = false)
    val lastName: String,

    @Column(name = "email", nullable = false, unique = true)
    val email: String,

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    val dailyHabits: List<DailyHabit> = emptyList()
) : BaseEntity()