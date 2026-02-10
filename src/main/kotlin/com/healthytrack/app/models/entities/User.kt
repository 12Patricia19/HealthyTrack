package com.healthytrack.app.models.entities

import jakarta.persistence.*
import com.fasterxml.jackson.annotation.JsonIgnore
import java.time.LocalDate
import java.time.LocalDateTime
import java.math.BigDecimal

@Entity
@Table(name = "users")
data class User(
    @Column(nullable = false, unique = true)
    val email: String,

    @Column(name = "password_hash", nullable = false)
    @JsonIgnore
    val passwordHash: String,

    @Column(name = "google_id", unique = true)
    val googleId: String? = null,

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    val role: Role,

    @Column(name = "full_name", nullable = false)
    val fullName: String,

    @Column(name = "date_of_birth")
    val dateOfBirth: LocalDate? = null,

    @Column(length = 20)
    val gender: String? = null,

    @Column(name = "weight_kg", precision = 5, scale = 2)
    val weightKg: BigDecimal? = null,

    @Column(name = "height_cm", precision = 5, scale = 2)
    val heightCm: BigDecimal? = null,

    @Column(name = "email_verified")
    val emailVerified: Boolean = false,

    @Column(name = "is_active")
    val isActive: Boolean = true,

    @Column(name = "last_login")
    val lastLogin: LocalDateTime? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coach_id")
    @JsonIgnore
    val coach: User? = null,

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    val dailyHabits: List<DailyHabit> = emptyList(),

    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    val preferences: UserPreferences? = null,

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    val goals: List<Goal> = emptyList()
) : BaseEntity()