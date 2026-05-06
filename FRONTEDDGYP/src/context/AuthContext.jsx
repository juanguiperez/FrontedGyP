// ============================================================
// CONTEXTO DE AUTENTICACIÓN
// Sistema de Gestión y Prevención de Incendios — Sur de Chile
// ============================================================

import React, { createContext, useContext, useState, useCallback } from 'react';

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

  const login = useCallback(async (username, password) => {
    setCargando(true);
    setError('');

    // Simula latencia de red
    await new Promise((r) => setTimeout(r, 900));

    const found = MOCK_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (found) {
      const { password: _, ...userData } = found;
      setUsuario(userData);
      sessionStorage.setItem('gypUser', JSON.stringify(userData));
      setCargando(false);
      return true;
    } else {
      setError('Usuario o contraseña incorrectos.');
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
    <AuthContext.Provider value={{ usuario, login, logout, esAdmin, error, cargando }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
