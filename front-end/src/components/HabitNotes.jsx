import { useState, useEffect } from 'react';
import habitNoteService from '../services/habitNoteService';
import dailyHabitService from '../services/dailyHabitService';

function HabitNotes() {
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [notesData, habitsData] = await Promise.all([
        habitNoteService.getAllHabitNotes(),
        dailyHabitService.getAllDailyHabits()
      ]);
      setNotes(notesData);
      setHabits(habitsData);
    } catch (err) {
      setError('Error al cargar datos: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);
      
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
      dailyHabitId: note.dailyHabitId,
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
    if (!window.confirm('¿Está seguro de eliminar esta nota?')) {
      return;
    }
    
    try {
      setError(null);
      setSuccess(null);
      await habitNoteService.deleteHabitNote(id);
      setSuccess('Nota eliminada correctamente');
      loadData();
    } catch (err) {
      setError('Error al eliminar nota: ' + (err.response?.data?.message || err.message));
    }
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

  const getHabitIcon = (type) => {
    const icons = {
      agua: '💧',
      ejercicio: '🏃‍♂️',
      sueño: '😴',
      meditación: '🧘‍♂️',
      lectura: '📚',
      otro: '📝'
    };
    return icons[type] || '📊';
  };

  if (loading && notes.length === 0) {
    return <div className="loading">Cargando notas...</div>;
  }

  return (
    <div>
      <div className="section">
        <h2>{editingNote ? '✏️ Editar Nota' : '➕ Nueva Nota de Hábito'}</h2>
        
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="dailyHabitId">Hábito Diario</label>
            <select
              id="dailyHabitId"
              name="dailyHabitId"
              value={formData.dailyHabitId}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione un hábito</option>
              {habits.map(habit => (
                <option key={habit.id} value={habit.id}>
                  {getHabitIcon(habit.habitType)} {habit.habitType.toUpperCase()} - 
                  {habit.value} {habit.unit} - 
                  {habit.date}
                  {habit.description && ` - ${habit.description}`}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="note">Nota</label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              required
              placeholder="Escribe tu nota aquí..."
              rows="5"
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary">
              {editingNote ? '💾 Actualizar' : '➕ Crear Nota'}
            </button>
            {editingNote && (
              <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">
                ❌ Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="section">
        <h2>📝 Notas Registradas ({notes.length})</h2>
        
        {notes.length === 0 ? (
          <div className="empty-state">
            No hay notas registradas. ¡Crea la primera!
          </div>
        ) : (
          <ul className="list">
            {notes.map((note) => {
              const habitInfo = getHabitInfo(note.dailyHabitId);
              return (
                <li key={note.id} className="list-item">
                  <div className="list-item-header">
                    <div style={{ flex: 1 }}>
                      <div className="list-item-title">
                        📝 Nota #{note.id}
                      </div>
                      {habitInfo && (
                        <div className="list-item-content" style={{ marginTop: '0.5rem' }}>
                          <span className="badge badge-primary">
                            {getHabitIcon(habitInfo.type)} {habitInfo.type.toUpperCase()}
                          </span>
                          <span className="badge badge-secondary">
                            {habitInfo.value}
                          </span>
                          <span className="badge badge-info">
                            📅 {habitInfo.date}
                          </span>
                          {habitInfo.description && (
                            <p style={{ marginTop: '0.5rem' }}>
                              <strong>Hábito:</strong> {habitInfo.description}
                            </p>
                          )}
                        </div>
                      )}
                      <div style={{ 
                        marginTop: '1rem', 
                        padding: '1rem', 
                        backgroundColor: '#f9f9f9', 
                        borderRadius: '6px',
                        borderLeft: '4px solid var(--secondary-color)'
                      }}>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{note.note}</p>
                      </div>
                      {note.createdAt && (
                        <p style={{ 
                          marginTop: '0.5rem', 
                          fontSize: '0.85rem', 
                          color: '#666' 
                        }}>
                          Creada: {new Date(note.createdAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="list-item-actions">
                      <button 
                        onClick={() => handleEdit(note)} 
                        className="btn btn-warning btn-small"
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(note.id)} 
                        className="btn btn-danger btn-small"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default HabitNotes;
