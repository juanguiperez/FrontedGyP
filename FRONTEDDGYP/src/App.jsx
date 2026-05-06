// App.jsx — Router principal con autenticación y rutas protegidas
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import NavbarPrincipal from './components/organisms/NavbarPrincipal';
import PaginaLogin from './pages/PaginaLogin';
import PaginaMonitoreo from './pages/PaginaMonitoreo';
import PaginaNotificaciones from './pages/PaginaNotificaciones';
import PaginaAlertas from './pages/PaginaAlertas';

import './index.css';

// Ruta protegida — redirige a login si no autenticado
const RutaProtegida = ({ children }) => {
  const { usuario } = useAuth();
  return usuario ? children : <Navigate to="/login" replace />;
};

// Layout con Navbar + contenido
const LayoutConNavbar = () => {
  const [notifsNoLeidas, setNotifsNoLeidas] = useState(0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavbarPrincipal notifsNoLeidas={notifsNoLeidas} />
      <main style={{ flex: 1, background: 'var(--color-bg)' }}>
        <Routes>
          <Route path="/monitoreo" element={<PaginaMonitoreo />} />
          <Route path="/notificaciones" element={<PaginaNotificaciones onNotifsChange={setNotifsNoLeidas} />} />
          <Route path="/alertas" element={<PaginaAlertas />} />
          <Route path="*" element={<Navigate to="/monitoreo" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<PaginaLogin />} />

          {/* Rutas protegidas */}
          <Route
            path="/*"
            element={
              <RutaProtegida>
                <LayoutConNavbar />
              </RutaProtegida>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;