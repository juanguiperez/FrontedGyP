// MapaMonitoreo — Mapa Leaflet con GeoJSON y marcadores de focos
import React, { useEffect } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  MapContainer, TileLayer, Marker, Popup,
  GeoJSON, ZoomControl, useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import BadgeNivel from '../atoms/BadgeNivel';

import { 
  Flame, 
  CheckCircle2, 
  Eye, 
  Navigation, 
  Thermometer, 
  Droplets, 
  Wind, 
  Truck,
  MapPin
} from 'lucide-react';

// Fix de íconos por defecto de Leaflet con Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Íconos personalizados por estado
const crearIcono = (estado) => {
  const colores = {
    activo:     { bg: '#ef4444', sombra: 'rgba(239,68,68,0.7)', icon: <Flame size={20} color="white" /> },
    controlado: { bg: '#22c55e', sombra: 'rgba(34,197,94,0.5)', icon: <CheckCircle2 size={20} color="white" /> },
    vigilancia: { bg: '#38bdf8', sombra: 'rgba(56,189,248,0.5)', icon: <Eye size={20} color="white" /> },
  };
  const c = colores[estado] || colores.vigilancia;
  const iconHtml = renderToStaticMarkup(c.icon);

  return L.divIcon({
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
    html: `
      <div style="
        width:40px; height:40px;
        display:flex; align-items:center; justify-content:center;
        background:${c.bg}cc;
        border:2px solid ${c.bg};
        border-radius:50%;
        box-shadow: 0 0 14px ${c.sombra};
        animation: ${estado === 'activo' ? 'pulse-danger 1.5s infinite' : 'none'};
        cursor:pointer;
      ">${iconHtml}</div>
    `,
  });
};

// Estilos GeoJSON por tipo de feature
const estiloZona = (feature) => {
  const { nivel } = feature.properties;
  const estilos = {
    alto:       { color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.12, weight: 2, dashArray: '6,4' },
    medio:      { color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.10, weight: 1.5, dashArray: '6,4' },
    evacuacion: { color: '#38bdf8', weight: 3, dashArray: '10,6', fillOpacity: 0 },
  };
  return estilos[nivel] || { color: '#94a3b8', weight: 1 };
};

const onEachFeature = (feature, layer) => {
  if (feature.properties?.nombre) {
    layer.bindTooltip(feature.properties.nombre, {
      permanent: false,
      direction: 'top',
      className: 'fire-popup',
    });
  }
};

const formatFecha = (iso) => new Date(iso).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });

const MapaMonitoreo = ({ focos = [], geoJSON = null }) => {
  const centroSurChile = [-39.8196, -72.9];

  return (
    <div style={{
      borderRadius: 'var(--r-sm)', // Más cuadrado
      overflow: 'hidden',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-lg)',
    }}>
      <MapContainer
        center={centroSurChile}
        zoom={7}
        style={{ height: 400, width: '100%' }} // Mapa más chico (400px)
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          maxZoom={18}
        />

        <ZoomControl position="bottomright" />

        {geoJSON && (
          <GeoJSON
            key={JSON.stringify(geoJSON)}
            data={geoJSON}
            style={estiloZona}
            onEachFeature={onEachFeature}
          />
        )}

        {focos.map((foco) => (
          <Marker
            key={foco.id}
            position={[foco.lat, foco.lng]}
            icon={crearIcono(foco.estado)}
          >
            <Popup className="fire-popup">
              <div style={{ minWidth: 220, fontFamily: 'var(--font-sans)', color: 'var(--color-text)' }}>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-danger)' }}>
                  <Flame size={16} /> {foco.nombre}
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  <BadgeNivel nivel={foco.estado} />
                  <BadgeNivel nivel={foco.nivelRiesgo} />
                </div>
                <table style={{ width: '100%', fontSize: '0.78rem', borderCollapse: 'collapse' }}>
                  <tbody>
                    {[
                      { icon: <MapPin size={12} />, label: 'Región', value: foco.region },
                      { icon: <Navigation size={12} />, label: 'Área', value: `${foco.hectareasAfectadas} ha` },
                      { icon: <Thermometer size={12} />, label: 'Temp.', value: `${foco.temperatura}°C` },
                      { icon: <Droplets size={12} />, label: 'Humedad', value: `${foco.humedad}%` },
                      { icon: <Wind size={12} />, label: 'Viento', value: `${foco.velocidadViento} km/h` },
                      { icon: <Truck size={12} />, label: 'Unidades', value: foco.unidadesAsignadas },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <td style={{ padding: '4px 0', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {row.icon} <span>{row.label}</span>
                        </td>
                        <td style={{ padding: '4px 0', fontWeight: 700, textAlign: 'right' }}>{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ fontSize: '0.65rem', marginTop: '10px', color: 'var(--color-muted)', textAlign: 'center', fontStyle: 'italic' }}>
                  Actualizado: {formatFecha(foco.ultimaActualizacion)}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Leyenda */}
      <div style={{
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        padding: 'var(--sp-3) var(--sp-5)',
        display: 'flex', gap: 'var(--sp-6)', flexWrap: 'wrap', alignItems: 'center',
      }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Leyenda:</span>
        {[
          { icon: <Flame size={14} />, label: 'Activo', color: '#ef4444' },
          { icon: <CheckCircle2 size={14} />, label: 'Controlado', color: '#22c55e' },
          { icon: <Eye size={14} />, label: 'Vigilancia', color: '#38bdf8' },
        ].map(({ icon, label, color }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--color-text-2)', fontWeight: 600 }}>
            <span style={{ color }}>{icon}</span> <span>{label}</span>
          </span>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--color-text-2)' }}>
          <span style={{ width: 12, height: 12, border: '1px dashed #ef4444', background: 'rgba(239,68,68,0.1)', display: 'inline-block' }} /> Zona de Riesgo
        </span>
      </div>
    </div>
  );
};

export default MapaMonitoreo;

