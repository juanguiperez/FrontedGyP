// PaginaAlertas — Gestión de alertas comunitarias
import React, { useState, useEffect } from 'react';
import TarjetaAlerta from '../components/molecules/TarjetaAlerta';
import TarjetaEstadistica from '../components/molecules/TarjetaEstadistica';
import BadgeNivel from '../components/atoms/BadgeNivel';
import Spinner from '../components/atoms/Spinner';
import { obtenerAlertas, cerrarAlerta, crearAlerta } from '../services/alertasService';
import { useAuth } from '../context/AuthContext';

const FILTROS_NIVEL = ['todas', 'critica', 'alta', 'media', 'preventiva'];
const FILTROS_ESTADO = ['todas', 'activa', 'cerrada'];

const PaginaAlertas = () => {
  const { esAdmin } = useAuth();
  const [alertas, setAlertas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroNivel, setFiltroNivel] = useState('todas');
  const [filtroEstado, setFiltroEstado] = useState('activa');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nueva, setNueva] = useState({ titulo: '', descripcion: '', zona: '', nivel: 'media', responsable: '' });
  const [guardando, setGuardando] = useState(false);

  const cargarAlertas = async () => {
    setCargando(true);
    const data = await obtenerAlertas();
    setAlertas(data);
    setCargando(false);
  };

  useEffect(() => { cargarAlertas(); }, []);

  const handleCerrar = async (id) => {
    await cerrarAlerta(id);
    setAlertas(prev => prev.map(a => a.id === id ? { ...a, estado: 'cerrada' } : a));
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    setGuardando(true);
    const result = await crearAlerta({
      ...nueva,
      estado: 'activa',
      fechaEmision: new Date().toISOString(),
      poblacionAfectada: 0,
    });
    setAlertas(prev => [result, ...prev]);
    setNueva({ titulo: '', descripcion: '', zona: '', nivel: 'media', responsable: '' });
    setModalAbierto(false);
    setGuardando(false);
  };

  // Filtrado
  const filtradas = alertas.filter(a => {
    const porNivel = filtroNivel === 'todas' || a.nivel === filtroNivel;
    const porEstado = filtroEstado === 'todas' || a.estado === filtroEstado;
    return porNivel && porEstado;
  });

  // Stats
  const stats = {
    total: alertas.length,
    activas: alertas.filter(a => a.estado === 'activa').length,
    criticas: alertas.filter(a => a.nivel === 'critica' && a.estado === 'activa').length,
    cerradas: alertas.filter(a => a.estado === 'cerrada').length,
  };

  const COLORES_NIVEL = { critica: 'var(--color-danger)', alta: 'var(--color-warning)', media: '#fbbf24', preventiva: 'var(--color-info)', todas: 'var(--color-text-2)' };

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: 'var(--color-bg)',
    border: '1px solid var(--color-border-2)',
    borderRadius: 'var(--r-md)',
    color: 'var(--color-text)',
    fontSize: '0.88rem', outline: 'none',
    fontFamily: 'var(--font-sans)',
    transition: 'border-color var(--transition-fast)',
  };

  return (
    <div style={{ padding: 'var(--sp-6)', maxWidth: 1100, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-6)', flexWrap: 'wrap', gap: 'var(--sp-4)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 4 }}>
            🚨 Gestión de Alertas
          </h1>
          <p style={{ color: 'var(--color-text-2)', fontSize: '0.85rem' }}>
            Alertas comunitarias activas — {esAdmin ? 'Vista Administrador' : 'Vista Usuario'}
          </p>
        </div>
        {esAdmin && (
          <button
            id="btn-nueva-alerta"
            onClick={() => setModalAbierto(true)}
            style={{
              background: 'var(--grad-fire)',
              border: 'none', color: 'white',
              padding: '10px 20px', borderRadius: 'var(--r-md)',
              cursor: 'pointer', fontSize: '0.88rem', fontWeight: 700,
              boxShadow: 'var(--shadow-fire)',
              transition: 'all var(--transition-base)', fontFamily: 'var(--font-sans)',
              display: 'flex', alignItems: 'center', gap: 'var(--sp-2)',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            + Nueva Alerta
          </button>
        )}
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        <TarjetaEstadistica icono="📋" valor={stats.total} etiqueta="Total Alertas" color="var(--color-primary)" />
        <TarjetaEstadistica icono="🚨" valor={stats.activas} etiqueta="Alertas Activas" color="var(--color-warning)" />
        <TarjetaEstadistica icono="🔴" valor={stats.criticas} etiqueta="Alertas Críticas" color="var(--color-danger)" />
        <TarjetaEstadistica icono="✅" valor={stats.cerradas} etiqueta="Cerradas" color="var(--color-success)" />
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 'var(--sp-4)', marginBottom: 'var(--sp-5)', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Filtro Nivel */}
        <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 600, alignSelf: 'center' }}>NIVEL:</span>
          {FILTROS_NIVEL.map(f => (
            <button
              key={f}
              id={`filtro-nivel-${f}`}
              onClick={() => setFiltroNivel(f)}
              style={{
                background: filtroNivel === f ? `${COLORES_NIVEL[f]}22` : 'var(--color-surface)',
                border: `1px solid ${filtroNivel === f ? COLORES_NIVEL[f] + '60' : 'var(--color-border)'}`,
                color: filtroNivel === f ? COLORES_NIVEL[f] : 'var(--color-text-2)',
                padding: '5px 12px', borderRadius: 'var(--r-full)',
                cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
                transition: 'all var(--transition-fast)', textTransform: 'capitalize',
                fontFamily: 'var(--font-sans)',
              }}
            >{f}</button>
          ))}
        </div>

        <div style={{ width: 1, height: 24, background: 'var(--color-border)', flexShrink: 0 }} />

        {/* Filtro Estado */}
        <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 600, alignSelf: 'center' }}>ESTADO:</span>
          {FILTROS_ESTADO.map(f => (
            <button
              key={f}
              id={`filtro-estado-${f}`}
              onClick={() => setFiltroEstado(f)}
              style={{
                background: filtroEstado === f ? 'var(--color-primary-glow)' : 'var(--color-surface)',
                border: `1px solid ${filtroEstado === f ? 'rgba(249,115,22,0.5)' : 'var(--color-border)'}`,
                color: filtroEstado === f ? 'var(--color-primary)' : 'var(--color-text-2)',
                padding: '5px 12px', borderRadius: 'var(--r-full)',
                cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
                transition: 'all var(--transition-fast)', textTransform: 'capitalize',
                fontFamily: 'var(--font-sans)',
              }}
            >{f}</button>
          ))}
        </div>

        <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)', marginLeft: 'auto' }}>
          {filtradas.length} resultado{filtradas.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Lista de alertas */}
      {cargando ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--sp-12)' }}>
          <Spinner size={40} />
        </div>
      ) : filtradas.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 'var(--sp-12)',
          background: 'var(--color-surface)', borderRadius: 'var(--r-lg)',
          border: '1px solid var(--color-border)',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 'var(--sp-3)' }}>🚨</div>
          <div style={{ color: 'var(--color-text-2)', fontWeight: 600 }}>Sin alertas para este filtro</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          {filtradas.map((alerta, i) => (
            <div key={alerta.id} style={{ animationDelay: `${i * 60}ms` }}>
              <TarjetaAlerta alerta={alerta} onCerrar={handleCerrar} esAdmin={esAdmin} />
            </div>
          ))}
        </div>
      )}

      {/* Modal Nueva Alerta (solo admin) */}
      {modalAbierto && (
        <div
          id="modal-nueva-alerta-overlay"
          style={{
            position: 'fixed', inset: 0, zIndex: 500,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)',
            padding: 'var(--sp-5)',
          }}
          onClick={e => { if (e.target === e.currentTarget) setModalAbierto(false); }}
        >
          <div className="animate-fade-up" style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-2)',
            borderRadius: 'var(--r-xl)',
            padding: 'var(--sp-8)',
            width: '100%', maxWidth: 560,
            boxShadow: 'var(--shadow-lg)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-6)' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text)' }}>
                🚨 Nueva Alerta
              </h2>
              <button id="btn-cerrar-modal" onClick={() => setModalAbierto(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', fontSize: '1.3rem' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCrear} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              {[
                { id: 'nueva-titulo', label: 'Título', key: 'titulo', placeholder: 'Ej: Evacuación Sector Norte' },
                { id: 'nueva-zona', label: 'Zona / Sector', key: 'zona', placeholder: 'Ej: Temuco Norte, La Araucanía' },
                { id: 'nueva-responsable', label: 'Responsable', key: 'responsable', placeholder: 'Ej: ONEMI Araucanía' },
              ].map(({ id, label, key, placeholder }) => (
                <div key={key}>
                  <label htmlFor={id} style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-2)', marginBottom: 'var(--sp-2)' }}>{label}</label>
                  <input id={id} required placeholder={placeholder} value={nueva[key]}
                    onChange={e => setNueva(p => ({ ...p, [key]: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--color-border-2)'}
                  />
                </div>
              ))}

              <div>
                <label htmlFor="nueva-nivel" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-2)', marginBottom: 'var(--sp-2)' }}>Nivel</label>
                <select id="nueva-nivel" value={nueva.nivel}
                  onChange={e => setNueva(p => ({ ...p, nivel: e.target.value }))}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="preventiva">🔵 Preventiva</option>
                  <option value="media">⚡ Media</option>
                  <option value="alta">⚠️ Alta</option>
                  <option value="critica">🚨 Crítica</option>
                </select>
              </div>

              <div>
                <label htmlFor="nueva-descripcion" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-2)', marginBottom: 'var(--sp-2)' }}>Descripción</label>
                <textarea id="nueva-descripcion" required rows={3} placeholder="Descripción detallada de la alerta..."
                  value={nueva.descripcion}
                  onChange={e => setNueva(p => ({ ...p, descripcion: e.target.value }))}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
                  onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--color-border-2)'}
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--sp-3)', marginTop: 'var(--sp-2)' }}>
                <button type="button" onClick={() => setModalAbierto(false)}
                  style={{
                    flex: 1, padding: '11px', background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)', borderRadius: 'var(--r-md)',
                    color: 'var(--color-text-2)', cursor: 'pointer', fontSize: '0.88rem',
                    fontFamily: 'var(--font-sans)',
                  }}>
                  Cancelar
                </button>
                <button id="btn-guardar-alerta" type="submit" disabled={guardando}
                  style={{
                    flex: 1, padding: '11px',
                    background: 'var(--grad-fire)', border: 'none',
                    borderRadius: 'var(--r-md)', color: 'white',
                    cursor: guardando ? 'not-allowed' : 'pointer',
                    fontSize: '0.88rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--sp-2)',
                    fontFamily: 'var(--font-sans)',
                  }}>
                  {guardando ? <><Spinner size={16} color="white" /> Guardando...</> : '🚨 Crear Alerta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaginaAlertas;