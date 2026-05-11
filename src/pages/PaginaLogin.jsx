// PaginaLogin — Pantalla de autenticación con diseño premium y soporte de registro
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/atoms/Spinner';
import { 
  Flame, 
  Globe, 
  Bell, 
  ShieldAlert, 
  User, 
  Lock, 
  Mail, 
  ArrowRight, 
  UserPlus, 
  LogIn,
  AlertCircle
} from 'lucide-react';

const PaginaLogin = () => {
  const { login, registro, error, cargando, usuario } = useAuth();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (usuario) navigate('/monitoreo', { replace: true });
  }, [usuario, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const ok = await login(loginEmail, password);
      if (ok) navigate('/monitoreo');
    } else {
      const ok = await registro({ username: loginEmail, password, nombre, email, rol: 'usuario' });
      if (ok) navigate('/monitoreo');
    }
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
              boxShadow: 'var(--shadow-fire)',
              animation: 'flicker 3s ease-in-out infinite',
            }}>
              <Flame size={32} color="white" />
            </div>
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
              { icono: <Globe size={18} />, titulo: 'Monitoreo en tiempo real', desc: 'Focos activos con GeoJSON y Leaflet' },
              { icono: <Bell size={18} />, titulo: 'Centro de notificaciones', desc: 'Alertas y comunicados del sistema' },
              { icono: <ShieldAlert size={18} />, titulo: 'Gestión de alertas', desc: 'Coordinación y respuesta por nivel' },
            ].map(({ icono, titulo, desc }) => (
              <div key={titulo} style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'flex-start' }}>
                <span style={{
                  width: 36, height: 36, borderRadius: 'var(--r-sm)',
                  background: 'var(--color-primary-glow)',
                  border: '1px solid rgba(249,115,22,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--color-primary)', flexShrink: 0,
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

      {/* Panel derecho — Formulario de login/registro */}
      <div style={{
        width: 500,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: 'var(--sp-12) var(--sp-10)',
        background: 'var(--color-bg)',
        position: 'relative',
        zIndex: 10,
      }}>
        <div className="animate-fade-up">
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '6px' }}>
            {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.88rem', marginBottom: 'var(--sp-8)' }}>
            {isLogin 
              ? 'Ingresa tus credenciales para acceder al sistema' 
              : 'Completa los campos para registrarte en la plataforma'}
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            
            {!isLogin && (
              <>
                {/* Campo Nombre Completo */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-2)', marginBottom: 'var(--sp-2)' }}>
                    Nombre Completo
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
                    <input
                      type="text"
                      value={nombre}
                      onChange={e => setNombre(e.target.value)}
                      placeholder="Ej: Juan Pérez"
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Campo Email */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-2)', marginBottom: 'var(--sp-2)' }}>
                    Correo Electrónico
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="correo@ejemplo.com"
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Campo email/usuario */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-2)', marginBottom: 'var(--sp-2)' }}>
                {isLogin ? 'Correo Electrónico' : 'Nombre de Usuario'}
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
                <input
                  type="text"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder={isLogin ? "correo@ejemplo.com" : "Tu usuario"}
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Campo contraseña */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-2)', marginBottom: 'var(--sp-2)' }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={inputStyle}
                />
              </div>
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
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {/* Botón submit */}
            <button
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
                marginTop: 'var(--sp-2)',
              }}
            >
              {cargando ? (
                <><Spinner size={18} color="white" /> Procesando...</>
              ) : (
                <>
                  {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                  {isLogin ? 'Ingresar al sistema' : 'Crear cuenta'}
                </>
              )}
            </button>
          </form>

          {/* Toggle Login/Registro */}
          <div style={{ marginTop: 'var(--sp-8)', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.88rem' }}>
              {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
            </p>
            <button 
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: '8px auto',
                padding: '4px 12px',
                borderRadius: 'var(--r-sm)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-dim)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              {isLogin ? (
                <>Regístrate aquí <ArrowRight size={16} /></>
              ) : (
                <>Inicia sesión aquí <ArrowRight size={16} /></>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'absolute', bottom: 'var(--sp-6)', left: 0, right: 0, textAlign: 'center', fontSize: '0.72rem', color: 'var(--color-muted)' }}>
          Sistema GyP Incendios — Sur de Chile • v1.1.0
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px 12px 42px',
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border-2)',
  borderRadius: 'var(--r-md)',
  color: 'var(--color-text)',
  fontSize: '0.92rem',
  outline: 'none',
  transition: 'border-color var(--transition-fast)',
  fontFamily: 'inherit',
};

export default PaginaLogin;

