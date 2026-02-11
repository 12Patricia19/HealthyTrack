import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const NOTIFICATIONS_KEY = 'scheduled_notifications';

export const notificationService = {
  async requestPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  // Guardar ID de notificación con su contexto
  async saveNotificationId(id, context) {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      const notifications = stored ? JSON.parse(stored) : [];
      notifications.push({ id, ...context, createdAt: new Date().toISOString() });
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
      console.log('Notificación guardada:', { id, ...context });
    } catch (error) {
      console.error('Error al guardar notificación:', error);
    }
  },

  // Obtener todas las notificaciones guardadas
  async getSavedNotifications() {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      return [];
    }
  },

  // Eliminar notificación específica del storage
  async removeNotificationId(id) {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      const notifications = stored ? JSON.parse(stored) : [];
      const filtered = notifications.filter(n => n.id !== id);
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filtered));
      console.log('Notificación eliminada del storage:', id);
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
    }
  },

  // Eliminar notificaciones por contexto (ej: goalId, habitName)
  async removeNotificationsByContext(contextKey, contextValue) {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      const notifications = stored ? JSON.parse(stored) : [];
      const toCancel = notifications.filter(n => n[contextKey] === contextValue);
      
      // Cancelar cada notificación
      for (const notif of toCancel) {
        await Notifications.cancelScheduledNotificationAsync(notif.id);
        console.log('Notificación cancelada:', notif.id);
      }
      
      // Eliminar del storage
      const filtered = notifications.filter(n => n[contextKey] !== contextValue);
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filtered));
      console.log(`${toCancel.length} notificaciones canceladas para ${contextKey}:${contextValue}`);
    } catch (error) {
      console.error('Error al eliminar notificaciones por contexto:', error);
    }
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
    const notificationId = await this.scheduleLocalNotification(
      `Recordatorio: ${habitName}`,
      message || `Es hora de registrar tu hábito de ${habitName}`,
      trigger
    );
    
    // Guardar con contexto
    await this.saveNotificationId(notificationId, {
      type: 'habit',
      habitName,
      message,
      trigger
    });
    
    return notificationId;
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

  async scheduleGoalReminder(goalId, goalName, hour, minute, message) {
    const notificationId = await this.scheduleLocalNotification(
      `Recordatorio: ${goalName}`,
      message || `Trabaja en tu meta: ${goalName}`,
      {
        hour,
        minute,
        repeats: true,
      }
    );
    
    // Guardar con contexto
    await this.saveNotificationId(notificationId, {
      type: 'goal',
      goalId,
      goalName,
      hour,
      minute,
      message
    });
    
    return notificationId;
  },

  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.removeItem(NOTIFICATIONS_KEY);
    console.log('Todas las notificaciones canceladas y borradas del storage');
  },

  async cancelNotification(notificationId) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    await this.removeNotificationId(notificationId);
  },

  async cancelHabitNotifications(habitName) {
    await this.removeNotificationsByContext('habitName', habitName);
  },

  async cancelGoalNotifications(goalId) {
    await this.removeNotificationsByContext('goalId', goalId);
  },

  async getAllScheduledNotifications() {
    return await Notifications.getAllScheduledNotificationsAsync();
  },

  // Restaurar notificaciones al hacer login
  async restoreNotifications() {
    try {
      const saved = await this.getSavedNotifications();
      console.log(`Restaurando ${saved.length} notificaciones...`);
      
      // Primero cancelar todas las existentes
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      const newNotifications = [];
      
      // Re-crear cada notificación
      for (const notif of saved) {
        try {
          let newId;
          if (notif.type === 'habit') {
            newId = await this.scheduleLocalNotification(
              `Recordatorio: ${notif.habitName}`,
              notif.message,
              notif.trigger
            );
          } else if (notif.type === 'goal') {
            newId = await this.scheduleLocalNotification(
              `Recordatorio: ${notif.goalName}`,
              notif.message,
              {
                hour: notif.hour,
                minute: notif.minute,
                repeats: true
              }
            );
          }
          
          if (newId) {
            newNotifications.push({ ...notif, id: newId });
          }
        } catch (error) {
          console.error('Error al restaurar notificación:', error);
        }
      }
      
      // Actualizar storage con nuevos IDs
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(newNotifications));
      console.log(`${newNotifications.length} notificaciones restauradas`);
    } catch (error) {
      console.error('Error al restaurar notificaciones:', error);
    }
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
