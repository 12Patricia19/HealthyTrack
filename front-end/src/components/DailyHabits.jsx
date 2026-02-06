import { useState, useEffect } from 'react';
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Actualizar unidad cuando cambia el tipo de hábito
    if (name === 'habitType') {
      const nextUnit = units[value]?.[0] || '';
      setFormData(prev => ({
        ...prev,
        habitType: value,
        unit: nextUnit
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);
      
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
    if (!window.confirm('¿Está seguro de eliminar este hábito?')) {
      return;
    }
    
    try {
      setError(null);
      setSuccess(null);
      await dailyHabitService.deleteDailyHabit(id);
      setSuccess('Hábito eliminado correctamente');
      loadData();
    } catch (err) {
      setError('Error al eliminar hábito: ' + (err.response?.data?.message || err.message));
    }
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
    return <div className="loading">Cargando hábitos...</div>;
  }

  return (
    <div>
      <div className="section">
        <h2>➕ Registrar Nuevo Hábito</h2>
        
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        
        <form onSubmit={handleSubmit} className="form">
          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="userId">Usuario</label>
              <select
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione un usuario</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="date">Fecha</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="habitType">Tipo de Hábito</label>
              <select
                id="habitType"
                name="habitType"
                value={formData.habitType}
                onChange={handleInputChange}
                required
              >
                {habitTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {getHabitIcon(type.value)} {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="value">Valor</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="number"
                  id="value"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  placeholder="0.00"
                  style={{ flex: 1 }}
                />
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  style={{ width: '100px' }}
                >
                  {(units[formData.habitType] || []).map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Breve descripción del hábito"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="notes">Notas</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Notas adicionales (opcional)"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="entryMethod">Método de Registro</label>
            <select
              id="entryMethod"
              name="entryMethod"
              value={formData.entryMethod}
              onChange={handleInputChange}
            >
              <option value="manual">Manual</option>
              <option value="automatico">Automático</option>
            </select>
          </div>
          
          <button type="submit" className="btn btn-primary">
            ➕ Registrar Hábito
          </button>
        </form>
      </div>
      
      <div className="section">
        <h2>📊 Hábitos Registrados ({habits.length})</h2>
        
        {habits.length === 0 ? (
          <div className="empty-state">
            No hay hábitos registrados. ¡Registra el primero!
          </div>
        ) : (
          <ul className="list">
            {habits.map((habit) => (
              <li key={habit.id} className="list-item">
                <div className="list-item-header">
                  <div>
                    <div className="list-item-title">
                      {getHabitIcon(habit.habitType)} {habitTypeLabels[habit.habitType] || habit.habitType || 'Sin tipo'}
                    </div>
                    <div className="list-item-content">
                      <span className="badge badge-primary">
                        {habit.value} {habit.unit}
                      </span>
                      <span className="badge badge-secondary">
                        {habit.date}
                      </span>
                      <span className="badge badge-info">
                        👤 {getUserName(habit.userId)}
                      </span>
                      <br />
                      {habit.description && (
                        <p style={{ marginTop: '0.5rem' }}>
                          <strong>Descripción:</strong> {habit.description}
                        </p>
                      )}
                      {habit.notes && (
                        <p style={{ marginTop: '0.25rem' }}>
                          <strong>Notas:</strong> {habit.notes}
                        </p>
                      )}
                      <p style={{ marginTop: '0.25rem', fontSize: '0.9rem', color: '#666' }}>
                        Método: {habit.entryMethod}
                      </p>
                    </div>
                  </div>
                  <div className="list-item-actions">
                    <button 
                      onClick={() => handleDelete(habit.id)} 
                      className="btn btn-danger btn-small"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DailyHabits;
