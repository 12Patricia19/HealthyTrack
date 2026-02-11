import { API_URL } from './api';

export const goalService = {
  async getGoals(userId) {
    const response = await fetch(`${API_URL}/users/${userId}/goals`);
    if (!response.ok) throw new Error('Error al obtener metas');
    return await response.json();
  },

  async getActiveGoals(userId) {
    const response = await fetch(`${API_URL}/users/${userId}/goals/active`);
    if (!response.ok) throw new Error('Error al obtener metas activas');
    return await response.json();
  },

  async createGoal(userId, goalData) {
    const response = await fetch(`${API_URL}/users/${userId}/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goalData)
    });
    if (!response.ok) throw new Error('Error al crear meta');
    return await response.json();
  },

  async deleteGoal(userId, goalId) {
    const response = await fetch(`${API_URL}/users/${userId}/goals/${goalId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar meta');
  },

  async completeGoal(userId, goalId) {
    const response = await fetch(`${API_URL}/users/${userId}/goals/${goalId}/complete`, {
      method: 'PATCH'
    });
    if (!response.ok) throw new Error('Error al completar meta');
    return await response.json();
  },

  async getCompletedGoals(userId) {
    const allGoals = await this.getGoals(userId);
    return allGoals.filter(goal => !goal.isActive);
  }
};
