
package com.healthytrack.app.services

import com.healthytrack.app.mappers.UserMapper
import com.healthytrack.app.models.entities.User
import com.healthytrack.app.models.requests.UserRequest
import com.healthytrack.app.models.responses.UserResponse
import com.healthytrack.app.repositories.UserRepository
import io.mockk.*
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.time.LocalDateTime
import java.util.*

class UserServiceTest {
    private lateinit var userRepository: UserRepository
    private lateinit var userMapper: UserMapper
    private lateinit var userService: UserService

    @BeforeEach
    fun setUp() {
        userRepository = mockk(relaxed = true)
        userMapper = mockk(relaxed = true)
        userService = UserService(userRepository, userMapper)
    }

    @Test
    fun `create user successfully`() {
        val request = UserRequest("John", "Doe", "john@example.com")
        val entity = User("John", "Doe", "john@example.com")
        entity.id = 1
        val response = UserResponse(1, "John", "Doe", "john@example.com", LocalDateTime.now(), LocalDateTime.now())
        every { userMapper.toEntity(request) } returns entity
        every { userRepository.save(entity) } returns entity
        every { userMapper.toResponse(entity) } returns response
        val result = userService.create(request)
        assertEquals(response, result)
    }

    @Test
    fun `findAll returns all users`() {
        val entity = User("Jane", "Smith", "jane@example.com")
        entity.id = 2
        val response = UserResponse(2, "Jane", "Smith", "jane@example.com", LocalDateTime.now(), LocalDateTime.now())
        every { userRepository.findAll() } returns listOf(entity)
        every { userMapper.toResponse(entity) } returns response
        val result = userService.findAll()
        assertEquals(1, result.size)
        assertEquals(response, result[0])
    }

    @Test
    fun `find user by id success`() {
        val entity = User("Jane", "Smith", "jane@example.com")
        entity.id = 2
        val response = UserResponse(2, "Jane", "Smith", "jane@example.com", LocalDateTime.now(), LocalDateTime.now())
        every { userRepository.findById(2) } returns Optional.of(entity)
        every { userMapper.toResponse(entity) } returns response
        val result = userService.findById(2)
        assertEquals(response, result)
    }

    @Test
    fun `find user by id not found`() {
        every { userRepository.findById(99) } returns Optional.empty()
        assertThrows(NoSuchElementException::class.java) { userService.findById(99) }
    }

    @Test
    fun `update user success`() {
        val entity = User("A", "B", "a@b.com")
        entity.id = 3
        val request = UserRequest("C", "D", "c@d.com")
        val updated = User("C", "D", "c@d.com")
        updated.id = 3
        val response = UserResponse(3, "C", "D", "c@d.com", LocalDateTime.now(), LocalDateTime.now())
        every { userRepository.findById(3) } returns Optional.of(entity)
        every { userRepository.save(any()) } returns updated
        every { userMapper.toResponse(updated) } returns response
        val result = userService.update(3, request)
        assertEquals(response, result)
    }

    @Test
    fun `update user not found`() {
        val request = UserRequest("X", "Y", "x@y.com")
        every { userRepository.findById(77) } returns Optional.empty()
        assertThrows(NoSuchElementException::class.java) { userService.update(77, request) }
    }

    @Test
    fun `delete user success`() {
        every { userRepository.existsById(5) } returns true
        every { userRepository.deleteById(5) } just Runs
        userService.delete(5)
        verify { userRepository.deleteById(5) }
    }

    @Test
    fun `delete user not found throws`() {
        every { userRepository.existsById(6) } returns false
        assertThrows(NoSuchElementException::class.java) { userService.delete(6) }
    }
}
