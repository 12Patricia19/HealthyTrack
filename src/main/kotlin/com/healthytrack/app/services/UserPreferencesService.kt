package com.healthytrack.app.services

import com.healthytrack.app.mappers.UserPreferencesMapper
import com.healthytrack.app.models.requests.UserPreferencesRequest
import com.healthytrack.app.models.responses.UserPreferencesResponse
import com.healthytrack.app.repositories.UserPreferencesRepository
import com.healthytrack.app.repositories.UserRepository
import org.springframework.stereotype.Service

@Service
class UserPreferencesService(
    private val preferencesRepository: UserPreferencesRepository,
    private val userRepository: UserRepository,
    private val preferencesMapper: UserPreferencesMapper
) {
    fun getByUserId(userId: Long): UserPreferencesResponse {
        val preferences = preferencesRepository.findByUserId(userId)
            .orElseThrow { NoSuchElementException("Preferences not found") }
        return preferencesMapper.toResponse(preferences)
    }

    fun update(userId: Long, request: UserPreferencesRequest): UserPreferencesResponse {
        val existing = preferencesRepository.findByUserId(userId)
            .orElseThrow { NoSuchElementException("Preferences not found") }
        
        val updated = existing.copy(
            notificationsEnabled = request.notificationsEnabled ?: existing.notificationsEnabled,
            pushNotifications = request.pushNotifications ?: existing.pushNotifications,
            emailNotifications = request.emailNotifications ?: existing.emailNotifications,
            waterReminder = request.waterReminder ?: existing.waterReminder,
            waterReminderInterval = request.waterReminderInterval ?: existing.waterReminderInterval,
            activityReminder = request.activityReminder ?: existing.activityReminder,
            activityReminderTime = request.activityReminderTime ?: existing.activityReminderTime,
            sleepReminder = request.sleepReminder ?: existing.sleepReminder,
            sleepReminderTime = request.sleepReminderTime ?: existing.sleepReminderTime,
            language = request.language ?: existing.language,
            timezone = request.timezone ?: existing.timezone
        )
        
        val saved = preferencesRepository.save(updated)
        return preferencesMapper.toResponse(saved)
    }
}
