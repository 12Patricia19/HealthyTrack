import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import habitNoteService from '../services/habitNoteService';
import dailyHabitService from '../services/dailyHabitService';
import { useAuth } from '../context/AuthContext';

function HabitNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({
    dailyHabitId: '',
    note: ''
  });

  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadData();
      }
    }, [user])
  );

  const loadData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const [notesData, habitsData] = await Promise.all([
        habitNoteService.getNotesByUser(user.id),
        dailyHabitService.getHabitsByUser(user.id)
      ]);
      setNotes(notesData);
      setHabits(habitsData);
    } catch (err) {
      setError('Error al cargar datos: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      setSuccess(null);
      
      if (!formData.dailyHabitId || !formData.note) {
        setError('Por favor complete todos los campos');
        return;
      }
      
      const noteData = {
        ...formData,
        dailyHabitId: parseInt(formData.dailyHabitId)
      };
      
      if (editingNote) {
        await habitNoteService.updateHabitNote(editingNote.id, noteData);
        setSuccess('Nota actualizada correctamente');
      } else {
        await habitNoteService.createHabitNote(noteData);
        setSuccess('Nota creada correctamente');
      }
      
      setFormData({ dailyHabitId: '', note: '' });
      setEditingNote(null);
      loadData();
    } catch (err) {
      setError('Error al guardar nota: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      dailyHabitId: note.dailyHabitId.toString(),
      note: note.note
    });
    setError(null);
    setSuccess(null);
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setFormData({ dailyHabitId: '', note: '' });
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Está seguro de eliminar esta nota?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setError(null);
              setSuccess(null);
              await habitNoteService.deleteHabitNote(id);
              setSuccess('Nota eliminada correctamente');
              loadData();
            } catch (err) {
              setError('Error al eliminar nota: ' + (err.response?.data?.message || err.message));
            }
          }
        }
      ]
    );
  };

  const getHabitInfo = (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    return habit ? {
      type: habit.habitType,
      value: `${habit.value} ${habit.unit}`,
      date: habit.date,
      description: habit.description
    } : null;
  };

  if (loading && notes.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Cargando notas...</Text>
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
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {editingNote ? 'Editar Nota' : 'Nueva Nota de Hábito'}
        </Text>
        
        {error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}
        {success && <View style={styles.successBox}><Text style={styles.successText}>{success}</Text></View>}
        
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Hábito Diario</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.dailyHabitId}
                onValueChange={(value) => handleInputChange('dailyHabitId', value)}
                style={styles.picker}
              >
                <Picker.Item label="Seleccione un hábito" value="" />
                {habits.map(habit => (
                  <Picker.Item 
                    key={habit.id} 
                    label={`${habit.habitType} - ${habit.value} ${habit.unit} - ${habit.date}`} 
                    value={habit.id.toString()} 
                  />
                ))}
              </Picker>
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nota</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.note}
              onChangeText={(value) => handleInputChange('note', value)}
              placeholder="Escribe tu nota aquí..."
              multiline
              numberOfLines={5}
            />
          </View>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.btnPrimary} onPress={handleSubmit}>
              <Text style={styles.btnText}>
                {editingNote ? 'Actualizar' : 'Crear Nota'}
              </Text>
            </TouchableOpacity>
            {editingNote && (
              <TouchableOpacity style={styles.btnSecondary} onPress={handleCancelEdit}>
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notas Registradas ({notes.length})</Text>
        
        {notes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No hay notas registradas. ¡Crea la primera!</Text>
          </View>
        ) : (
          notes.map((note) => {
            const habitInfo = getHabitInfo(note.dailyHabitId);
            return (
              <View key={note.id} style={styles.listItem}>
                <View style={styles.listItemContent}>
                  <Text style={styles.noteTitle}>Nota #{note.id}</Text>
                  
                  {habitInfo && (
                    <View style={styles.habitInfo}>
                      <View style={styles.badgeRow}>
                        <Text style={styles.badgePrimary}>
                          {habitInfo.type.toUpperCase()}
                        </Text>
                        <Text style={styles.badgeSecondary}>{habitInfo.value}</Text>
                        <Text style={styles.badgeInfo}>{habitInfo.date}</Text>
                      </View>
                      {habitInfo.description && (
                        <Text style={styles.habitDesc}>
                          <Text style={styles.bold}>Hábito:</Text> {habitInfo.description}
                        </Text>
                      )}
                    </View>
                  )}
                  
                  <View style={styles.noteBox}>
                    <Text style={styles.noteText}>{note.note}</Text>
                  </View>
                  
                  {note.createdAt && (
                    <Text style={styles.dateText}>
                      Creada: {new Date(note.createdAt).toLocaleString()}
                    </Text>
                  )}
                </View>
                
                <View style={styles.listItemActions}>
                  <TouchableOpacity 
                    style={styles.btnWarning} 
                    onPress={() => handleEdit(note)}
                  >
                    <Text style={styles.btnSmallText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.btnDanger} 
                    onPress={() => handleDelete(note.id)}
                  >
                    <Text style={styles.btnSmallText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
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
    height: 100,
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
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: '#757575',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listItemContent: {
    flex: 1,
    paddingRight: 10,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  habitInfo: {
    marginBottom: 10,
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
    fontSize: 11,
  },
  badgeSecondary: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 11,
  },
  badgeInfo: {
    backgroundColor: '#2196F3',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 11,
  },
  habitDesc: {
    fontSize: 13,
    color: '#555',
    marginTop: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  noteBox: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#757575',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  listItemActions: {
    flexDirection: 'column',
    gap: 5,
  },
  btnWarning: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
    alignItems: 'center',
  },
  btnDanger: {
    backgroundColor: '#f44336',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
    alignItems: 'center',
  },
  btnSmallText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default HabitNotes;
