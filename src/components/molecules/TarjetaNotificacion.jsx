// TarjetaNotificacion — Tarjeta de notificación individual
import React from 'react';
import BadgeNivel from '../atoms/BadgeNivel';

const ICONO_TIPO = {
  urgente: '🚨', informativa: 'ℹ️', preventiva: '🛡️',
};

const formatRelativo = (iso) => {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return 'Hace un momento';
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
  return new Date(iso).toLocaleDateString('es-CL');
};

const TarjetaNotificacion = ({ notif, onMarcarLeida }) => {
  return (
    <div
      className="animate-fade-up"
      style={{
        background: notif.leida ? 'var(--grad-card)' : 'linear-gradient(145deg, #131e30, #1a2236)',
        border: `1px solid ${notif.leida ? 'var(--color-border)' : 'var(--color-border-2)'}`,
        borderRadius: 'var(--r-lg)',
        padding: 'var(--sp-4) var(--sp-5)',
        display: 'flex',
        gap: 'var(--sp-4)',
        alignItems: 'flex-start',
        opacity: notif.leida ? 0.75 : 1,
        transition: 'all var(--transition-base)',
        position: 'relative',
      }}
    >
      {/* Indicador no leída */}
      {!notif.leida && (
        <div style={{
          position: 'absolute', top: '50%', left: -3,
          transform: 'translateY(-50%)',
          width: 6, height: 6,
          borderRadius: '50%',
          background: 'var(--color-primary)',
          boxShadow: 'var(--shadow-fire)',
        }} />
      )}

      <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>
        {ICONO_TIPO[notif.tipo] || '📋'}
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: '4px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)' }}>
              {notif.titulo}
            </span>
            <BadgeNivel nivel={notif.tipo} />
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
            {formatRelativo(notif.fecha)}
          </span>
        </div>

        <p style={{ fontSize: '0.83rem', color: 'var(--color-text-2)', margin: '4px 0 8px', lineHeight: 1.55 }}>
          {notif.mensaje}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
            📤 {notif.emisor}
          </span>
          {!notif.leida && (
            <button
              id={`btn-leer-notif-${notif.id}`}
              onClick={() => onMarcarLeida(notif.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--color-primary)', fontSize: '0.78rem',
                fontWeight: 600, padding: '2px 6px',
                transition: 'opacity var(--transition-fast)',
              }}
              onMouseEnter={e => e.target.style.opacity = '0.7'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >
              Marcar como leída ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TarjetaNotificacion;
