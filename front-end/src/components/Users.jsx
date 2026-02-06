import { useState, useEffect } from 'react';
import userService from '../services/userService';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Error al cargar usuarios: ' + (err.response?.data?.message || err.message));
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
      
      if (editingUser) {
        await userService.updateUser(editingUser.id, formData);
        setSuccess('Usuario actualizado correctamente');
      } else {
        await userService.createUser(formData);
        setSuccess('Usuario creado correctamente');
      }
      
      setFormData({ firstName: '', lastName: '', email: '' });
      setEditingUser(null);
      loadUsers();
    } catch (err) {
      setError('Error al guardar usuario: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
    setError(null);
    setSuccess(null);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setFormData({ firstName: '', lastName: '', email: '' });
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este usuario?')) {
      return;
    }
    
    try {
      setError(null);
      setSuccess(null);
      await userService.deleteUser(id);
      setSuccess('Usuario eliminado correctamente');
      loadUsers();
    } catch (err) {
      setError('Error al eliminar usuario: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading && users.length === 0) {
    return <div className="loading">Cargando usuarios...</div>;
  }

  return (
    <div>
      <div className="section">
        <h2>{editingUser ? '✏️ Editar Usuario' : '➕ Nuevo Usuario'}</h2>
        
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        
        <form onSubmit={handleSubmit} className="form">
          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="firstName">Nombre</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                placeholder="Ingrese el nombre"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Apellido</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                placeholder="Ingrese el apellido"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="usuario@ejemplo.com"
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary">
              {editingUser ? '💾 Actualizar' : '➕ Crear Usuario'}
            </button>
            {editingUser && (
              <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">
                ❌ Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="section">
        <h2>👥 Lista de Usuarios ({users.length})</h2>
        
        {users.length === 0 ? (
          <div className="empty-state">
            No hay usuarios registrados. ¡Crea el primero!
          </div>
        ) : (
          <ul className="list">
            {users.map((user) => (
              <li key={user.id} className="list-item">
                <div className="list-item-header">
                  <div>
                    <div className="list-item-title">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="list-item-content">
                      <span className="badge badge-secondary">ID: {user.id}</span>
                      <span>📧 {user.email}</span>
                    </div>
                  </div>
                  <div className="list-item-actions">
                    <button 
                      onClick={() => handleEdit(user)} 
                      className="btn btn-warning btn-small"
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)} 
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

export default Users;
