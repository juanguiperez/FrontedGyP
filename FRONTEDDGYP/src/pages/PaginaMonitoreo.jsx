import React from 'react';
import { MapaInteractivo } from '../components/organisms/MapaInteractivo';

export const PaginaMonitoreo = () => {
  // Datos simulados (mock) mientras conectas tu BFF
  const focosSimulados = [
    { id: 1, lat: -33.4489, lng: -70.6693, detalle: 'Incendio Forestal activo en Santiago' }
  ];
  
  return (
    <div>
      <h2>📍 Monitoreo Geográfico en Tiempo Real</h2>
      <MapaInteractivo puntos={focosSimulados} />
    </div>
  );
};