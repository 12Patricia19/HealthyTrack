import api from './api';

export const statsService = {
  async getUserStats(userId) {
    const response = await api.get(`/users/${userId}/stats`);
    return response.data;
  }
};

export default statsService;
