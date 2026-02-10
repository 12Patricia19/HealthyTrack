package com.healthytrack.app.models.requests

import java.time.LocalTime

data class UserPreferencesRequest(
    val notificationsEnabled: Boolean? = null,
    val pushNotifications: Boolean? = null,
    val emailNotifications: Boolean? = null,
    val waterReminder: Boolean? = null,
    val waterReminderInterval: Int? = null,
    val activityReminder: Boolean? = null,
    val activityReminderTime: LocalTime? = null,
    val sleepReminder: Boolean? = null,
    val sleepReminderTime: LocalTime? = null,
    val language: String? = null,
    val timezone: String? = null
)
