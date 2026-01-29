package com.healthytrack.app.services

import com.healthytrack.app.exceptions.DailyHabitNotFoundException
import com.healthytrack.app.exceptions.InvalidHabitTypeException
import com.healthytrack.app.mappers.DailyHabitMapper
import com.healthytrack.app.models.entities.DailyHabit
import com.healthytrack.app.models.entities.User
import com.healthytrack.app.models.requests.DailyHabitRequest
import com.healthytrack.app.repositories.DailyHabitRepository
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.math.BigDecimal
import java.time.LocalDate
import java.util.*

class DailyHabitServiceTest {
    private lateinit var dailyHabitRepository: DailyHabitRepository
    private lateinit var dailyHabitMapper: DailyHabitMapper
    private lateinit var userRepository: com.healthytrack.app.repositories.UserRepository
    private lateinit var dailyHabitService: DailyHabitService

    @BeforeEach
    fun setUp() {
        dailyHabitRepository = mockk(relaxed = true)
        dailyHabitMapper = mockk(relaxed = true)
        userRepository = mockk(relaxed = true)
        dailyHabitService = DailyHabitService(dailyHabitRepository, dailyHabitMapper, userRepository)
    }

    @Test
    fun `save valid habit`() {
        val request = DailyHabitRequest(1, LocalDate.now(), "comida", BigDecimal.ONE, "kcal", "desc", "notes", "manual")
        val user = mockk<User>(relaxed = true)
        val entity = mockk<DailyHabit>(relaxed = true)
        val response = mockk<com.healthytrack.app.models.responses.DailyHabitResponse>(relaxed = true)
        every { userRepository.findById(1) } returns Optional.of(user)
        every { dailyHabitMapper.toEntity(request, user) } returns entity
        every { dailyHabitRepository.save(entity) } returns entity
        every { dailyHabitMapper.toResponse(entity) } returns response
        val result = dailyHabitService.save(request)
        assertEquals(response, result)
    }

    @Test
    fun `save invalid habit type throws`() {
        val request = DailyHabitRequest(1, LocalDate.now(), "invalido", null, null, null, null, null)
        assertThrows(InvalidHabitTypeException::class.java) { dailyHabitService.save(request) }
    }

    @Test
    fun `find all habits`() {
        val entity = mockk<DailyHabit>(relaxed = true)
        val response = mockk<com.healthytrack.app.models.responses.DailyHabitResponse>(relaxed = true)
        every { dailyHabitRepository.findAll() } returns listOf(entity)
        every { dailyHabitMapper.toResponse(entity) } returns response
        val result = dailyHabitService.findAll()
        assertEquals(1, result.size)
    }

    @Test
    fun `find by id success`() {
        val entity = mockk<DailyHabit>(relaxed = true)
        val response = mockk<com.healthytrack.app.models.responses.DailyHabitResponse>(relaxed = true)
        every { dailyHabitRepository.findById(1) } returns Optional.of(entity)
        every { dailyHabitMapper.toResponse(entity) } returns response
        val result = dailyHabitService.findById(1)
        assertEquals(response, result)
    }

    @Test
    fun `find by id not found`() {
        every { dailyHabitRepository.findById(2) } returns Optional.empty()
        assertThrows(DailyHabitNotFoundException::class.java) { dailyHabitService.findById(2) }
    }

    @Test
    fun `find by user id`() {
        val entity = mockk<DailyHabit>(relaxed = true)
        val response = mockk<com.healthytrack.app.models.responses.DailyHabitResponse>(relaxed = true)
        every { dailyHabitRepository.findByUserId(1) } returns listOf(entity)
        every { dailyHabitMapper.toResponse(entity) } returns response
        val result = dailyHabitService.findByUserId(1)
        assertEquals(1, result.size)
    }

    @Test
    fun `find by user id and date`() {
        val entity = mockk<DailyHabit>(relaxed = true)
        val response = mockk<com.healthytrack.app.models.responses.DailyHabitResponse>(relaxed = true)
        every { dailyHabitRepository.findByUserIdAndDate(1, LocalDate.of(2024,1,1)) } returns listOf(entity)
        every { dailyHabitMapper.toResponse(entity) } returns response
        val result = dailyHabitService.findByUserIdAndDate(1, LocalDate.of(2024,1,1))
        assertEquals(1, result.size)
    }

    @Test
    fun `update habit success`() {
        val request = DailyHabitRequest(1, LocalDate.now(), "agua", BigDecimal.ONE, "ml", "desc", "notes", "manual")
        val existing = mockk<DailyHabit>(relaxed = true)
        val user = mockk<User>(relaxed = true)
        val entity = mockk<DailyHabit>(relaxed = true)
        val response = mockk<com.healthytrack.app.models.responses.DailyHabitResponse>(relaxed = true)
        every { dailyHabitRepository.findById(1) } returns Optional.of(existing)
        every { userRepository.findById(1) } returns Optional.of(user)
        every { dailyHabitMapper.toEntity(request, user) } returns entity
        every { entity.id } returns 1
        every { dailyHabitRepository.save(entity) } returns entity
        every { dailyHabitMapper.toResponse(entity) } returns response
        val result = dailyHabitService.update(1, request)
        assertEquals(response, result)
    }

    @Test
    fun `update habit not found`() {
        val request = DailyHabitRequest(1, LocalDate.now(), "agua", null, null, null, null, null)
        every { dailyHabitRepository.findById(2) } returns Optional.empty()
        assertThrows(DailyHabitNotFoundException::class.java) { dailyHabitService.update(2, request) }
    }

    @Test
    fun `update invalid habit type throws`() {
        val request = DailyHabitRequest(1, LocalDate.now(), "invalido", null, null, null, null, null)
        val existing = mockk<DailyHabit>(relaxed = true)
        every { dailyHabitRepository.findById(1) } returns Optional.of(existing)
        assertThrows(InvalidHabitTypeException::class.java) { dailyHabitService.update(1, request) }
    }

    @Test
    fun `delete habit success`() {
        every { dailyHabitRepository.existsById(1) } returns true
        every { dailyHabitRepository.deleteById(1) } returns Unit
        dailyHabitService.delete(1)
        verify { dailyHabitRepository.deleteById(1) }
    }

    @Test
    fun `delete habit not found`() {
        every { dailyHabitRepository.existsById(2) } returns false
        assertThrows(DailyHabitNotFoundException::class.java) { dailyHabitService.delete(2) }
    }
}
