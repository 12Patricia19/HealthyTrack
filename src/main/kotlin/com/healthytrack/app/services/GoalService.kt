package com.healthytrack.app.services

import com.healthytrack.app.mappers.GoalMapper
import com.healthytrack.app.models.requests.GoalRequest
import com.healthytrack.app.models.responses.GoalResponse
import com.healthytrack.app.repositories.GoalRepository
import com.healthytrack.app.repositories.UserRepository
import org.springframework.stereotype.Service

@Service
class GoalService(
    private val goalRepository: GoalRepository,
    private val userRepository: UserRepository,
    private val goalMapper: GoalMapper
) {
    fun create(userId: Long, request: GoalRequest): GoalResponse {
        val user = userRepository.findById(userId)
            .orElseThrow { NoSuchElementException("User not found") }
        
        val entity = goalMapper.toEntity(request, user)
        val saved = goalRepository.save(entity)
        return goalMapper.toResponse(saved)
    }

    fun findAllByUserId(userId: Long): List<GoalResponse> =
        goalRepository.findByUserId(userId).map { goalMapper.toResponse(it) }

    fun findActiveByUserId(userId: Long): List<GoalResponse> =
        goalRepository.findByUserIdAndIsActive(userId, true).map { goalMapper.toResponse(it) }

    fun findById(id: Long): GoalResponse =
        goalRepository.findById(id).map { goalMapper.toResponse(it) }
            .orElseThrow { NoSuchElementException("Goal not found") }

    fun delete(id: Long) {
        if (!goalRepository.existsById(id)) throw NoSuchElementException("Goal not found")
        goalRepository.deleteById(id)
    }
}
