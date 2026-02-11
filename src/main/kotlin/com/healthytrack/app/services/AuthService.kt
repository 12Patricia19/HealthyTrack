package com.healthytrack.app.services

import com.healthytrack.app.models.entities.User
import com.healthytrack.app.models.requests.LoginRequest
import com.healthytrack.app.models.requests.RegisterRequest
import com.healthytrack.app.models.requests.UpdateUserRequest
import com.healthytrack.app.models.responses.AuthResponse
import com.healthytrack.app.models.responses.UserDetailResponse
import com.healthytrack.app.repositories.RoleRepository
import com.healthytrack.app.repositories.UserRepository
import com.healthytrack.app.repositories.UserPreferencesRepository
import com.healthytrack.app.models.entities.UserPreferences
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val roleRepository: RoleRepository,
    private val preferencesRepository: UserPreferencesRepository,
    private val passwordEncoder: PasswordEncoder
) {
    fun register(request: RegisterRequest): AuthResponse {
        if (userRepository.existsByEmail(request.email)) {
            throw IllegalArgumentException("El email ya está registrado")
        }

        val userRole = roleRepository.findByName("usuario")
            .orElseGet {
                roleRepository.save(
                    com.healthytrack.app.models.entities.Role(
                        name = "usuario",
                        description = "Usuario regular"
                    )
                )
            }

        val user = User(
            email = request.email,
            passwordHash = passwordEncoder.encode(request.password),
            role = userRole,
            fullName = request.fullName,
            dateOfBirth = request.dateOfBirth,
            gender = request.gender,
            weightKg = request.weightKg,
            heightCm = request.heightCm
        )

        val savedUser = userRepository.save(user)

        val preferences = UserPreferences(user = savedUser)
        preferencesRepository.save(preferences)

        return AuthResponse(
            id = savedUser.id,
            email = savedUser.email,
            fullName = savedUser.fullName,
            role = savedUser.role.name
        )
    }

    fun login(request: LoginRequest): AuthResponse {
        val user = userRepository.findByEmail(request.email)
            .orElseThrow { IllegalArgumentException("Invalid credentials") }

        if (!passwordEncoder.matches(request.password, user.passwordHash)) {
            throw IllegalArgumentException("Invalid credentials")
        }

        val updatedUser = User(
            email = user.email,
            passwordHash = user.passwordHash,
            googleId = user.googleId,
            role = user.role,
            fullName = user.fullName,
            dateOfBirth = user.dateOfBirth,
            gender = user.gender,
            weightKg = user.weightKg,
            heightCm = user.heightCm,
            emailVerified = user.emailVerified,
            isActive = user.isActive,
            lastLogin = LocalDateTime.now(),
            coach = user.coach
        ).also {
            it.id = user.id
        }

        userRepository.save(updatedUser)

        return AuthResponse(
            id = user.id,
            email = user.email,
            fullName = user.fullName,
            role = user.role.name
        )
    }

    fun getUserDetail(userId: Long): UserDetailResponse {
        val user = userRepository.findById(userId)
            .orElseThrow { NoSuchElementException("User not found") }

        return UserDetailResponse(
            id = user.id,
            email = user.email,
            fullName = user.fullName,
            dateOfBirth = user.dateOfBirth,
            gender = user.gender,
            weightKg = user.weightKg,
            heightCm = user.heightCm,
            role = user.role.name,
            emailVerified = user.emailVerified,
            isActive = user.isActive,
            lastLogin = user.lastLogin,
            createdAt = user.createdAt,
            updatedAt = user.updatedAt
        )
    }

    fun updateUser(userId: Long, request: UpdateUserRequest): UserDetailResponse {
        val existing = userRepository.findById(userId)
            .orElseThrow { NoSuchElementException("User not found") }

        val updated = User(
            email = existing.email,
            passwordHash = existing.passwordHash,
            googleId = existing.googleId,
            role = existing.role,
            fullName = request.fullName ?: existing.fullName,
            dateOfBirth = request.dateOfBirth ?: existing.dateOfBirth,
            gender = request.gender ?: existing.gender,
            weightKg = request.weightKg ?: existing.weightKg,
            heightCm = request.heightCm ?: existing.heightCm,
            emailVerified = existing.emailVerified,
            isActive = existing.isActive,
            lastLogin = existing.lastLogin,
            coach = existing.coach
        ).also {
            it.id = existing.id
        }

        val saved = userRepository.save(updated)
        return getUserDetail(saved.id)
    }
}
