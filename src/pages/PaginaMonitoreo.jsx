// PaginaMonitoreo — Dashboard principal con mapa + KPIs + tabla de focos
import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Map as MapIcon, 
  List, 
  RefreshCw, 
  Flame, 
  CheckCircle2, 
  Eye, 
  LandPlot, 
  Truck, 
  AlertTriangle,
  Navigation,
  MapPin
} from 'lucide-react';
import MapaMonitoreo from '../components/organisms/MapaMonitoreo';
import TarjetaEstadistica from '../components/molecules/TarjetaEstadistica';
import BadgeNivel from '../components/atoms/BadgeNivel';

import Spinner from '../components/atoms/Spinner';
import { obtenerFocos, obtenerEstadisticas, GEOJSON_ZONAS_RIESGO } from '../services/monitoreoService';

const formatFecha = (iso) => new Date(iso).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });

const PaginaMonitoreo = () => {
  const [focos, setFocos] = useState([]);
  const [stats, setStats] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [vistaActiva, setVistaActiva] = useState('mapa'); // 'mapa' | 'tabla'
  const [ultimaActualizacion, setUltimaActualizacion] = useState(new Date());

  const cargarDatos = async () => {
    setCargando(true);
    const [f, s] = await Promise.all([obtenerFocos(), obtenerEstadisticas()]);
    setFocos(f);
    setStats(s);
    setUltimaActualizacion(new Date());
    setCargando(false);
  };

  useEffect(() => {
    cargarDatos();
    const interval = setInterval(cargarDatos, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 'var(--sp-6)', maxWidth: 1400, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--sp-6)', flexWrap: 'wrap', gap: 'var(--sp-4)' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-text)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
            <Activity color="var(--color-primary)" size={28} /> Monitoreo de Focos
          </h1>
          <p style={{ color: 'var(--color-text-2)', fontSize: '0.85rem', fontWeight: 500 }}>
            Región Sur de Chile — Actualizado: <span style={{ color: 'var(--color-primary)' }}>{ultimaActualizacion.toLocaleTimeString('es-CL')}</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'center' }}>
          {/* Tabs mapa/tabla */}
          <div style={{ display: 'flex', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--r-sm)', overflow: 'hidden' }}>
            {[
              { key: 'mapa', label: 'Mapa', icon: <MapIcon size={16} /> },
              { key: 'tabla', label: 'Tabla', icon: <List size={16} /> }
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                id={`tab-vista-${key}`}
                onClick={() => setVistaActiva(key)}
                style={{
                  padding: '10px 18px', border: 'none', cursor: 'pointer',
                  background: vistaActiva === key ? 'var(--color-primary)' : 'transparent',
                  color: vistaActiva === key ? 'white' : 'var(--color-text-2)',
                  fontSize: '0.85rem', fontWeight: 700,
                  transition: 'all var(--transition-fast)',
                  fontFamily: 'var(--font-sans)',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                {icon} {label}
              </button>
            ))}
          </div>
          <button
            id="btn-refrescar-monitoreo"
            onClick={cargarDatos}
            disabled={cargando}
            style={{
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              color: 'var(--color-text-2)', padding: '10px 18px',
              borderRadius: 'var(--r-sm)', cursor: cargando ? 'not-allowed' : 'pointer',
              fontSize: '0.85rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 'var(--sp-2)',
              transition: 'all var(--transition-fast)', fontFamily: 'var(--font-sans)',
            }}
          >
            {cargando ? <Spinner size={14} /> : <RefreshCw size={16} />} Actualizar
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
          <TarjetaEstadistica icono={<Flame size={24} />} valor={stats.focosActivos} etiqueta="Focos Activos" color="var(--color-danger)" tendencia={2.4} />
          <TarjetaEstadistica icono={<CheckCircle2 size={24} />} valor={stats.focosControlados} etiqueta="Focos Controlados" color="var(--color-success)" />
          <TarjetaEstadistica icono={<Eye size={24} />} valor={stats.focosVigilancia} etiqueta="En Vigilancia" color="var(--color-info)" />
          <TarjetaEstadistica icono={<LandPlot size={24} />} valor={stats.hectareasAfectadasTotal} etiqueta="Hectáreas" color="var(--color-warning)" tendencia={-12} />
          <TarjetaEstadistica icono={<Truck size={24} />} valor={stats.unidadesDeployadas} etiqueta="Unidades" color="var(--color-primary)" />
          <TarjetaEstadistica icono={<AlertTriangle size={24} />} valor={stats.alertasCriticas} etiqueta="Críticas" color="var(--color-danger)" />
        </div>
      )}

      {cargando && !stats ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--sp-12)' }}>
          <Spinner size={40} />
        </div>
      ) : (
        <>
          {/* Vista Mapa */}
          {vistaActiva === 'mapa' && (
            <div className="animate-fade-up">
              <MapaMonitoreo focos={focos} geoJSON={GEOJSON_ZONAS_RIESGO} />
            </div>
          )}

          {/* Vista Tabla */}
          {vistaActiva === 'tabla' && (
            <div className="animate-fade-up" style={{
              background: 'var(--grad-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--r-sm)',
              overflow: 'hidden',
            }}>
              <div style={{ padding: 'var(--sp-4) var(--sp-5)', borderBottom: '1px solid var(--color-border)', fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <List size={20} color="var(--color-primary)" /> Registro de Focos Activos ({focos.length})
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
                      {['Foco', 'Región', 'Estado', 'Riesgo', 'Área', 'Viento', 'Unidades', 'Actualización'].map(h => (
                        <th key={h} style={{ padding: 'var(--sp-4) var(--sp-5)', textAlign: 'left', color: 'var(--color-muted)', fontWeight: 700, whiteSpace: 'nowrap', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {focos.map((f, i) => (
                      <tr key={f.id} style={{
                        borderBottom: '1px solid var(--color-border)',
                        background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                        transition: 'background var(--transition-fast)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'}
                      >
                        <td style={{ padding: 'var(--sp-4) var(--sp-5)', fontWeight: 700, color: 'var(--color-text)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Flame size={14} color="var(--color-danger)" /> {f.nombre}
                          </div>
                        </td>
                        <td style={{ padding: 'var(--sp-4) var(--sp-5)', color: 'var(--color-text-2)', fontWeight: 500 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin size={14} color="var(--color-muted)" /> {f.region}
                          </div>
                        </td>
                        <td style={{ padding: 'var(--sp-4) var(--sp-5)' }}><BadgeNivel nivel={f.estado} /></td>
                        <td style={{ padding: 'var(--sp-4) var(--sp-5)' }}><BadgeNivel nivel={f.nivelRiesgo} /></td>
                        <td style={{ padding: 'var(--sp-4) var(--sp-5)', color: 'var(--color-warning)', fontWeight: 700 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Navigation size={14} /> {f.hectareasAfectadas} ha
                          </div>
                        </td>
                        <td style={{ padding: 'var(--sp-4) var(--sp-5)', fontWeight: 600 }}>{f.velocidadViento} km/h</td>
                        <td style={{ padding: 'var(--sp-4) var(--sp-5)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                            <Truck size={14} color="var(--color-primary)" /> {f.unidadesAsignadas}
                          </div>
                        </td>
                        <td style={{ padding: 'var(--sp-4) var(--sp-5)', color: 'var(--color-muted)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{formatFecha(f.ultimaActualizacion)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PaginaMonitoreo;