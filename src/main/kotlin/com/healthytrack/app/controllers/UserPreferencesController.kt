package com.healthytrack.app.controllers

import com.healthytrack.app.models.requests.UserPreferencesRequest
import com.healthytrack.app.models.responses.UserPreferencesResponse
import com.healthytrack.app.services.UserPreferencesService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users/{userId}/preferences")
class UserPreferencesController(
    private val preferencesService: UserPreferencesService
) {
    @GetMapping
    fun getByUserId(@PathVariable userId: Long): ResponseEntity<UserPreferencesResponse> =
        ResponseEntity.ok(preferencesService.getByUserId(userId))

    @PutMapping
    fun update(
        @PathVariable userId: Long,
        @RequestBody request: UserPreferencesRequest
    ): ResponseEntity<UserPreferencesResponse> =
        ResponseEntity.ok(preferencesService.update(userId, request))
}
