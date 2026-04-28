import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { PaginaMonitoreo } from './pages/PaginaMonitoreo';
import { PaginaReportes } from './pages/PaginaReportes';
import { PaginaAlertas } from './pages/PaginaAlertas';
import './styles/variables.css';

function App() {
  return (
    <Router>
      <nav style={{ padding: '20px', background: 'var(--azul-muni)', color: 'white', display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>🌍 Monitoreo</Link>
        <Link to="/reportes" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>📝 Reportar Foco</Link>
        <Link to="/alertas" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>🔔 Gestión de Alertas</Link>
      </nav>
      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<PaginaMonitoreo />} />
          <Route path="/reportes" element={<PaginaReportes />} />
          <Route path="/alertas" element={<PaginaAlertas />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;