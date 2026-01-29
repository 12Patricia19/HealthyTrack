package com.healthytrack.app.services

import com.healthytrack.app.mappers.HabitNoteMapper
import com.healthytrack.app.models.requests.HabitNoteRequest
import com.healthytrack.app.models.responses.HabitNoteResponse
import com.healthytrack.app.repositories.DailyHabitRepository
import com.healthytrack.app.repositories.HabitNoteRepository
import org.springframework.stereotype.Service

@Service
class HabitNoteService(
    private val habitNoteRepository: HabitNoteRepository,
    private val dailyHabitRepository: DailyHabitRepository,
    private val habitNoteMapper: HabitNoteMapper
) {
    fun findAll(): List<HabitNoteResponse> =
        habitNoteRepository.findAll().map { habitNoteMapper.toResponse(it) }
    fun create(request: HabitNoteRequest): HabitNoteResponse {
        val dailyHabit = dailyHabitRepository.findById(request.dailyHabitId)
            .orElseThrow { NoSuchElementException("DailyHabit not found") }
        val entity = habitNoteMapper.toEntity(request, dailyHabit)
        val saved = habitNoteRepository.save(entity)
        return habitNoteMapper.toResponse(saved)
    }

    fun findByDailyHabitId(dailyHabitId: Long): List<HabitNoteResponse> =
        habitNoteRepository.findByDailyHabitId(dailyHabitId).map { habitNoteMapper.toResponse(it) }

    fun findById(id: Long): HabitNoteResponse =
        habitNoteRepository.findById(id).map { habitNoteMapper.toResponse(it) }
            .orElseThrow { NoSuchElementException("HabitNote not found") }

    fun update(id: Long, request: HabitNoteRequest): HabitNoteResponse {
        val existing = habitNoteRepository.findById(id)
            .orElseThrow { NoSuchElementException("HabitNote not found") }
        val dailyHabit = dailyHabitRepository.findById(request.dailyHabitId)
            .orElseThrow { NoSuchElementException("DailyHabit not found") }
        val updated = existing.copy(
            dailyHabit = dailyHabit,
            note = request.note
        )
        val saved = habitNoteRepository.save(updated)
        return habitNoteMapper.toResponse(saved)
    }

    fun delete(id: Long) {
        if (!habitNoteRepository.existsById(id)) throw NoSuchElementException("HabitNote not found")
        habitNoteRepository.deleteById(id)
    }
}