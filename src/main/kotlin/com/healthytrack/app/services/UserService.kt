package com.healthytrack.app.services

import com.healthytrack.app.mappers.UserMapper
import com.healthytrack.app.models.entities.User
import com.healthytrack.app.models.requests.UserRequest
import com.healthytrack.app.models.responses.UserResponse
import com.healthytrack.app.repositories.UserRepository
import org.springframework.stereotype.Service

@Service
class UserService(
    private val userRepository: UserRepository,
    private val userMapper: UserMapper
) {
    fun create(request: UserRequest): UserResponse {
        val entity = userMapper.toEntity(request)
        val saved = userRepository.save(entity)
        return userMapper.toResponse(saved)
    }

    fun findAll(): List<UserResponse> =
        userRepository.findAll().map { userMapper.toResponse(it) }

    fun findById(id: Long): UserResponse =
        userRepository.findById(id).map { userMapper.toResponse(it) }
            .orElseThrow { NoSuchElementException("User not found") }

    fun update(id: Long, request: UserRequest): UserResponse {
        val existing = userRepository.findById(id)
            .orElseThrow { NoSuchElementException("User not found") }
        // Crear nuevo usuario con los campos actualizados y mantener dailyHabits y timestamps
        val updatedUser = User(
            firstName = request.firstName,
            lastName = request.lastName,
            email = request.email,
            dailyHabits = existing.dailyHabits
        ).also {
            it.id = existing.id
        }
        val saved = userRepository.save(updatedUser)
        return userMapper.toResponse(saved)
    }

    fun delete(id: Long) {
        if (!userRepository.existsById(id)) throw NoSuchElementException("User not found")
        userRepository.deleteById(id)
    }
}