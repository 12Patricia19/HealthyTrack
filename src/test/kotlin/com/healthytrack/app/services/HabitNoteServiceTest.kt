package com.healthytrack.app.services

import com.healthytrack.app.mappers.HabitNoteMapper
import com.healthytrack.app.models.entities.DailyHabit
import com.healthytrack.app.models.entities.HabitNote
import com.healthytrack.app.models.requests.HabitNoteRequest
import com.healthytrack.app.repositories.DailyHabitRepository
import com.healthytrack.app.repositories.HabitNoteRepository
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
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
        habitNoteMapper = HabitNoteMapper()
        habitNoteService = HabitNoteService(habitNoteRepository, dailyHabitRepository, habitNoteMapper)
    }

    @Test
    fun `create habit note success`() {
        val dailyHabit = mockk<DailyHabit>(relaxed = true)
        val request = HabitNoteRequest(1, "note")
        every { dailyHabitRepository.findById(1) } returns Optional.of(dailyHabit)
        every { habitNoteRepository.save(any()) } answers { firstArg() }
        val response = habitNoteService.create(request)
        assertEquals("note", response.note)
    }

    @Test
    fun `create habit note with missing daily habit`() {
        val request = HabitNoteRequest(2, "note")
        every { dailyHabitRepository.findById(2) } returns Optional.empty()
        assertThrows(NoSuchElementException::class.java) { habitNoteService.create(request) }
    }

    @Test
    fun `find by daily habit id`() {
        val note = mockk<HabitNote>(relaxed = true)
        every { habitNoteRepository.findByDailyHabitId(1) } returns listOf(note)
        val result = habitNoteService.findByDailyHabitId(1)
        assertEquals(1, result.size)
    }

    @Test
    fun `find by id success`() {
        val note = mockk<HabitNote>(relaxed = true)
        every { habitNoteRepository.findById(3) } returns Optional.of(note)
        val result = habitNoteService.findById(3)
        assertNotNull(result)
    }

    @Test
    fun `find by id not found`() {
        every { habitNoteRepository.findById(4) } returns Optional.empty()
        assertThrows(NoSuchElementException::class.java) { habitNoteService.findById(4) }
    }

    @Test
    fun `update habit note success`() {
        val dailyHabit = mockk<DailyHabit>(relaxed = true)
        val note = HabitNote(dailyHabit, "old note")
        note.id = 5
        val request = HabitNoteRequest(1, "updated")
        every { habitNoteRepository.findById(5) } returns Optional.of(note)
        every { dailyHabitRepository.findById(1) } returns Optional.of(dailyHabit)
        every { habitNoteRepository.save(any()) } answers {
            val updated = firstArg<HabitNote>()
            updated.id = 5
            updated
        }
        val result = habitNoteService.update(5, request)
        assertEquals("updated", result.note)
        assertEquals(5, result.id)
    }

    @Test
    fun `update habit note not found`() {
        val request = HabitNoteRequest(1, "fail")
        every { habitNoteRepository.findById(6) } returns Optional.empty()
        assertThrows(NoSuchElementException::class.java) { habitNoteService.update(6, request) }
    }

    @Test
    fun `delete habit note success`() {
        every { habitNoteRepository.existsById(7) } returns true
        every { habitNoteRepository.deleteById(7) } returns Unit
        habitNoteService.delete(7)
        verify { habitNoteRepository.deleteById(7) }
    }

    @Test
    fun `delete habit note not found`() {
        every { habitNoteRepository.existsById(8) } returns false
        assertThrows(NoSuchElementException::class.java) { habitNoteService.delete(8) }
    }
}
