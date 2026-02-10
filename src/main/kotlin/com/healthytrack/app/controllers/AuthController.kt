package com.healthytrack.app.controllers

import com.healthytrack.app.models.requests.LoginRequest
import com.healthytrack.app.models.requests.RegisterRequest
import com.healthytrack.app.models.requests.UpdateUserRequest
import com.healthytrack.app.models.responses.AuthResponse
import com.healthytrack.app.models.responses.UserDetailResponse
import com.healthytrack.app.services.AuthService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService
) {
    @PostMapping("/register")
    fun register(@RequestBody request: RegisterRequest): ResponseEntity<AuthResponse> =
        ResponseEntity(authService.register(request), HttpStatus.CREATED)

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<AuthResponse> =
        ResponseEntity.ok(authService.login(request))

    @GetMapping("/me/{userId}")
    fun getCurrentUser(@PathVariable userId: Long): ResponseEntity<UserDetailResponse> =
        ResponseEntity.ok(authService.getUserDetail(userId))

    @PutMapping("/me/{userId}")
    fun updateCurrentUser(
        @PathVariable userId: Long,
        @RequestBody request: UpdateUserRequest
    ): ResponseEntity<UserDetailResponse> =
        ResponseEntity.ok(authService.updateUser(userId, request))
}
