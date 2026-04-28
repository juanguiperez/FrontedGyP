import React from 'react';
import { TarjetaAlerta } from '../components/molecules/TarjetaAlerta';

export const PaginaAlertas = () => (
  <div>
    <h2>📢 Sistema de Alertas Comunitarias</h2>
    <TarjetaAlerta 
      titulo="Evacuación Sector Norte" 
      mensaje="Incendio descontrolado cerca de zona urbana." 
      nivel="Critica" 
    />
    <TarjetaAlerta 
      titulo="Alerta de Humo" 
      mensaje="Presencia de humo denso en el centro de la ciudad. Precaución." 
      nivel="Preventiva" 
    />
  </div>
);