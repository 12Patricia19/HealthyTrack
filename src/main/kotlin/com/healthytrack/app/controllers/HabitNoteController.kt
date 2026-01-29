package com.healthytrack.app.controllers

import com.healthytrack.app.models.requests.HabitNoteRequest
import com.healthytrack.app.models.responses.HabitNoteResponse
import com.healthytrack.app.services.HabitNoteService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/habit-notes")
class HabitNoteController(
    private val habitNoteService: HabitNoteService
) {
    @GetMapping
    fun findAll(): ResponseEntity<List<HabitNoteResponse>> =
        ResponseEntity.ok(habitNoteService.findAll())
    @PostMapping
    fun create(@RequestBody request: HabitNoteRequest): ResponseEntity<HabitNoteResponse> =
        ResponseEntity(habitNoteService.create(request), HttpStatus.CREATED)

    @GetMapping("/daily-habit/{dailyHabitId}")
    fun findByDailyHabitId(@PathVariable dailyHabitId: Long): ResponseEntity<List<HabitNoteResponse>> =
        ResponseEntity.ok(habitNoteService.findByDailyHabitId(dailyHabitId))

    @GetMapping("/{id}")
    fun findById(@PathVariable id: Long): ResponseEntity<HabitNoteResponse> =
        ResponseEntity.ok(habitNoteService.findById(id))

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody request: HabitNoteRequest): ResponseEntity<HabitNoteResponse> =
        ResponseEntity.ok(habitNoteService.update(id, request))

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        habitNoteService.delete(id)
        return ResponseEntity.noContent().build()
    }
}