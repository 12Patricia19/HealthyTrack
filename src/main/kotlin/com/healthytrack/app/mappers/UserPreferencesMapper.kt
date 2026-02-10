package com.healthytrack.app.mappers

import com.healthytrack.app.models.entities.UserPreferences
import com.healthytrack.app.models.entities.User
import com.healthytrack.app.models.requests.UserPreferencesRequest
import com.healthytrack.app.models.responses.UserPreferencesResponse
import org.springframework.stereotype.Component

@Component
class UserPreferencesMapper {
    fun toEntity(request: UserPreferencesRequest, user: User): UserPreferences =
        UserPreferences(
            user = user,
            notificationsEnabled = request.notificationsEnabled ?: true,
            pushNotifications = request.pushNotifications ?: true,
            emailNotifications = request.emailNotifications ?: false,
            waterReminder = request.waterReminder ?: true,
            waterReminderInterval = request.waterReminderInterval ?: 120,
            activityReminder = request.activityReminder ?: true,
            activityReminderTime = request.activityReminderTime,
            sleepReminder = request.sleepReminder ?: true,
            sleepReminderTime = request.sleepReminderTime,
            language = request.language ?: "es-ES",
            timezone = request.timezone ?: "America/Guayaquil"
        )

    fun toResponse(preferences: UserPreferences): UserPreferencesResponse =
        UserPreferencesResponse(
            id = preferences.id,
            userId = preferences.user.id,
            notificationsEnabled = preferences.notificationsEnabled,
            pushNotifications = preferences.pushNotifications,
            emailNotifications = preferences.emailNotifications,
            waterReminder = preferences.waterReminder,
            waterReminderInterval = preferences.waterReminderInterval,
            activityReminder = preferences.activityReminder,
            activityReminderTime = preferences.activityReminderTime,
            sleepReminder = preferences.sleepReminder,
            sleepReminderTime = preferences.sleepReminderTime,
            language = preferences.language,
            timezone = preferences.timezone,
            googleFitEnabled = preferences.googleFitEnabled,
            createdAt = preferences.createdAt,
            updatedAt = preferences.updatedAt
        )
}
