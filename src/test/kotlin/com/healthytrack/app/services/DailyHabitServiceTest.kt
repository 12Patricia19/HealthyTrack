
package com.healthytrack.app.services

import com.healthytrack.app.exceptions.DailyHabitNotFoundException
import com.healthytrack.app.exceptions.InvalidHabitTypeException
import com.healthytrack.app.mappers.DailyHabitMapper
import com.healthytrack.app.models.entities.DailyHabit
import com.healthytrack.app.models.entities.User
import com.healthytrack.app.models.requests.DailyHabitRequest
import com.healthytrack.app.models.responses.DailyHabitResponse
import com.healthytrack.app.repositories.DailyHabitRepository
import com.healthytrack.app.repositories.UserRepository
import io.mockk.*
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.math.BigDecimal
import java.time.LocalDate
import java.util.*

class DailyHabitServiceTest {
    private lateinit var dailyHabitRepository: DailyHabitRepository
    private lateinit var dailyHabitMapper: DailyHabitMapper
    private lateinit var userRepository: UserRepository
    private lateinit var dailyHabitService: DailyHabitService

        @BeforeEach
        fun setUp() {
            dailyHabitRepository = mockk(relaxed = true)
            dailyHabitMapper = spyk(DailyHabitMapper())
            userRepository = mockk(relaxed = true)
            dailyHabitService = DailyHabitService(dailyHabitRepository, dailyHabitMapper, userRepository)
        }

        @Test
        fun `save valid habit`() {
            val user = User("Test", "User", "test@user.com").apply { id = 1 }
            val request = DailyHabitRequest(1, LocalDate.now(), "comida", BigDecimal.ONE, "kcal", "desc", "notes", "manual")
            every { userRepository.findById(1) } returns Optional.of(user)
            every { dailyHabitRepository.save(any()) } answers { firstArg() }
            val result = dailyHabitService.save(request)
            assertEquals("comida", result.habitType)
            assertEquals(BigDecimal.ONE, result.value)
            assertEquals("kcal", result.unit)
            assertEquals("desc", result.description)
            assertEquals("notes", result.notes)
            assertEquals("manual", result.entryMethod)
        }

        @Test
        fun `save invalid habit type throws`() {
            val request = DailyHabitRequest(1, LocalDate.now(), "invalido", null, null, null, null, null)
            assertThrows(InvalidHabitTypeException::class.java) { dailyHabitService.save(request) }
        }

        @Test
        fun `save habit with missing user throws`() {
            val request = DailyHabitRequest(99, LocalDate.now(), "comida", null, null, null, null, null)
            every { userRepository.findById(99) } returns Optional.empty()
            assertThrows(NoSuchElementException::class.java) { dailyHabitService.save(request) }
        }

        @Test
        fun `find all habits`() {
            val entity = mockk<DailyHabit>(relaxed = true)
            val response = mockk<DailyHabitResponse>(relaxed = true)
            every { dailyHabitRepository.findAll() } returns listOf(entity)
            every { dailyHabitMapper.toResponse(entity) } returns response
            val result = dailyHabitService.findAll()
            assertEquals(1, result.size)
            assertEquals(response, result[0])
        }

        @Test
        fun `find by id success`() {
            val entity = mockk<DailyHabit>(relaxed = true)
            val response = mockk<DailyHabitResponse>(relaxed = true)
            every { dailyHabitRepository.findById(1) } returns Optional.of(entity)
            every { dailyHabitMapper.toResponse(entity) } returns response
            val result = dailyHabitService.findById(1)
            assertEquals(response, result)
        }

        @Test
        fun `find by id not found throws`() {
            every { dailyHabitRepository.findById(2) } returns Optional.empty()
            assertThrows(DailyHabitNotFoundException::class.java) { dailyHabitService.findById(2) }
        }

        @Test
        fun `find by user id`() {
            val entity = mockk<DailyHabit>(relaxed = true)
            val response = mockk<DailyHabitResponse>(relaxed = true)
            every { dailyHabitRepository.findByUserId(1) } returns listOf(entity)
            every { dailyHabitMapper.toResponse(entity) } returns response
            val result = dailyHabitService.findByUserId(1)
            assertEquals(1, result.size)
            assertEquals(response, result[0])
        }

        @Test
        fun `find by user id and date`() {
            val entity = mockk<DailyHabit>(relaxed = true)
            val response = mockk<DailyHabitResponse>(relaxed = true)
            val date = LocalDate.of(2024, 1, 1)
            every { dailyHabitRepository.findByUserIdAndDate(1, date) } returns listOf(entity)
            every { dailyHabitMapper.toResponse(entity) } returns response
            val result = dailyHabitService.findByUserIdAndDate(1, date)
            assertEquals(1, result.size)
            assertEquals(response, result[0])
        }

        @Test
        fun `update habit success`() {
            val user = User("Test", "User", "test@user.com").apply { id = 1 }
            val existing = mockk<DailyHabit>(relaxed = true)
            val request = DailyHabitRequest(1, LocalDate.now(), "agua", BigDecimal.ONE, "ml", "desc", "notes", "manual")
            every { dailyHabitRepository.findById(1) } returns Optional.of(existing)
            every { userRepository.findById(1) } returns Optional.of(user)
            every { dailyHabitRepository.save(any()) } answers { firstArg() }
            val result = dailyHabitService.update(1, request)
            assertEquals("agua", result.habitType)
            assertEquals(BigDecimal.ONE, result.value)
            assertEquals("ml", result.unit)
            assertEquals("desc", result.description)
            assertEquals("notes", result.notes)
            assertEquals("manual", result.entryMethod)
        }

        @Test
        fun `update habit not found throws`() {
            val request = DailyHabitRequest(1, LocalDate.now(), "agua", null, null, null, null, null)
            every { dailyHabitRepository.findById(2) } returns Optional.empty()
            assertThrows(DailyHabitNotFoundException::class.java) { dailyHabitService.update(2, request) }
        }

        @Test
        fun `update invalid habit type throws`() {
            val existing = mockk<DailyHabit>(relaxed = true)
            val request = DailyHabitRequest(1, LocalDate.now(), "invalido", null, null, null, null, null)
            every { dailyHabitRepository.findById(1) } returns Optional.of(existing)
            assertThrows(InvalidHabitTypeException::class.java) { dailyHabitService.update(1, request) }
        }

        @Test
        fun `update habit with missing user throws`() {
            val existing = mockk<DailyHabit>(relaxed = true)
            val request = DailyHabitRequest(99, LocalDate.now(), "agua", null, null, null, null, null)
            every { dailyHabitRepository.findById(1) } returns Optional.of(existing)
            every { userRepository.findById(99) } returns Optional.empty()
            assertThrows(NoSuchElementException::class.java) { dailyHabitService.update(1, request) }
        }

        @Test
        fun `delete habit success`() {
            every { dailyHabitRepository.existsById(1) } returns true
            every { dailyHabitRepository.deleteById(1) } just Runs
            dailyHabitService.delete(1)
            verify { dailyHabitRepository.deleteById(1) }
        }

        @Test
        fun `delete habit not found throws`() {
            every { dailyHabitRepository.existsById(2) } returns false
            assertThrows(DailyHabitNotFoundException::class.java) { dailyHabitService.delete(2) }
        }
    }
