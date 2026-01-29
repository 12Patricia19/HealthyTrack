package com.healthytrack.app.mappers

import com.healthytrack.app.models.entities.User
import com.healthytrack.app.models.requests.UserRequest
import com.healthytrack.app.models.responses.UserResponse
import org.springframework.stereotype.Component

@Component
class UserMapper {
    fun toEntity(request: UserRequest): User =
        User(
            firstName = request.firstName,
            lastName = request.lastName,
            email = request.email
        )

    fun toResponse(user: User): UserResponse =
        UserResponse(
            id = user.id,
            firstName = user.firstName,
            lastName = user.lastName,
            email = user.email,
            createdAt = user.createdAt,
            updatedAt = user.updatedAt
        )
}