package com.healthytrack.app.repositories

import com.healthytrack.app.models.entities.Notification
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface NotificationRepository : JpaRepository<Notification, Long> {
    fun findByUserIdAndIsRead(userId: Long, isRead: Boolean = false): List<Notification>
    fun findByUserIdAndIsSent(userId: Long, isSent: Boolean): List<Notification>
    fun findByScheduledTimeBeforeAndIsSent(time: LocalDateTime, isSent: Boolean = false): List<Notification>
}
