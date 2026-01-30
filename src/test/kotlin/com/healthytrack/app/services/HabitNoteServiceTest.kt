
package com.healthytrack.app.services

import com.healthytrack.app.mappers.HabitNoteMapper
import com.healthytrack.app.models.entities.DailyHabit
import com.healthytrack.app.models.entities.HabitNote
import com.healthytrack.app.models.requests.HabitNoteRequest
import com.healthytrack.app.models.responses.HabitNoteResponse
import com.healthytrack.app.repositories.DailyHabitRepository
import com.healthytrack.app.repositories.HabitNoteRepository
import io.mockk.*
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.time.LocalDateTime
import java.util.*

class HabitNoteServiceTest {
    private lateinit var habitNoteRepository: HabitNoteRepository
    private lateinit var dailyHabitRepository: DailyHabitRepository
    private lateinit var habitNoteMapper: HabitNoteMapper
    private lateinit var habitNoteService: HabitNoteService

    @BeforeEach
    fun setUp() {
        habitNoteRepository = mockk(relaxed = true)
        dailyHabitRepository = mockk(relaxed = true)
        habitNoteMapper = mockk(relaxed = true)
        habitNoteService = HabitNoteService(habitNoteRepository, dailyHabitRepository, habitNoteMapper)
    }

    @Test
    fun `findAll returns all notes`() {
        val dailyHabit = DailyHabit(
            user = mockk(relaxed = true),
            date = java.time.LocalDate.now(),
            habitType = "agua"
        )
        dailyHabit.id = 1
        val note = HabitNote(dailyHabit, "n")
        note.id = 1
        every { habitNoteRepository.findAll() } returns listOf(note)
        val mapped = HabitNoteResponse(1, 1, "n", LocalDateTime.now(), LocalDateTime.now())
        every { habitNoteMapper.toResponse(note) } returns mapped
        val res = habitNoteService.findAll()
        assertEquals(1, res.size)
        assertEquals(mapped, res[0])
    }

    @Test
    fun `create habit note success`() {
        val dailyHabit = DailyHabit(
            user = mockk(relaxed = true),
            date = java.time.LocalDate.now(),
            habitType = "agua"
        )
        dailyHabit.id = 1
        val request = HabitNoteRequest(1, "note")
        val saved = HabitNote(dailyHabit, "note")
        saved.id = 1
        val mapped = HabitNoteResponse(1, 1, "note", LocalDateTime.now(), LocalDateTime.now())
        every { dailyHabitRepository.findById(1) } returns Optional.of(dailyHabit)
        every { habitNoteRepository.save(any()) } returns saved
        every { habitNoteMapper.toResponse(saved) } returns mapped
        val result = habitNoteService.create(request)
        assertEquals("note", result.note)
        assertEquals(1, result.dailyHabitId)
    }

    @Test
    fun `create habit note with missing daily habit throws`() {
        val request = HabitNoteRequest(2, "note")
        every { dailyHabitRepository.findById(2) } returns Optional.empty()
        assertThrows(NoSuchElementException::class.java) { habitNoteService.create(request) }
    }

    @Test
    fun `find by daily habit id returns notes`() {
        val dailyHabit = DailyHabit(
            user = mockk(relaxed = true),
            date = java.time.LocalDate.now(),
            habitType = "agua"
        )
        dailyHabit.id = 1
        val note = HabitNote(dailyHabit, "n")
        note.id = 1
        every { habitNoteRepository.findByDailyHabitId(1) } returns listOf(note)
        val mapped = HabitNoteResponse(1, 1, "n", LocalDateTime.now(), LocalDateTime.now())
        every { habitNoteMapper.toResponse(note) } returns mapped
        val result = habitNoteService.findByDailyHabitId(1)
        assertEquals(1, result.size)
        assertEquals(mapped, result[0])
    }

    @Test
    fun `findById returns note`() {
        val dailyHabit = DailyHabit(
            user = mockk(relaxed = true),
            date = java.time.LocalDate.now(),
            habitType = "agua"
        )
        dailyHabit.id = 1
        val note = HabitNote(dailyHabit, "n")
        note.id = 3
        every { habitNoteRepository.findById(3) } returns Optional.of(note)
        val mapped = HabitNoteResponse(3, 1, "n", LocalDateTime.now(), LocalDateTime.now())
        every { habitNoteMapper.toResponse(note) } returns mapped
        val result = habitNoteService.findById(3)
        assertEquals(mapped, result)
    }

    @Test
    fun `findById not found throws`() {
        every { habitNoteRepository.findById(4) } returns Optional.empty()
        assertThrows(NoSuchElementException::class.java) { habitNoteService.findById(4) }
    }

    @Test
    fun `update habit note success`() {
        val dailyHabit = DailyHabit(
            user = mockk(relaxed = true),
            date = java.time.LocalDate.now(),
            habitType = "agua"
        )
        dailyHabit.id = 1
        val existing = HabitNote(dailyHabit, "old")
        existing.id = 5
        val request = HabitNoteRequest(1, "updated")
        val updated = existing.copy(dailyHabit = dailyHabit, note = "updated")
        updated.id = 5
        every { habitNoteRepository.findById(5) } returns Optional.of(existing)
        every { dailyHabitRepository.findById(1) } returns Optional.of(dailyHabit)
        every { habitNoteRepository.save(updated) } returns updated
        val mapped = HabitNoteResponse(5, 1, "updated", LocalDateTime.now(), LocalDateTime.now())
        every { habitNoteMapper.toResponse(updated) } returns mapped
        val result = habitNoteService.update(5, request)
        assertEquals(mapped, result)
    }

    @Test
    fun `update habit note not found throws`() {
        val request = HabitNoteRequest(1, "fail")
        every { habitNoteRepository.findById(6) } returns Optional.empty()
        assertThrows(NoSuchElementException::class.java) { habitNoteService.update(6, request) }
    }

    @Test
    fun `update habit note with missing daily habit throws`() {
        val existing = mockk<HabitNote>(relaxed = true)
        val request = HabitNoteRequest(99, "fail")
        every { habitNoteRepository.findById(7) } returns Optional.of(existing)
        every { dailyHabitRepository.findById(99) } returns Optional.empty()
        assertThrows(NoSuchElementException::class.java) { habitNoteService.update(7, request) }
    }

    @Test
    fun `delete habit note success`() {
        every { habitNoteRepository.existsById(8) } returns true
        every { habitNoteRepository.deleteById(8) } just Runs
        habitNoteService.delete(8)
        verify { habitNoteRepository.deleteById(8) }
    }

    @Test
    fun `delete habit note not found throws`() {
        every { habitNoteRepository.existsById(9) } returns false
        assertThrows(NoSuchElementException::class.java) { habitNoteService.delete(9) }
    }
}
