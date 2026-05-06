// NavbarPrincipal — Barra de navegación principal con diseño premium
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NavbarPrincipal = ({ notifsNoLeidas = 0 }) => {
  const { usuario, logout, esAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: 'var(--r-md)',
    fontSize: '0.88rem',
    fontWeight: 500,
    color: isActive ? 'white' : 'var(--color-text-2)',
    background: isActive ? 'var(--color-primary-glow)' : 'transparent',
    border: isActive ? '1px solid rgba(249,115,22,0.4)' : '1px solid transparent',
    transition: 'all var(--transition-base)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  });

  return (
    <header style={{
      height: 'var(--navbar-height)',
      background: 'linear-gradient(90deg, #0d1526 0%, #111827 100%)',
      borderBottom: '1px solid var(--color-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--sp-6)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 20px rgba(0,0,0,0.5)',
    }}>

      {/* Logo / Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
        <div style={{
          width: 36, height: 36,
          borderRadius: 'var(--r-md)',
          background: 'var(--grad-fire)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.2rem',
          boxShadow: 'var(--shadow-fire)',
          animation: 'flicker 3s ease-in-out infinite',
          flexShrink: 0,
        }}>🔥</div>
        <div>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'white', lineHeight: 1.1 }}>
            GyP Incendios
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Sur de Chile
          </div>
        </div>
      </div>

      {/* Navegación central */}
      <nav style={{ display: 'flex', gap: 'var(--sp-1)', alignItems: 'center' }}>
        <NavLink
          id="nav-monitoreo"
          to="/monitoreo"
          style={({ isActive }) => linkStyle(isActive)}
          onMouseEnter={e => { if (!e.currentTarget.style.background.includes('var(--color-primary')) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
          onMouseLeave={e => { if (!e.currentTarget.getAttribute('aria-current')) e.currentTarget.style.background = 'transparent'; }}
        >
          🌍 Monitoreo
        </NavLink>
        <NavLink
          id="nav-notificaciones"
          to="/notificaciones"
          style={({ isActive }) => linkStyle(isActive)}
        >
          <span>🔔 Notificaciones</span>
          {notifsNoLeidas > 0 && (
            <span style={{
              background: 'var(--color-danger)',
              color: 'white',
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: 'var(--r-full)',
              lineHeight: 1.4,
            }}>
              {notifsNoLeidas}
            </span>
          )}
        </NavLink>
        <NavLink
          id="nav-alertas"
          to="/alertas"
          style={({ isActive }) => linkStyle(isActive)}
        >
          🚨 Alertas
        </NavLink>
      </nav>

      {/* Usuario / Perfil */}
      <div style={{ position: 'relative' }}>
        <button
          id="btn-perfil-usuario"
          onClick={() => setMenuAbierto(!menuAbierto)}
          style={{
            background: menuAbierto ? 'var(--color-surface-2)' : 'transparent',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--r-md)',
            padding: '6px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--sp-2)',
            color: 'var(--color-text)',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-border-2)'}
          onMouseLeave={e => { if (!menuAbierto) e.currentTarget.style.borderColor = 'var(--color-border)'; }}
        >
          <span style={{ fontSize: '1.2rem' }}>{usuario?.avatar}</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.1 }}>{usuario?.nombre}</div>
            <div style={{ fontSize: '0.65rem', color: esAdmin ? 'var(--color-warning)' : 'var(--color-info)', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1 }}>
              {esAdmin ? '⚙️ Admin' : '👤 Usuario'}
            </div>
          </div>
          <span style={{ color: 'var(--color-muted)', fontSize: '0.7rem' }}>▼</span>
        </button>

        {menuAbierto && (
          <div style={{
            position: 'absolute', right: 0, top: 'calc(100% + 8px)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-2)',
            borderRadius: 'var(--r-md)',
            padding: 'var(--sp-2)',
            minWidth: 200,
            boxShadow: 'var(--shadow-lg)',
            zIndex: 200,
          }}>
            <div style={{ padding: 'var(--sp-3)', borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--sp-2)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>Conectado como</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)' }}>{usuario?.nombre}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-2)' }}>{usuario?.region}</div>
            </div>
            <button
              id="btn-cerrar-sesion"
              onClick={handleLogout}
              style={{
                width: '100%', textAlign: 'left',
                background: 'transparent',
                border: 'none', cursor: 'pointer',
                padding: 'var(--sp-2) var(--sp-3)',
                borderRadius: 'var(--r-sm)',
                color: 'var(--color-danger)',
                fontSize: '0.85rem', fontWeight: 500,
                transition: 'background var(--transition-fast)',
                display: 'flex', alignItems: 'center', gap: 'var(--sp-2)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--color-danger-dim)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              🚪 Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavbarPrincipal;
