package com.healthytrack.app.mappers

import com.healthytrack.app.models.entities.Notification
import com.healthytrack.app.models.entities.User
import com.healthytrack.app.models.requests.NotificationRequest
import com.healthytrack.app.models.responses.NotificationResponse
import org.springframework.stereotype.Component

@Component
class NotificationMapper {
    fun toEntity(request: NotificationRequest, user: User): Notification =
        Notification(
            user = user,
            notificationType = request.notificationType,
            title = request.title,
            message = request.message,
            scheduledTime = request.scheduledTime,
            priority = request.priority
        )

    fun toResponse(notification: Notification): NotificationResponse =
        NotificationResponse(
            id = notification.id,
            userId = notification.user.id,
            notificationType = notification.notificationType,
            title = notification.title,
            message = notification.message,
            scheduledTime = notification.scheduledTime,
            sentAt = notification.sentAt,
            isRead = notification.isRead,
            isSent = notification.isSent,
            priority = notification.priority,
            createdAt = notification.createdAt
        )
}
