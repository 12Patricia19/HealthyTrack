package com.healthytrack.app.services

import com.healthytrack.app.mappers.UserMapper
import com.healthytrack.app.models.entities.User
import com.healthytrack.app.models.requests.UserRequest
import com.healthytrack.app.repositories.UserRepository
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.util.*

class UserServiceTest {
    private lateinit var userRepository: UserRepository
    private lateinit var userMapper: UserMapper
    private lateinit var userService: UserService

    @BeforeEach
    fun setUp() {
        userRepository = mockk(relaxed = true)
        userMapper = UserMapper()
        userService = UserService(userRepository, userMapper)
    }

    @Test
    fun `create user successfully`() {
        val request = UserRequest("John", "Doe", "john@example.com")
        val entity = userMapper.toEntity(request)
        entity.id = 1
        every { userRepository.save(any()) } returns entity
        val response = userService.create(request)
        assertEquals("John", response.firstName)
        assertEquals("Doe", response.lastName)
        assertEquals("john@example.com", response.email)
    }

    @Test
    fun `find user by id success`() {
        val entity = User("Jane", "Smith", "jane@example.com")
        entity.id = 2
        every { userRepository.findById(2) } returns Optional.of(entity)
        val response = userService.findById(2)
        assertEquals(2, response.id)
        assertEquals("Jane", response.firstName)
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
        every { userRepository.findById(3) } returns Optional.of(entity)
        every { userRepository.save(any()) } returns updated
        val response = userService.update(3, request)
        assertEquals("C", response.firstName)
        assertEquals("D", response.lastName)
        assertEquals("c@d.com", response.email)
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
        every { userRepository.deleteById(5) } returns Unit
        userService.delete(5)
        verify { userRepository.deleteById(5) }
    }

    @Test
    fun `delete user not found`() {
        every { userRepository.existsById(6) } returns false
        assertThrows(NoSuchElementException::class.java) { userService.delete(6) }
    }
}
