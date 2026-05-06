// MapaMonitoreo — Mapa Leaflet con GeoJSON y marcadores de focos
import React, { useEffect } from 'react';
import {
  MapContainer, TileLayer, Marker, Popup,
  GeoJSON, ZoomControl, useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import BadgeNivel from '../atoms/BadgeNivel';

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
    activo:     { bg: '#ef4444', sombra: 'rgba(239,68,68,0.7)', emoji: '🔥' },
    controlado: { bg: '#22c55e', sombra: 'rgba(34,197,94,0.5)', emoji: '✅' },
    vigilancia: { bg: '#38bdf8', sombra: 'rgba(56,189,248,0.5)', emoji: '👁️' },
  };
  const c = colores[estado] || colores.vigilancia;

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
        font-size:18px;
        box-shadow: 0 0 14px ${c.sombra};
        animation: ${estado === 'activo' ? 'pulse-danger 1.5s infinite' : 'none'};
        cursor:pointer;
      ">${c.emoji}</div>
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

// Componente interno para centrar el mapa en un foco activo
const MapCenterer = ({ center }) => {
  const map = useMap();
  useEffect(() => { map.setView(center, 8); }, [center]);
  return null;
};

const MapaMonitoreo = ({ focos = [], geoJSON = null }) => {
  // Centro: Sur de Chile
  const centroSurChile = [-39.8196, -72.9];

  return (
    <div style={{
      borderRadius: 'var(--r-lg)',
      overflow: 'hidden',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-lg)',
    }}>
      <MapContainer
        center={centroSurChile}
        zoom={7}
        style={{ height: 480, width: '100%' }}
        zoomControl={false}
      >
        {/* Tile oscuro compatible con el tema */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          maxZoom={18}
        />

        <ZoomControl position="bottomright" />

        {/* Capa GeoJSON de zonas de riesgo */}
        {geoJSON && (
          <GeoJSON
            key={JSON.stringify(geoJSON)}
            data={geoJSON}
            style={estiloZona}
            onEachFeature={onEachFeature}
          />
        )}

        {/* Marcadores de focos */}
        {focos.map((foco) => (
          <Marker
            key={foco.id}
            position={[foco.lat, foco.lng]}
            icon={crearIcono(foco.estado)}
          >
            <Popup className="fire-popup">
              <div style={{ minWidth: 220, fontFamily: 'var(--font-sans)', color: 'var(--color-text)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  🔥 {foco.nombre}
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <BadgeNivel nivel={foco.estado} />
                  <BadgeNivel nivel={foco.nivelRiesgo} />
                </div>
                <table style={{ width: '100%', fontSize: '0.78rem', borderCollapse: 'collapse' }}>
                  {[
                    ['📍 Región', foco.region],
                    ['🔥 Hectáreas', `${foco.hectareasAfectadas} ha`],
                    ['🌡️ Temperatura', `${foco.temperatura}°C`],
                    ['💧 Humedad', `${foco.humedad}%`],
                    ['💨 Viento', `${foco.velocidadViento} km/h`],
                    ['🚒 Unidades', foco.unidadesAsignadas],
                  ].map(([k, v]) => (
                    <tr key={k} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '3px 0', color: '#94a3b8', paddingRight: 8 }}>{k}</td>
                      <td style={{ padding: '3px 0', fontWeight: 600 }}>{v}</td>
                    </tr>
                  ))}
                </table>
                <div style={{ fontSize: '0.7rem', marginTop: '8px', color: '#64748b' }}>
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
        display: 'flex', gap: 'var(--sp-5)', flexWrap: 'wrap', alignItems: 'center',
      }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 600 }}>LEYENDA:</span>
        {[
          { emoji: '🔥', label: 'Activo', color: '#ef4444' },
          { emoji: '✅', label: 'Controlado', color: '#22c55e' },
          { emoji: '👁️', label: 'Vigilancia', color: '#38bdf8' },
        ].map(({ emoji, label, color }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', color: 'var(--color-text-2)' }}>
            <span>{emoji}</span> <span style={{ color }}>{label}</span>
          </span>
        ))}
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', color: '#ef4444' }}>
          <span style={{ width: 16, height: 3, background: '#ef4444', display: 'inline-block', borderRadius: 2 }} /> Zona riesgo alto
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', color: '#38bdf8' }}>
          <span style={{ width: 16, height: 3, background: '#38bdf8', display: 'inline-block', borderRadius: 2, opacity: 0.6 }} /> Ruta evacuación
        </span>
      </div>
    </div>
  );
};

export default MapaMonitoreo;
