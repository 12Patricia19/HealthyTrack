import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const isAuth = await authService.isAuthenticated();
      if (isAuth) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const userData = await authService.login(email, password);
    setUser(userData);
    return userData;
  };

  const register = async (email, password, fullName, additionalData) => {
    console.log('AuthContext - Iniciando register');
    const result = await authService.register(email, password, fullName, additionalData);
    console.log('AuthContext - Registro exitoso:', result);
    // No establecer usuario aquí - el usuario debe hacer login después
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateUserProfile = async (userId, userData) => {
    console.log('AuthContext - updateUserProfile - userId:', userId);
    console.log('AuthContext - updateUserProfile - userData:', userData);
    console.log('AuthContext - user actual en contexto:', user);
    const updatedUser = await authService.updateUser(userId, userData);
    console.log('AuthContext - updatedUser recibido:', updatedUser);
    setUser(updatedUser);
    return updatedUser;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
