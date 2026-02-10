package com.healthytrack.app.models.responses

import java.time.LocalTime
import java.time.LocalDateTime

data class UserPreferencesResponse(
    val id: Long,
    val userId: Long,
    val notificationsEnabled: Boolean,
    val pushNotifications: Boolean,
    val emailNotifications: Boolean,
    val waterReminder: Boolean,
    val waterReminderInterval: Int,
    val activityReminder: Boolean,
    val activityReminderTime: LocalTime?,
    val sleepReminder: Boolean,
    val sleepReminderTime: LocalTime?,
    val language: String,
    val timezone: String,
    val googleFitEnabled: Boolean,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
