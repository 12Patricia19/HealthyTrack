package com.healthytrack.app.models.entities

import jakarta.persistence.*
import java.time.LocalTime
import com.fasterxml.jackson.annotation.JsonIgnore

@Entity
@Table(name = "user_preferences")
data class UserPreferences(
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    val user: User,

    @Column(name = "notifications_enabled")
    val notificationsEnabled: Boolean = true,

    @Column(name = "push_notifications")
    val pushNotifications: Boolean = true,

    @Column(name = "email_notifications")
    val emailNotifications: Boolean = false,

    @Column(name = "water_reminder")
    val waterReminder: Boolean = true,

    @Column(name = "water_reminder_interval")
    val waterReminderInterval: Int = 120,

    @Column(name = "activity_reminder")
    val activityReminder: Boolean = true,

    @Column(name = "activity_reminder_time")
    val activityReminderTime: LocalTime? = LocalTime.of(18, 0),

    @Column(name = "sleep_reminder")
    val sleepReminder: Boolean = true,

    @Column(name = "sleep_reminder_time")
    val sleepReminderTime: LocalTime? = LocalTime.of(22, 0),

    @Column(length = 10)
    val language: String = "es-ES",

    @Column(length = 50)
    val timezone: String = "America/Guayaquil",

    @Column(name = "google_fit_enabled")
    val googleFitEnabled: Boolean = false,

    @Column(name = "google_fit_token", columnDefinition = "TEXT")
    val googleFitToken: String? = null
) : BaseEntity()
