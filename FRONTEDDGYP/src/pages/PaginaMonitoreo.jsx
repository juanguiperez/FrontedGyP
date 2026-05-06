// PaginaMonitoreo — Dashboard principal con mapa + KPIs + tabla de focos
import React, { useState, useEffect } from 'react';
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
    // Refresco automático cada 30 segundos
    const interval = setInterval(cargarDatos, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 'var(--sp-6)', maxWidth: 1400, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-6)', flexWrap: 'wrap', gap: 'var(--sp-4)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
            🌍 Monitoreo de Focos
          </h1>
          <p style={{ color: 'var(--color-text-2)', fontSize: '0.85rem' }}>
            Región Sur de Chile — Actualizado: {ultimaActualizacion.toLocaleTimeString('es-CL')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'center' }}>
          {/* Tabs mapa/tabla */}
          <div style={{ display: 'flex', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
            {[['mapa', '🗺️ Mapa'], ['tabla', '📋 Tabla']].map(([key, label]) => (
              <button
                key={key}
                id={`tab-vista-${key}`}
                onClick={() => setVistaActiva(key)}
                style={{
                  padding: '8px 16px', border: 'none', cursor: 'pointer',
                  background: vistaActiva === key ? 'var(--color-primary)' : 'transparent',
                  color: vistaActiva === key ? 'white' : 'var(--color-text-2)',
                  fontSize: '0.83rem', fontWeight: 600,
                  transition: 'all var(--transition-fast)',
                  fontFamily: 'var(--font-sans)',
                }}
              >{label}</button>
            ))}
          </div>
          <button
            id="btn-refrescar-monitoreo"
            onClick={cargarDatos}
            disabled={cargando}
            style={{
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              color: 'var(--color-text-2)', padding: '8px 16px',
              borderRadius: 'var(--r-md)', cursor: cargando ? 'not-allowed' : 'pointer',
              fontSize: '0.83rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 'var(--sp-2)',
              transition: 'all var(--transition-fast)', fontFamily: 'var(--font-sans)',
            }}
          >
            {cargando ? <Spinner size={14} /> : '↻'} Actualizar
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
          <TarjetaEstadistica icono="🔥" valor={stats.focosActivos} etiqueta="Focos Activos" color="var(--color-danger)" tendencia={1} />
          <TarjetaEstadistica icono="✅" valor={stats.focosControlados} etiqueta="Focos Controlados" color="var(--color-success)" />
          <TarjetaEstadistica icono="👁️" valor={stats.focosVigilancia} etiqueta="En Vigilancia" color="var(--color-info)" />
          <TarjetaEstadistica icono="🌲" valor={`${stats.hectareasAfectadasTotal}`} etiqueta="Hectáreas Afectadas" color="var(--color-warning)" tendencia={47} />
          <TarjetaEstadistica icono="🚒" valor={stats.unidadesDeployadas} etiqueta="Unidades Desplegadas" color="var(--color-primary)" />
          <TarjetaEstadistica icono="🚨" valor={stats.alertasCriticas} etiqueta="Alertas Críticas" color="var(--color-danger)" />
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
              borderRadius: 'var(--r-lg)',
              overflow: 'hidden',
            }}>
              <div style={{ padding: 'var(--sp-4) var(--sp-5)', borderBottom: '1px solid var(--color-border)', fontWeight: 700, fontSize: '0.9rem' }}>
                📋 Registro de Focos Activos ({focos.length})
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
                      {['Nombre del Foco', 'Región', 'Estado', 'Riesgo', 'Hectáreas', 'Viento', 'Unidades', 'Actualizado'].map(h => (
                        <th key={h} style={{ padding: 'var(--sp-3) var(--sp-4)', textAlign: 'left', color: 'var(--color-text-2)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
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
                        <td style={{ padding: 'var(--sp-3) var(--sp-4)', fontWeight: 600 }}>🔥 {f.nombre}</td>
                        <td style={{ padding: 'var(--sp-3) var(--sp-4)', color: 'var(--color-text-2)' }}>📍 {f.region}</td>
                        <td style={{ padding: 'var(--sp-3) var(--sp-4)' }}><BadgeNivel nivel={f.estado} /></td>
                        <td style={{ padding: 'var(--sp-3) var(--sp-4)' }}><BadgeNivel nivel={f.nivelRiesgo} /></td>
                        <td style={{ padding: 'var(--sp-3) var(--sp-4)', color: 'var(--color-warning)' }}>{f.hectareasAfectadas} ha</td>
                        <td style={{ padding: 'var(--sp-3) var(--sp-4)' }}>{f.velocidadViento} km/h</td>
                        <td style={{ padding: 'var(--sp-3) var(--sp-4)' }}>🚒 {f.unidadesAsignadas}</td>
                        <td style={{ padding: 'var(--sp-3) var(--sp-4)', color: 'var(--color-muted)', fontSize: '0.76rem', whiteSpace: 'nowrap' }}>{formatFecha(f.ultimaActualizacion)}</td>
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