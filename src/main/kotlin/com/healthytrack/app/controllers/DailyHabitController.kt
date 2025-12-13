package com.healthytrack.app.controllers

import com.healthytrack.app.models.requests.DailyHabitRequest
import com.healthytrack.app.models.responses.DailyHabitResponse
import com.healthytrack.app.services.DailyHabitService
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDate

@RestController
@RequestMapping(value = ["/api/daily-habits"])
class DailyHabitController(
    private val dailyHabitService: DailyHabitService
) {

    @PostMapping
    fun create(@RequestBody request: DailyHabitRequest): ResponseEntity<DailyHabitResponse> {
        val response = dailyHabitService.save(request)
        return ResponseEntity(response, HttpStatus.CREATED)
    }

    @GetMapping
    fun findAll(): ResponseEntity<List<DailyHabitResponse>> {
        val response = dailyHabitService.findAll()
        return ResponseEntity.ok(response)
    }

    @GetMapping("/{id}")
    fun findById(@PathVariable id: Long): ResponseEntity<DailyHabitResponse> {
        val response = dailyHabitService.findById(id)
        return ResponseEntity.ok(response)
    }

    @GetMapping("/user/{userId}")
    fun findByUserId(@PathVariable userId: Long): ResponseEntity<List<DailyHabitResponse>> {
        val response = dailyHabitService.findByUserId(userId)
        return ResponseEntity.ok(response)
    }

    @GetMapping("/user/{userId}/date/{date}")
    fun findByUserIdAndDate(
        @PathVariable userId: Long,
        @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) date: LocalDate
    ): ResponseEntity<List<DailyHabitResponse>> {
        val response = dailyHabitService.findByUserIdAndDate(userId, date)
        return ResponseEntity.ok(response)
    }

    @PutMapping("/{id}")
    fun update(
        @PathVariable id: Long,
        @RequestBody request: DailyHabitRequest
    ): ResponseEntity<DailyHabitResponse> {
        val response = dailyHabitService.update(id, request)
        return ResponseEntity.ok(response)
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        dailyHabitService.delete(id)
        return ResponseEntity.noContent().build()
    }
}
