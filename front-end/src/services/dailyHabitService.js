import api from './api';

const normalizeHabit = (habit) => ({
  ...habit,
  userId: habit.userId ?? habit.user_id,
  habitType: habit.habitType ?? habit.habit_type,
  entryMethod: habit.entryMethod ?? habit.entry_method,
});

export const dailyHabitService = {
  // Obtener todos los hábitos diarios
  getAllDailyHabits: async () => {
    const response = await api.get('/daily-habits');
    return Array.isArray(response.data)
      ? response.data.map(normalizeHabit)
      : [];
  },

  // Obtener un hábito diario por ID
  getDailyHabitById: async (id) => {
    const response = await api.get(`/daily-habits/${id}`);
    return normalizeHabit(response.data);
  },

  // Crear un nuevo hábito diario
  createDailyHabit: async (habitData) => {
    const response = await api.post('/daily-habits', habitData);
    return normalizeHabit(response.data);
  },

  // Actualizar un hábito diario
  updateDailyHabit: async (id, habitData) => {
    const response = await api.put(`/daily-habits/${id}`, habitData);
    return normalizeHabit(response.data);
  },

  // Eliminar un hábito diario
  deleteDailyHabit: async (id) => {
    const response = await api.delete(`/daily-habits/${id}`);
    return response.data;
  },

  // Obtener hábitos por usuario
  getHabitsByUser: async (userId) => {
    const response = await api.get(`/daily-habits/user/${userId}`);
    return Array.isArray(response.data)
      ? response.data.map(normalizeHabit)
      : [];
  },

  // Obtener hábitos por fecha
  getHabitsByDate: async (date) => {
    const response = await api.get(`/daily-habits/date/${date}`);
    return Array.isArray(response.data)
      ? response.data.map(normalizeHabit)
      : [];
  },
};

export default dailyHabitService;
