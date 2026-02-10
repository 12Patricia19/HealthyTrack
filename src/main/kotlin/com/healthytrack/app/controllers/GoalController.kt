package com.healthytrack.app.controllers

import com.healthytrack.app.models.requests.GoalRequest
import com.healthytrack.app.models.responses.GoalResponse
import com.healthytrack.app.services.GoalService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users/{userId}/goals")
class GoalController(
    private val goalService: GoalService
) {
    @PostMapping
    fun create(
        @PathVariable userId: Long,
        @RequestBody request: GoalRequest
    ): ResponseEntity<GoalResponse> =
        ResponseEntity(goalService.create(userId, request), HttpStatus.CREATED)

    @GetMapping
    fun findAllByUserId(@PathVariable userId: Long): ResponseEntity<List<GoalResponse>> =
        ResponseEntity.ok(goalService.findAllByUserId(userId))

    @GetMapping("/active")
    fun findActiveByUserId(@PathVariable userId: Long): ResponseEntity<List<GoalResponse>> =
        ResponseEntity.ok(goalService.findActiveByUserId(userId))

    @GetMapping("/{id}")
    fun findById(@PathVariable userId: Long, @PathVariable id: Long): ResponseEntity<GoalResponse> =
        ResponseEntity.ok(goalService.findById(id))

    @DeleteMapping("/{id}")
    fun delete(@PathVariable userId: Long, @PathVariable id: Long): ResponseEntity<Void> {
        goalService.delete(id)
        return ResponseEntity.noContent().build()
    }
}
