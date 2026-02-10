package com.healthytrack.app.controllers

import com.healthytrack.app.models.responses.UserStatsResponse
import com.healthytrack.app.services.StatsService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users/{userId}/stats")
class StatsController(
    private val statsService: StatsService
) {
    @GetMapping
    fun getUserStats(@PathVariable userId: Long): ResponseEntity<UserStatsResponse> =
        ResponseEntity.ok(statsService.getUserStats(userId))
}
