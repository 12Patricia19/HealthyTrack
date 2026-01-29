package com.healthytrack.app.controllers

import com.healthytrack.app.models.requests.UserRequest
import com.healthytrack.app.models.responses.UserResponse
import com.healthytrack.app.services.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService
) {
    @PostMapping
    fun create(@RequestBody request: UserRequest): ResponseEntity<UserResponse> =
        ResponseEntity(userService.create(request), HttpStatus.CREATED)

    @GetMapping
    fun findAll(): ResponseEntity<List<UserResponse>> =
        ResponseEntity.ok(userService.findAll())

    @GetMapping("/{id}")
    fun findById(@PathVariable id: Long): ResponseEntity<UserResponse> =
        ResponseEntity.ok(userService.findById(id))

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody request: UserRequest): ResponseEntity<UserResponse> =
        ResponseEntity.ok(userService.update(id, request))

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        userService.delete(id)
        return ResponseEntity.noContent().build()
    }
}