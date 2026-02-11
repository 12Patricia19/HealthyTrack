import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { goalService } from '../services/goalService';
import { notificationService } from '../services/notificationService';

export default function GoalsScreen() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    goalType: '',
    goalName: '',
    targetValue: '',
    unit: '',
    frequency: 'diario',
    enableReminder: false,
    reminderHour: '9',
    reminderMinute: '0'
  });

  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadGoals();
      }
    }, [user])
  );

  const loadGoals = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await goalService.getGoals(user.id);
      setGoals(data);
    } catch (error) {
      Alert.alert('Error', 'Error al cargar metas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'reminderHour') {
      const num = value.replace(/[^0-9]/g, '');
      if (num === '' || (parseInt(num) >= 0 && parseInt(num) <= 23)) {
        setFormData(prev => ({ ...prev, [field]: num }));
      }
    } else if (field === 'reminderMinute') {
      const num = value.replace(/[^0-9]/g, '');
      if (num === '' || (parseInt(num) >= 0 && parseInt(num) <= 59)) {
        setFormData(prev => ({ ...prev, [field]: num }));
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const formatTimeValue = (value) => {
    if (!value) return '00';
    const num = parseInt(value);
    return num < 10 ? `0${num}` : `${num}`;
  };

  const handleSubmit = async () => {
    if (!formData.goalName || !formData.targetValue) {
      Alert.alert('Error', 'Por favor ingrese nombre y objetivo de la meta');
      return;
    }

    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      await goalService.createGoal(user.id, {
        goalType: formData.goalType || formData.goalName,
        goalName: formData.goalName,
        targetValue: parseFloat(formData.targetValue),
        unit: formData.unit || 'unidades',
        frequency: formData.frequency,
        startDate: today
      });

      if (formData.enableReminder) {
        try {
          const hasPermission = await notificationService.requestPermissions();
          if (hasPermission) {
            await notificationService.scheduleDailyReminder(
              formData.goalName,
              parseInt(formData.reminderHour),
              parseInt(formData.reminderMinute),
              `Recordatorio: ${formData.goalName} - ${formData.targetValue} ${formData.unit}`
            );
            Alert.alert('Éxito', 'Meta creada y recordatorio programado');
          } else {
            Alert.alert('Éxito', 'Meta creada. Activa las notificaciones en Perfil para recibir recordatorios.');
          }
        } catch (notifError) {
          console.error('Error al programar notificación:', notifError);
          Alert.alert('Éxito', 'Meta creada pero no se pudo programar el recordatorio');
        }
      } else {
        Alert.alert('Éxito', 'Meta creada correctamente');
      }

      setFormData({
        goalType: '',
        goalName: '',
        targetValue: '',
        unit: '',
        frequency: 'diario',
        enableReminder: false,
        reminderHour: '9',
        reminderMinute: '0'
      });
      setShowForm(false);
      await loadGoals();
    } catch (error) {
      Alert.alert('Error', 'Error al crear meta: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (goalId) => {
    Alert.alert(
      'Eliminar Meta',
      '¿Estás seguro que deseas eliminar esta meta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              // Cancelar notificaciones de esta meta
              await notificationService.cancelGoalNotifications(goalId);
              await goalService.deleteGoal(user.id, goalId);
              await loadGoals();
              Alert.alert('Éxito', 'Meta eliminada');
            } catch (error) {
              Alert.alert('Error', 'Error al eliminar meta: ' + error.message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleComplete = async (goalId, goalName) => {
    Alert.alert(
      'Completar Meta',
      `¡Felicidades! ¿Completaste la meta "${goalName}"?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, Completada',
          onPress: async () => {
            try {
              setLoading(true);
              await goalService.completeGoal(user.id, goalId);
              // Cancelar notificaciones de esta meta
              await notificationService.cancelGoalNotifications(goalId);
              await loadGoals();
              Alert.alert('¡Éxito!', 'Meta completada. ¡Sigue así!');
            } catch (error) {
              Alert.alert('Error', 'Error al completar meta: ' + error.message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const getProgressPercentage = (goal) => {
    if (!goal.currentValue || !goal.targetValue) return 0;
    return Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
      <View style={styles.header}>
        <Text style={styles.title}>Mis Metas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(!showForm)}
        >
          <Text style={styles.addButtonText}>{showForm ? 'Cancelar' : '+'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nombre de la Meta *</Text>
            <TextInput
              style={styles.input}
              value={formData.goalName}
              onChangeText={(value) => handleInputChange('goalName', value)}
              placeholder="Ej: Caminar 10000 pasos, Dormir 8 horas"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Tipo de Meta</Text>
            <TextInput
              style={styles.input}
              value={formData.goalType}
              onChangeText={(value) => handleInputChange('goalType', value)}
              placeholder="Ej: ejercicio, sueño, agua"
            />
          </View>

          <View style={styles.formRow}>
            <View style={styles.formGroupFlex}>
              <Text style={styles.label}>Objetivo *</Text>
              <TextInput
                style={styles.input}
                value={formData.targetValue}
                onChangeText={(value) => handleInputChange('targetValue', value)}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroupSmall}>
              <Text style={styles.label}>Unidad</Text>
              <TextInput
                style={styles.input}
                value={formData.unit}
                onChangeText={(value) => handleInputChange('unit', value)}
                placeholder="pasos, hrs"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Frecuencia</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.frequency}
                onValueChange={(value) => handleInputChange('frequency', value)}
                style={styles.picker}
              >
                <Picker.Item label="Diario" value="diario" />
                <Picker.Item label="Semanal" value="semanal" />
                <Picker.Item label="Mensual" value="mensual" />
              </Picker>
            </View>
          </View>

          <View style={styles.reminderSection}>
            <View style={styles.reminderToggle}>
              <Text style={styles.label}>Recordatorio Diario</Text>
              <Switch
                value={formData.enableReminder}
                onValueChange={(value) => handleInputChange('enableReminder', value)}
                trackColor={{ false: '#767577', true: '#81c784' }}
                thumbColor={formData.enableReminder ? '#4CAF50' : '#f4f3f4'}
              />
            </View>

            {formData.enableReminder && (
              <View>
                <Text style={styles.helpText}>
                  Te recordaremos trabajar en esta meta cada día a la hora configurada
                </Text>
                <View style={styles.timeRow}>
                  <View style={styles.timeGroup}>
                    <Text style={styles.label}>Hora</Text>
                    <TextInput
                      style={styles.timeInput}
                      value={formData.reminderHour}
                      onChangeText={(value) => handleInputChange('reminderHour', value)}
                      onBlur={() => setFormData(prev => ({ ...prev, reminderHour: formatTimeValue(prev.reminderHour) }))}
                      placeholder="09"
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                  </View>
                  <Text style={styles.timeSeparator}>:</Text>
                  <View style={styles.timeGroup}>
                    <Text style={styles.label}>Minuto</Text>
                    <TextInput
                      style={styles.timeInput}
                      value={formData.reminderMinute}
                      onChangeText={(value) => handleInputChange('reminderMinute', value)}
                      onBlur={() => setFormData(prev => ({ ...prev, reminderMinute: formatTimeValue(prev.reminderMinute) }))}
                      placeholder="00"
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Crear Meta</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.goalsContainer}>
        {loading && goals.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
          </View>
        ) : goals.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay metas creadas</Text>
            <Text style={styles.emptySubtext}>
              Presiona el botón + para crear tu primera meta
            </Text>
          </View>
        ) : (
          goals.map((goal) => (
            <View key={goal.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalName}>{goal.goalName}</Text>
                <View style={styles.goalActions}>
                  {goal.isActive && (
                    <TouchableOpacity
                      onPress={() => handleComplete(goal.id, goal.goalName)}
                      style={styles.completeButton}
                    >
                      <Text style={styles.completeButtonText}>✓</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => handleDelete(goal.id)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.goalType}>{goal.goalType}</Text>

              <View style={styles.goalProgress}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${getProgressPercentage(goal)}%` }
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {goal.currentValue || 0} / {goal.targetValue} {goal.unit}
                </Text>
              </View>

              <View style={styles.goalFooter}>
                <Text style={styles.goalFrequency}>{goal.frequency}</Text>
                <View style={styles.goalStats}>
                  {!goal.isActive && (
                    <Text style={styles.completedBadge}>✓ Completada</Text>
                  )}
                  <Text style={styles.goalPercentage}>
                    {getProgressPercentage(goal)}%
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  formGroup: {
    marginBottom: 15,
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  formGroupFlex: {
    flex: 2,
  },
  formGroupSmall: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  reminderSection: {
    marginTop: 10,
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  reminderToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  helpText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 15,
    lineHeight: 18,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  timeGroup: {
    alignItems: 'center',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 70,
    backgroundColor: '#fff',
  },
  timeSeparator: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  go: {
    flex: 1,
    padding: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  goalName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  goalActions: {
    flexDirection: 'row',
    gap: 5,
  },
  completeButton: {
    padding: 5,
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 28,
    color: '#f44336',
    fontWeight: 'bold',
  },
  goalType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  goalProgress: {
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    fontSize: 14,
    color: '#333',
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  goalFrequency: {
    fontSize: 12,
    color: '#999',
    textTransform: 'capitalize',
  },
  goalStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  completedBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  goalPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});
