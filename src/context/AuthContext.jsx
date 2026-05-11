// ============================================================
// CONTEXTO DE AUTENTICACIÓN
// Sistema de Gestión y Prevención de Incendios — Sur de Chile
// ============================================================

import React, { createContext, useContext, useState, useCallback } from 'react';
import { loginService, registroService } from '../services/authService';



const AuthContext = createContext(null);

// Usuarios simulados — reemplazar con llamada real a tu microservicio de auth
const MOCK_USERS = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    nombre: 'Carlos Fuentes',
    rol: 'administrador',
    avatar: '👨‍💼',
    region: 'Región de Los Lagos',
  },
  {
    id: 2,
    username: 'usuario',
    password: 'user123',
    nombre: 'María Pino',
    rol: 'usuario',
    avatar: '👩‍🚒',
    region: 'Región de La Araucanía',
  },
];

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    const saved = sessionStorage.getItem('gypUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const login = useCallback(async (email, password) => {
    setCargando(true);
    setError('');

    try {
      // Llamada al servicio real
      const userData = await loginService(email, password);

      // Si llegamos aquí, el login fue exitoso
      setUsuario(userData);
      sessionStorage.setItem('gypUser', JSON.stringify(userData));
      setCargando(false);
      return true;
    } catch (err) {
      // Manejo de errores de la API
      setError(err.message || 'Error de conexión con el servidor.');
      setCargando(false);
      return false;
    }
  }, []);


  const registro = useCallback(async (datos) => {
    setCargando(true);
    setError('');
    try {
      const userData = await registroService(datos);
      setUsuario(userData);
      sessionStorage.setItem('gypUser', JSON.stringify(userData));
      setCargando(false);
      return true;
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta.');
      setCargando(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUsuario(null);
    sessionStorage.removeItem('gypUser');
  }, []);

  const esAdmin = usuario?.rol === 'administrador';

  return (
    <AuthContext.Provider value={{ usuario, login, registro, logout, esAdmin, error, cargando }}>

      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
