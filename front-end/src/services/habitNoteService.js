import api from './api';

export const habitNoteService = {
  // Obtener todas las notas de hábitos
  getAllHabitNotes: async () => {
    const response = await api.get('/habit-notes');
    return response.data;
  },

  // Obtener una nota por ID
  getHabitNoteById: async (id) => {
    const response = await api.get(`/habit-notes/${id}`);
    return response.data;
  },

  // Obtener notas por hábito diario
  getNotesByDailyHabit: async (dailyHabitId) => {
    const response = await api.get(`/habit-notes/daily-habit/${dailyHabitId}`);
    return response.data;
  },

  // Crear una nueva nota
  createHabitNote: async (noteData) => {
    const response = await api.post('/habit-notes', noteData);
    return response.data;
  },

  // Actualizar una nota
  updateHabitNote: async (id, noteData) => {
    const response = await api.put(`/habit-notes/${id}`, noteData);
    return response.data;
  },

  // Eliminar una nota
  deleteHabitNote: async (id) => {
    const response = await api.delete(`/habit-notes/${id}`);
    return response.data;
  },
};

export default habitNoteService;
