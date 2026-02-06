import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import dailyHabitService from '../services/dailyHabitService';
import userService from '../services/userService';

function DailyHabits() {
  const [habits, setHabits] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    date: new Date().toISOString().split('T')[0],
    habitType: 'agua',
    value: '',
    unit: 'ml',
    description: '',
    notes: '',
    entryMethod: 'manual'
  });

  const habitTypes = [
    { value: 'agua', label: 'Agua' },
    { value: 'actividad_fisica', label: 'Actividad fisica' },
    { value: 'comida', label: 'Comida' },
    { value: 'sueño', label: 'Sueño' },
    { value: 'mindfulness', label: 'Mindfulness' }
  ];
  
  const habitTypeLabels = habitTypes.reduce((acc, type) => {
    acc[type.value] = type.label;
    return acc;
  }, {});
  
  const units = {
    agua: ['ml', 'l'],
    actividad_fisica: ['minutos', 'horas'],
    comida: ['kcal', 'porciones'],
    sueño: ['horas', 'minutos'],
    mindfulness: ['minutos']
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [habitsData, usersData] = await Promise.all([
        dailyHabitService.getAllDailyHabits(),
        userService.getAllUsers()
      ]);
      setHabits(habitsData);
      setUsers(usersData);
    } catch (err) {
      setError('Error al cargar datos: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'habitType') {
      const nextUnit = units[value]?.[0] || '';
      setFormData(prev => ({
        ...prev,
        habitType: value,
        unit: nextUnit
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      setSuccess(null);
      
      if (!formData.userId || !formData.value) {
        setError('Por favor complete todos los campos requeridos');
        return;
      }
      
      const habitData = {
        ...formData,
        userId: parseInt(formData.userId),
        value: parseFloat(formData.value)
      };
      
      await dailyHabitService.createDailyHabit(habitData);
      setSuccess('Hábito registrado correctamente');
      
      setFormData({
        userId: '',
        date: new Date().toISOString().split('T')[0],
        habitType: 'agua',
        value: '',
        unit: 'ml',
        description: '',
        notes: '',
        entryMethod: 'manual'
      });
      
      loadData();
    } catch (err) {
      setError('Error al registrar hábito: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Está seguro de eliminar este hábito?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setError(null);
              setSuccess(null);
              await dailyHabitService.deleteDailyHabit(id);
              setSuccess('Hábito eliminado correctamente');
              loadData();
            } catch (err) {
              setError('Error al eliminar hábito: ' + (err.response?.data?.message || err.message));
            }
          }
        }
      ]
    );
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Usuario desconocido';
  };

  const getHabitIcon = (type) => {
    const icons = {
      agua: '💧',
      actividad_fisica: '🏃‍♂️',
      comida: '🍽️',
      sueño: '😴',
      mindfulness: '🧘‍♂️'
    };
    return icons[type] || '📊';
  };

  if (loading && habits.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Cargando hábitos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>➕ Registrar Nuevo Hábito</Text>
        
        {error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}
        {success && <View style={styles.successBox}><Text style={styles.successText}>{success}</Text></View>}
        
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Usuario</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.userId}
                onValueChange={(value) => handleInputChange('userId', value)}
                style={styles.picker}
              >
                <Picker.Item label="Seleccione un usuario" value="" />
                {users.map(user => (
                  <Picker.Item 
                    key={user.id} 
                    label={`${user.firstName} ${user.lastName}`} 
                    value={user.id.toString()} 
                  />
                ))}
              </Picker>
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Fecha</Text>
            <TextInput
              style={styles.input}
              value={formData.date}
              onChangeText={(value) => handleInputChange('date', value)}
              placeholder="YYYY-MM-DD"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Tipo de Hábito</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.habitType}
                onValueChange={(value) => handleInputChange('habitType', value)}
                style={styles.picker}
              >
                {habitTypes.map(type => (
                  <Picker.Item 
                    key={type.value} 
                    label={`${getHabitIcon(type.value)} ${type.label}`} 
                    value={type.value} 
                  />
                ))}
              </Picker>
            </View>
          </View>
          
          <View style={styles.formRow}>
            <View style={styles.formGroupFlex}>
              <Text style={styles.label}>Valor</Text>
              <TextInput
                style={styles.input}
                value={formData.value}
                onChangeText={(value) => handleInputChange('value', value)}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.formGroupSmall}>
              <Text style={styles.label}>Unidad</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.unit}
                  onValueChange={(value) => handleInputChange('unit', value)}
                  style={styles.picker}
                >
                  {(units[formData.habitType] || []).map(unit => (
                    <Picker.Item key={unit} label={unit} value={unit} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={styles.input}
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Breve descripción del hábito"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Notas</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.notes}
              onChangeText={(value) => handleInputChange('notes', value)}
              placeholder="Notas adicionales (opcional)"
              multiline
              numberOfLines={3}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Método de Registro</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.entryMethod}
                onValueChange={(value) => handleInputChange('entryMethod', value)}
                style={styles.picker}
              >
                <Picker.Item label="Manual" value="manual" />
                <Picker.Item label="Automático" value="automatico" />
              </Picker>
            </View>
          </View>
          
          <TouchableOpacity style={styles.btnPrimary} onPress={handleSubmit}>
            <Text style={styles.btnText}>➕ Registrar Hábito</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Hábitos Registrados ({habits.length})</Text>
        
        {habits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No hay hábitos registrados. ¡Registra el primero!</Text>
          </View>
        ) : (
          habits.map((habit) => (
            <View key={habit.id} style={styles.listItem}>
              <View style={styles.listItemContent}>
                <Text style={styles.habitTitle}>
                  {getHabitIcon(habit.habitType)} {habitTypeLabels[habit.habitType] || habit.habitType || 'Sin tipo'}
                </Text>
                <View style={styles.badgeRow}>
                  <Text style={styles.badgePrimary}>{habit.value} {habit.unit}</Text>
                  <Text style={styles.badgeSecondary}>{habit.date}</Text>
                  <Text style={styles.badgeInfo}>👤 {getUserName(habit.userId)}</Text>
                </View>
                {habit.description && (
                  <Text style={styles.detailText}>
                    <Text style={styles.bold}>Descripción:</Text> {habit.description}
                  </Text>
                )}
                {habit.notes && (
                  <Text style={styles.detailText}>
                    <Text style={styles.bold}>Notas:</Text> {habit.notes}
                  </Text>
                )}
                <Text style={styles.methodText}>Método: {habit.entryMethod}</Text>
              </View>
              <TouchableOpacity 
                style={styles.btnDanger} 
                onPress={() => handleDelete(habit.id)}
              >
                <Text style={styles.btnSmallText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  errorBox: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  errorText: {
    color: '#c62828',
  },
  successBox: {
    backgroundColor: '#e8f5e9',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  successText: {
    color: '#2e7d32',
  },
  form: {
    marginTop: 10,
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
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  btnPrimary: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listItemContent: {
    flex: 1,
    paddingRight: 10,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 5,
  },
  badgePrimary: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 12,
  },
  badgeSecondary: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 12,
  },
  badgeInfo: {
    backgroundColor: '#2196F3',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 12,
  },
  detailText: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
  methodText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  btnDanger: {
    backgroundColor: '#f44336',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
  },
  btnSmallText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default DailyHabits;
