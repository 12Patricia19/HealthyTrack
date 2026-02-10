import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './api';

export const authService = {
  async register(email, password, fullName, additionalData = {}) {
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

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al registrar');
    }

    const data = await response.json();
    await AsyncStorage.setItem('userId', data.id.toString());
    await AsyncStorage.setItem('userEmail', data.email);
    await AsyncStorage.setItem('userFullName', data.fullName);
    return data;
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
  }
};
