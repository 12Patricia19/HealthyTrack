package com.healthytrack.app.repositories

import com.healthytrack.app.models.entities.Goal
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface GoalRepository : JpaRepository<Goal, Long> {
    fun findByUserIdAndIsActive(userId: Long, isActive: Boolean = true): List<Goal>
    fun findByUserId(userId: Long): List<Goal>
}
