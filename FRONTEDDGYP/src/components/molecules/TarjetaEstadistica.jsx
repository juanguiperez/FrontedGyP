// TarjetaEstadistica — KPI card para el dashboard de monitoreo
import React from 'react';

const TarjetaEstadistica = ({ icono, valor, etiqueta, color = 'var(--color-primary)', tendencia }) => {
  return (
    <div className="animate-fade-up" style={{
      background: 'var(--grad-card)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--r-lg)',
      padding: 'var(--sp-6)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform var(--transition-base), border-color var(--transition-base)',
      cursor: 'default',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-3px)';
      e.currentTarget.style.borderColor = color + '60';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = 'var(--color-border)';
    }}
    >
      {/* Glow de fondo */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 80, height: 80,
        background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
        borderRadius: '50%', transform: 'translate(20px, -20px)',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-3)' }}>
        <span style={{ fontSize: '1.8rem' }}>{icono}</span>
        {tendencia !== undefined && (
          <span style={{
            fontSize: '0.75rem', fontWeight: 600,
            color: tendencia >= 0 ? 'var(--color-danger)' : 'var(--color-success)',
            background: tendencia >= 0 ? 'var(--color-danger-dim)' : 'var(--color-success-dim)',
            padding: '2px 8px', borderRadius: 'var(--r-full)',
          }}>
            {tendencia >= 0 ? '↑' : '↓'} {Math.abs(tendencia)}
          </span>
        )}
      </div>

      <div style={{ fontSize: '2.2rem', fontWeight: 800, color, lineHeight: 1, marginBottom: 'var(--sp-1)' }}>
        {valor}
      </div>
      <div style={{ fontSize: '0.82rem', color: 'var(--color-text-2)', fontWeight: 500 }}>
        {etiqueta}
      </div>
    </div>
  );
};

export default TarjetaEstadistica;
