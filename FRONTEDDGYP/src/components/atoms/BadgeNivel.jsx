// BadgeNivel — Indica el nivel de riesgo/criticidad con color y animación
import React from 'react';

const CONFIG = {
  critica:    { label: 'Crítica',    bg: 'var(--color-danger-dim)', color: 'var(--color-danger)', pulse: true },
  alta:       { label: 'Alta',       bg: 'rgba(245,158,11,0.15)',   color: 'var(--color-warning)', pulse: false },
  media:      { label: 'Media',      bg: 'rgba(251,191,36,0.12)',   color: '#fbbf24', pulse: false },
  bajo:       { label: 'Bajo',       bg: 'var(--color-success-dim)',color: 'var(--color-success)', pulse: false },
  preventiva: { label: 'Preventiva', bg: 'var(--color-info-dim)',   color: 'var(--color-info)',    pulse: false },
  activo:     { label: 'Activo',     bg: 'var(--color-danger-dim)', color: 'var(--color-danger)',  pulse: true },
  controlado: { label: 'Controlado', bg: 'var(--color-success-dim)',color: 'var(--color-success)', pulse: false },
  vigilancia: { label: 'Vigilancia', bg: 'rgba(56,189,248,0.1)',    color: 'var(--color-info)',    pulse: false },
  activa:     { label: 'Activa',     bg: 'var(--color-danger-dim)', color: 'var(--color-danger)',  pulse: true },
  cerrada:    { label: 'Cerrada',    bg: 'rgba(100,116,139,0.15)',  color: 'var(--color-muted)',   pulse: false },
  urgente:    { label: 'Urgente',    bg: 'var(--color-danger-dim)', color: 'var(--color-danger)',  pulse: true },
  informativa:{ label: 'Informativa',bg: 'var(--color-info-dim)',   color: 'var(--color-info)',    pulse: false },
};

const BadgeNivel = ({ nivel, className = '' }) => {
  const cfg = CONFIG[nivel] || { label: nivel, bg: 'rgba(100,116,139,0.15)', color: 'var(--color-text-2)', pulse: false };

  return (
    <span
      className={`badge-nivel ${cfg.pulse ? 'animate-pulse-danger' : ''} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 10px',
        borderRadius: 'var(--r-full)',
        fontSize: '0.72rem',
        fontWeight: '600',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.color}40`,
        whiteSpace: 'nowrap',
      }}
    >
      {cfg.pulse && (
        <span style={{
          width: 7, height: 7,
          borderRadius: '50%',
          background: cfg.color,
          display: 'inline-block',
          flexShrink: 0,
        }} />
      )}
      {cfg.label}
    </span>
  );
};

export default BadgeNivel;
