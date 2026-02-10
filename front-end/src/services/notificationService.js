import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { API_URL } from './api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const notificationService = {
  async requestPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  async scheduleLocalNotification(title, body, trigger) {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger,
    });
  },

  async scheduleHabitReminder(habitName, message, trigger) {
    return await this.scheduleLocalNotification(
      `Recordatorio: ${habitName}`,
      message || `Es hora de registrar tu hábito de ${habitName}`,
      trigger
    );
  },

  async scheduleIntervalReminder(habitName, intervalMinutes, message) {
    return await this.scheduleHabitReminder(
      habitName,
      message,
      {
        seconds: intervalMinutes * 60,
        repeats: true,
      }
    );
  },

  async scheduleDailyReminder(habitName, hour, minute, message) {
    return await this.scheduleHabitReminder(
      habitName,
      message,
      {
        hour,
        minute,
        repeats: true,
      }
    );
  },

  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  async cancelNotification(notificationId) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  },

  async getAllScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  },

  async createNotification(userId, notificationData) {
    const response = await fetch(`${API_URL}/users/${userId}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificationData)
    });
    if (!response.ok) throw new Error('Error al crear notificación');
    return await response.json();
  },

  async getNotifications(userId) {
    const response = await fetch(`${API_URL}/users/${userId}/notifications`);
    if (!response.ok) throw new Error('Error al obtener notificaciones');
    return await response.json();
  },

  async markAsRead(userId, notificationId) {
    const response = await fetch(
      `${API_URL}/users/${userId}/notifications/${notificationId}/read`,
      { method: 'PATCH' }
    );
    if (!response.ok) throw new Error('Error al marcar notificación');
    return await response.json();
  }
};
