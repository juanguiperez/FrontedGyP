// Spinner — Indicador de carga
import React from 'react';

const Spinner = ({ size = 24, color = 'var(--color-primary)' }) => (
  <div style={{
    width: size,
    height: size,
    border: `3px solid ${color}30`,
    borderTop: `3px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    flexShrink: 0,
  }} />
);

export default Spinner;
