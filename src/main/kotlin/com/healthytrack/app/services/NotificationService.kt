package com.healthytrack.app.services

import com.healthytrack.app.mappers.NotificationMapper
import com.healthytrack.app.models.requests.NotificationRequest
import com.healthytrack.app.models.responses.NotificationResponse
import com.healthytrack.app.repositories.NotificationRepository
import com.healthytrack.app.repositories.UserRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class NotificationService(
    private val notificationRepository: NotificationRepository,
    private val userRepository: UserRepository,
    private val notificationMapper: NotificationMapper
) {
    fun create(userId: Long, request: NotificationRequest): NotificationResponse {
        val user = userRepository.findById(userId)
            .orElseThrow { NoSuchElementException("User not found") }
        
        val entity = notificationMapper.toEntity(request, user)
        val saved = notificationRepository.save(entity)
        return notificationMapper.toResponse(saved)
    }

    fun findAllByUserId(userId: Long): List<NotificationResponse> =
        notificationRepository.findByUserIdAndIsRead(userId, false)
            .map { notificationMapper.toResponse(it) }

    fun findPendingByUserId(userId: Long): List<NotificationResponse> =
        notificationRepository.findByUserIdAndIsSent(userId, false)
            .map { notificationMapper.toResponse(it) }

    fun markAsRead(id: Long): NotificationResponse {
        val notification = notificationRepository.findById(id)
            .orElseThrow { NoSuchElementException("Notification not found") }
        
        val updated = notification.copy(isRead = true)
        val saved = notificationRepository.save(updated)
        return notificationMapper.toResponse(saved)
    }
}
