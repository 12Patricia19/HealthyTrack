// ...existing code...
package com.healthytrack.app.services

import com.healthytrack.app.exceptions.DailyHabitNotFoundException
import com.healthytrack.app.exceptions.InvalidHabitTypeException
import com.healthytrack.app.mappers.DailyHabitMapper
import com.healthytrack.app.models.requests.DailyHabitRequest
import com.healthytrack.app.models.responses.DailyHabitResponse
import com.healthytrack.app.repositories.DailyHabitRepository
import com.healthytrack.app.repositories.UserRepository
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class DailyHabitService(
    private val dailyHabitRepository: DailyHabitRepository,
    private val dailyHabitMapper: DailyHabitMapper,
    private val userRepository: UserRepository
) {

    private val validHabitTypes = listOf(
        "actividad_fisica",
        "comida",
        "agua",
        "sueño",
        "mindfulness"
    )


    fun save(request: DailyHabitRequest): DailyHabitResponse {
        // Validar tipo de hábito
        if (request.habitType !in validHabitTypes) {
            throw InvalidHabitTypeException(
                "Tipo de hábito inválido. Debe ser uno de: ${validHabitTypes.joinToString(", ")}" 
            )
        }

        // Obtener usuario
        val user = userRepository.findById(request.userId)
            .orElseThrow { NoSuchElementException("User with id ${request.userId} not found") }

        val entity = dailyHabitMapper.toEntity(request, user)
        val savedHabit = dailyHabitRepository.save(entity)
        return dailyHabitMapper.toResponse(savedHabit)
    }

    fun findAll(): List<DailyHabitResponse> {
        val habits = dailyHabitRepository.findAll()
        return habits.map { dailyHabitMapper.toResponse(it) }
    }

    fun findById(id: Long): DailyHabitResponse {
        val habit = dailyHabitRepository.findById(id)
            .orElseThrow { DailyHabitNotFoundException("Hábito diario con ID $id no encontrado") }
        return dailyHabitMapper.toResponse(habit)
    }

    fun findByUserId(userId: Long): List<DailyHabitResponse> {
        val habits = dailyHabitRepository.findByUserId(userId)
        return habits.map { dailyHabitMapper.toResponse(it) }
    }

    fun findByUserIdAndDate(userId: Long, date: LocalDate): List<DailyHabitResponse> {
        val habits = dailyHabitRepository.findByUserIdAndDate(userId, date)
        return habits.map { dailyHabitMapper.toResponse(it) }
    }

    fun update(id: Long, request: DailyHabitRequest): DailyHabitResponse {
        // Verificar que existe
        val existingHabit = dailyHabitRepository.findById(id)
            .orElseThrow { DailyHabitNotFoundException("Hábito diario con ID $id no encontrado") }

        // Validar tipo de hábito
        if (request.habitType !in validHabitTypes) {
            throw InvalidHabitTypeException(
                "Tipo de hábito inválido. Debe ser uno de: ${validHabitTypes.joinToString(", ")}"
            )
        }

        // Obtener usuario
        val user = userRepository.findById(request.userId)
            .orElseThrow { NoSuchElementException("User with id ${request.userId} not found") }

        // Crear nueva entidad con el ID existente
        val updatedEntity = dailyHabitMapper.toEntity(request, user).apply {
            this.id = existingHabit.id
        }

        val savedHabit = dailyHabitRepository.save(updatedEntity)
        return dailyHabitMapper.toResponse(savedHabit)
    }

    fun delete(id: Long) {
        if (!dailyHabitRepository.existsById(id)) {
            throw DailyHabitNotFoundException("Hábito diario con ID $id no encontrado")
        }
        dailyHabitRepository.deleteById(id)
    }
}
