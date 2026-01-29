package com.healthytrack.app.models.requests

data class UserRequest(
    val firstName: String,
    val lastName: String,
    val email: String
)