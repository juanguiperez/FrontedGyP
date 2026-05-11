// TarjetaAlerta — Tarjeta de alerta comunitaria con acciones
import React from 'react';
import BadgeNivel from '../atoms/BadgeNivel';

const COLOR_NIVEL = {
  critica: 'var(--color-danger)',
  alta: 'var(--color-warning)',
  media: '#fbbf24',
  preventiva: 'var(--color-info)',
};

const ICONO_NIVEL = {
  critica: '🚨', alta: '⚠️', media: '⚡', preventiva: '🔵',
};

const formatFecha = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });
};

const TarjetaAlerta = ({ alerta, onCerrar, esAdmin }) => {
  const color = COLOR_NIVEL[alerta.nivel] || 'var(--color-text-2)';
  const icono = ICONO_NIVEL[alerta.nivel] || '📋';
  const esCerrada = alerta.estado === 'cerrada';

  return (
    <div
      className="animate-fade-up"
      style={{
        background: 'var(--grad-card)',
        border: `1px solid ${esCerrada ? 'var(--color-border)' : color + '40'}`,
        borderLeft: `4px solid ${esCerrada ? 'var(--color-muted)' : color}`,
        borderRadius: 'var(--r-lg)',
        padding: 'var(--sp-5)',
        opacity: esCerrada ? 0.6 : 1,
        transition: 'transform var(--transition-base)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow sutil en alertas críticas */}
      {alerta.nivel === 'critica' && !esCerrada && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at top left, rgba(239,68,68,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{icono}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', flexWrap: 'wrap', marginBottom: '4px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                {alerta.titulo}
              </h3>
              <BadgeNivel nivel={alerta.nivel} />
              <BadgeNivel nivel={alerta.estado} />
            </div>
            <p style={{ fontSize: '0.83rem', color: 'var(--color-text-2)', margin: '4px 0', lineHeight: 1.5 }}>
              {alerta.descripcion}
            </p>
          </div>
        </div>

        {esAdmin && !esCerrada && (
          <button
            id={`btn-cerrar-alerta-${alerta.id}`}
            onClick={() => onCerrar(alerta.id)}
            style={{
              background: 'var(--color-danger-dim)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: 'var(--color-danger)',
              padding: '6px 14px',
              borderRadius: 'var(--r-sm)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
              transition: 'all var(--transition-fast)',
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.target.style.background = 'var(--color-danger)'; e.target.style.color = 'white'; }}
            onMouseLeave={e => { e.target.style.background = 'var(--color-danger-dim)'; e.target.style.color = 'var(--color-danger)'; }}
          >
            Cerrar alerta
          </button>
        )}
      </div>

      <div style={{
        display: 'flex', gap: 'var(--sp-4)', marginTop: 'var(--sp-3)',
        paddingTop: 'var(--sp-3)', borderTop: '1px solid var(--color-border)',
        fontSize: '0.78rem', color: 'var(--color-muted)', flexWrap: 'wrap',
      }}>
        <span>📍 {alerta.zona}</span>
        <span>🕐 {formatFecha(alerta.fechaEmision)}</span>
        {alerta.poblacionAfectada > 0 && <span>👥 {alerta.poblacionAfectada.toLocaleString('es-CL')} personas</span>}
        <span>👤 {alerta.responsable}</span>
      </div>
    </div>
  );
};

export default TarjetaAlerta;
