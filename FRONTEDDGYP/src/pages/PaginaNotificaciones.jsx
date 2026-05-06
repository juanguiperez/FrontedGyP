// PaginaNotificaciones — Centro de notificaciones del sistema
import React, { useState, useEffect } from 'react';
import TarjetaNotificacion from '../components/molecules/TarjetaNotificacion';
import Spinner from '../components/atoms/Spinner';
import { obtenerNotificaciones, marcarLeida, marcarTodasLeidas } from '../services/notificacionesService';

const FILTROS = ['todas', 'urgente', 'preventiva', 'informativa'];

const PaginaNotificaciones = ({ onNotifsChange }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState('todas');
  const [marcandoTodas, setMarcandoTodas] = useState(false);

  const cargarNotifs = async () => {
    setCargando(true);
    const data = await obtenerNotificaciones();
    setNotificaciones(data);
    setCargando(false);
    onNotifsChange?.(data.filter(n => !n.leida).length);
  };

  useEffect(() => { cargarNotifs(); }, []);

  const handleMarcarLeida = async (id) => {
    await marcarLeida(id);
    const updated = notificaciones.map(n => n.id === id ? { ...n, leida: true } : n);
    setNotificaciones(updated);
    onNotifsChange?.(updated.filter(n => !n.leida).length);
  };

  const handleMarcarTodas = async () => {
    setMarcandoTodas(true);
    await marcarTodasLeidas();
    const updated = notificaciones.map(n => ({ ...n, leida: true }));
    setNotificaciones(updated);
    onNotifsChange?.(0);
    setMarcandoTodas(false);
  };

  const filtradas = filtro === 'todas' ? notificaciones : notificaciones.filter(n => n.tipo === filtro);
  const noLeidas = notificaciones.filter(n => !n.leida).length;

  const COLORES_FILTRO = {
    todas: { color: 'var(--color-text)', active: 'var(--color-primary)' },
    urgente: { color: 'var(--color-danger)', active: 'var(--color-danger)' },
    preventiva: { color: 'var(--color-info)', active: 'var(--color-info)' },
    informativa: { color: 'var(--color-success)', active: 'var(--color-success)' },
  };

  return (
    <div style={{ padding: 'var(--sp-6)', maxWidth: 900, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-6)', flexWrap: 'wrap', gap: 'var(--sp-4)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 4 }}>
            🔔 Notificaciones
            {noLeidas > 0 && (
              <span style={{
                background: 'var(--color-danger)',
                color: 'white', fontSize: '0.75rem', fontWeight: 700,
                padding: '2px 10px', borderRadius: 'var(--r-full)',
              }}>{noLeidas} nuevas</span>
            )}
          </h1>
          <p style={{ color: 'var(--color-text-2)', fontSize: '0.85rem' }}>
            Centro de comunicados del sistema de gestión de incendios
          </p>
        </div>
        {noLeidas > 0 && (
          <button
            id="btn-marcar-todas-leidas"
            onClick={handleMarcarTodas}
            disabled={marcandoTodas}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-2)',
              color: 'var(--color-text)',
              padding: '8px 16px', borderRadius: 'var(--r-md)',
              cursor: 'pointer', fontSize: '0.83rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 'var(--sp-2)',
              transition: 'all var(--transition-fast)', fontFamily: 'var(--font-sans)',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border-2)'}
          >
            {marcandoTodas ? <Spinner size={14} /> : '✓'} Marcar todo como leído
          </button>
        )}
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-5)', flexWrap: 'wrap' }}>
        {FILTROS.map(f => {
          const cfg = COLORES_FILTRO[f];
          const isActive = filtro === f;
          const count = f === 'todas' ? notificaciones.length : notificaciones.filter(n => n.tipo === f).length;
          return (
            <button
              key={f}
              id={`filtro-notif-${f}`}
              onClick={() => setFiltro(f)}
              style={{
                background: isActive ? `${cfg.active}22` : 'var(--color-surface)',
                border: `1px solid ${isActive ? cfg.active + '60' : 'var(--color-border)'}`,
                color: isActive ? cfg.active : 'var(--color-text-2)',
                padding: '6px 14px', borderRadius: 'var(--r-full)',
                cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                transition: 'all var(--transition-fast)',
                textTransform: 'capitalize', fontFamily: 'var(--font-sans)',
                display: 'flex', alignItems: 'center', gap: 'var(--sp-2)',
              }}
            >
              {f === 'urgente' ? '🚨' : f === 'preventiva' ? '🛡️' : f === 'informativa' ? 'ℹ️' : '📋'}
              {f} <span style={{ background: isActive ? cfg.active + '30' : 'var(--color-surface-2)', padding: '0 6px', borderRadius: 'var(--r-full)', fontSize: '0.7rem' }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Lista */}
      {cargando ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--sp-12)' }}>
          <Spinner size={40} />
        </div>
      ) : filtradas.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 'var(--sp-12)',
          background: 'var(--color-surface)', borderRadius: 'var(--r-lg)',
          border: '1px solid var(--color-border)',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 'var(--sp-3)' }}>🔔</div>
          <div style={{ color: 'var(--color-text-2)', fontWeight: 600 }}>No hay notificaciones</div>
          <div style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>No se encontraron notificaciones del tipo seleccionado</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          {filtradas.map((notif, i) => (
            <div key={notif.id} style={{ animationDelay: `${i * 60}ms` }}>
              <TarjetaNotificacion notif={notif} onMarcarLeida={handleMarcarLeida} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaginaNotificaciones;
