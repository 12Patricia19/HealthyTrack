package com.healthytrack.app.controllers

import com.healthytrack.app.models.requests.NotificationRequest
import com.healthytrack.app.models.responses.NotificationResponse
import com.healthytrack.app.services.NotificationService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users/{userId}/notifications")
class NotificationController(
    private val notificationService: NotificationService
) {
    @PostMapping
    fun create(
        @PathVariable userId: Long,
        @RequestBody request: NotificationRequest
    ): ResponseEntity<NotificationResponse> =
        ResponseEntity(notificationService.create(userId, request), HttpStatus.CREATED)

    @GetMapping
    fun findAllByUserId(@PathVariable userId: Long): ResponseEntity<List<NotificationResponse>> =
        ResponseEntity.ok(notificationService.findAllByUserId(userId))

    @GetMapping("/pending")
    fun findPendingByUserId(@PathVariable userId: Long): ResponseEntity<List<NotificationResponse>> =
        ResponseEntity.ok(notificationService.findPendingByUserId(userId))

    @PatchMapping("/{id}/read")
    fun markAsRead(@PathVariable userId: Long, @PathVariable id: Long): ResponseEntity<NotificationResponse> =
        ResponseEntity.ok(notificationService.markAsRead(id))
}
