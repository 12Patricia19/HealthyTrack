package com.healthytrack.app.repositories

import com.healthytrack.app.models.entities.UserPreferences
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface UserPreferencesRepository : JpaRepository<UserPreferences, Long> {
    fun findByUserId(userId: Long): Optional<UserPreferences>
}
