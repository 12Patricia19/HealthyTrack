import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './api';

console.log('AuthService - API_URL:', API_URL);

export const authService = {
  async register(email, password, fullName, additionalData = {}) {
    try {
      console.log('Intentando registrar en:', `${API_URL}/auth/register`);
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          fullName,
          ...additionalData
        })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al registrar');
      }

      const data = await response.json();
      await AsyncStorage.setItem('userId', data.id.toString());
      await AsyncStorage.setItem('userEmail', data.email);
      await AsyncStorage.setItem('userFullName', data.fullName);
      return data;
    } catch (error) {
      console.error('Error en register:', error.message);
      throw error;
    }
  },

  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Credenciales inválidas');
    }

    const data = await response.json();
    await AsyncStorage.setItem('userId', data.id.toString());
    await AsyncStorage.setItem('userEmail', data.email);
    await AsyncStorage.setItem('userFullName', data.fullName);
    return data;
  },

  async logout() {
    await AsyncStorage.multiRemove(['userId', 'userEmail', 'userFullName']);
  },

  async getCurrentUser() {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) return null;

    const response = await fetch(`${API_URL}/auth/me/${userId}`);
    if (!response.ok) return null;

    return await response.json();
  },

  async isAuthenticated() {
    const userId = await AsyncStorage.getItem('userId');
    return !!userId;
  },

  async getUserId() {
    return await AsyncStorage.getItem('userId');
  },

  async updateUser(userId, userData) {
    const response = await fetch(`${API_URL}/auth/me/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar perfil');
    }

    const data = await response.json();
    await AsyncStorage.setItem('userFullName', data.fullName || '');
    return data;
  }
};
