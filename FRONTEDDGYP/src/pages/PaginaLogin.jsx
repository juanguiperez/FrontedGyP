// PaginaLogin — Pantalla de autenticación con diseño premium de fuego
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/atoms/Spinner';

const PaginaLogin = () => {
  const { login, error, cargando, usuario } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (usuario) navigate('/monitoreo', { replace: true });
  }, [usuario, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(username, password);
    if (ok) navigate('/monitoreo');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--color-bg)',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Fondo animado — partículas de fuego */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(249,115,22,0.12) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', height: 4,
        background: 'var(--grad-fire)',
        boxShadow: '0 0 40px rgba(249,115,22,0.6)',
      }} />

      {/* Panel izquierdo — información del sistema */}
      <div style={{
        flex: 1,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: 'var(--sp-12)',
        background: 'linear-gradient(135deg, #0d1526 0%, #111827 100%)',
        borderRight: '1px solid var(--color-border)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Grid decorativo */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div style={{ position: 'relative', maxWidth: 420 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', marginBottom: 'var(--sp-10)' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 'var(--r-lg)',
              background: 'var(--grad-fire)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', boxShadow: 'var(--shadow-fire)',
              animation: 'flicker 3s ease-in-out infinite',
            }}>🔥</div>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white' }}>GyP Incendios</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Sistema de Gestión y Prevención
              </div>
            </div>
          </div>

          <h1 style={{
            fontSize: '2.2rem', fontWeight: 800,
            background: 'var(--grad-fire)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: 'var(--sp-4)', lineHeight: 1.2,
          }}>
            Protegiendo el<br />Sur de Chile
          </h1>

          <p style={{ color: 'var(--color-text-2)', lineHeight: 1.7, marginBottom: 'var(--sp-8)', fontSize: '0.95rem' }}>
            Plataforma integrada de monitoreo geoespacial, alertas tempranas y coordinación de emergencias para la prevención de incendios forestales.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            {[
              { icono: '🌍', titulo: 'Monitoreo en tiempo real', desc: 'Focos activos con GeoJSON y Leaflet' },
              { icono: '🔔', titulo: 'Centro de notificaciones', desc: 'Alertas y comunicados del sistema' },
              { icono: '🚨', titulo: 'Gestión de alertas', desc: 'Coordinación y respuesta por nivel' },
            ].map(({ icono, titulo, desc }) => (
              <div key={titulo} style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'flex-start' }}>
                <span style={{
                  width: 36, height: 36, borderRadius: 'var(--r-sm)',
                  background: 'var(--color-primary-glow)',
                  border: '1px solid rgba(249,115,22,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', flexShrink: 0,
                }}>{icono}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-text)' }}>{titulo}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho — Formulario de login */}
      <div style={{
        width: 460,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: 'var(--sp-12) var(--sp-10)',
        background: 'var(--color-bg)',
        position: 'relative',
      }}>
        <div className="animate-fade-up">
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '6px' }}>
            Iniciar sesión
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.88rem', marginBottom: 'var(--sp-8)' }}>
            Ingresa tus credenciales para acceder al sistema
          </p>

          {/* Cuentas demo */}
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--r-md)',
            padding: 'var(--sp-4)',
            marginBottom: 'var(--sp-6)',
            fontSize: '0.8rem',
          }}>
            <div style={{ color: 'var(--color-muted)', marginBottom: 'var(--sp-2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.7rem' }}>
              Cuentas de demostración
            </div>
            <div style={{ display: 'flex', gap: 'var(--sp-4)', flexWrap: 'wrap' }}>
              <button id="demo-admin" onClick={() => { setUsername('admin'); setPassword('admin123'); }}
                style={{ background: 'var(--color-warning-dim)', border: '1px solid rgba(245,158,11,0.3)', color: 'var(--color-warning)', padding: '4px 12px', borderRadius: 'var(--r-sm)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                ⚙️ admin / admin123
              </button>
              <button id="demo-user" onClick={() => { setUsername('usuario'); setPassword('user123'); }}
                style={{ background: 'var(--color-info-dim)', border: '1px solid rgba(56,189,248,0.3)', color: 'var(--color-info)', padding: '4px 12px', borderRadius: 'var(--r-sm)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                👤 usuario / user123
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
            {/* Campo usuario */}
            <div>
              <label htmlFor="login-username" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-2)', marginBottom: 'var(--sp-2)' }}>
                Usuario
              </label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                required
                style={{
                  width: '100%', padding: '12px 16px',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border-2)',
                  borderRadius: 'var(--r-md)',
                  color: 'var(--color-text)',
                  fontSize: '0.92rem',
                  outline: 'none',
                  transition: 'border-color var(--transition-fast)',
                  fontFamily: 'var(--font-sans)',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-border-2)'}
              />
            </div>

            {/* Campo contraseña */}
            <div>
              <label htmlFor="login-password" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-2)', marginBottom: 'var(--sp-2)' }}>
                Contraseña
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', padding: '12px 16px',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border-2)',
                  borderRadius: 'var(--r-md)',
                  color: 'var(--color-text)',
                  fontSize: '0.92rem',
                  outline: 'none',
                  transition: 'border-color var(--transition-fast)',
                  fontFamily: 'var(--font-sans)',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-border-2)'}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: 'var(--color-danger-dim)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 'var(--r-md)',
                padding: 'var(--sp-3) var(--sp-4)',
                color: 'var(--color-danger)',
                fontSize: '0.85rem',
                display: 'flex', alignItems: 'center', gap: 'var(--sp-2)',
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Botón submit */}
            <button
              id="btn-login-submit"
              type="submit"
              disabled={cargando}
              style={{
                width: '100%',
                padding: '13px',
                background: cargando ? 'var(--color-surface-2)' : 'var(--grad-fire)',
                border: 'none',
                borderRadius: 'var(--r-md)',
                color: 'white',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: cargando ? 'not-allowed' : 'pointer',
                boxShadow: cargando ? 'none' : 'var(--shadow-fire)',
                transition: 'all var(--transition-base)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--sp-3)',
                fontFamily: 'var(--font-sans)',
              }}
              onMouseEnter={e => { if (!cargando) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {cargando ? (
                <><Spinner size={18} color="white" /> Verificando...</>
              ) : (
                '🔥 Ingresar al sistema'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={{ position: 'absolute', bottom: 'var(--sp-6)', left: 0, right: 0, textAlign: 'center', fontSize: '0.72rem', color: 'var(--color-muted)' }}>
          Sistema GyP Incendios — Sur de Chile • v1.0.0
        </div>
      </div>
    </div>
  );
};

export default PaginaLogin;
