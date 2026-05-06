// ============================================================
// SERVICIO — Alertas
// Endpoint real: reemplaza BASE_URL con tu microservicio
// ============================================================

const BASE_URL = 'http://localhost:8082/api/alertas'; // 🔁 Reemplazar

const MOCK_ALERTAS = [
  {
    id: 1,
    nivel: 'critica',
    titulo: 'Evacuación Inmediata — Temuco Norte',
    descripcion: 'Incendio forestal de rápida propagación avanza hacia zona urbana. Evacuación obligatoria de los sectores Labranza y Quilamapu.',
    zona: 'Temuco Norte, La Araucanía',
    fechaEmision: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    estado: 'activa',
    poblacionAfectada: 1200,
    responsable: 'ONEMI Araucanía',
  },
  {
    id: 2,
    nivel: 'alta',
    titulo: 'Alerta Roja — Puerto Montt Costero',
    descripcion: 'Foco de incendio activo con vientos desfavorables. Se ordena preparación de evacuación en sectores costeros.',
    zona: 'Puerto Montt, Los Lagos',
    fechaEmision: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    estado: 'activa',
    poblacionAfectada: 350,
    responsable: 'Brigada Los Lagos',
  },
  {
    id: 3,
    nivel: 'media',
    titulo: 'Precaución — Humo en Valdivia',
    descripcion: 'Presencia de humo denso en sector centro de Valdivia. Se recomienda evitar actividades al aire libre y usar mascarillas.',
    zona: 'Valdivia, Los Ríos',
    fechaEmision: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    estado: 'activa',
    poblacionAfectada: 5000,
    responsable: 'SEREMI Salud Los Ríos',
  },
  {
    id: 4,
    nivel: 'preventiva',
    titulo: 'Aviso Meteorológico — Alta Temperatura',
    descripcion: 'Pronóstico de temperaturas superiores a 40°C para los próximos 3 días en región de La Araucanía. Riesgo extremo de incendios.',
    zona: 'Región de La Araucanía',
    fechaEmision: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    estado: 'activa',
    poblacionAfectada: 0,
    responsable: 'Dirección Meteorológica de Chile',
  },
  {
    id: 5,
    nivel: 'alta',
    titulo: 'Alerta Temprana — Lago Ranco',
    descripcion: 'Detección de foco de calor en sector boscoso norte del Lago Ranco. Brigada forestal en camino.',
    zona: 'Lago Ranco, Los Ríos',
    fechaEmision: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
    estado: 'cerrada',
    poblacionAfectada: 120,
    responsable: 'CONAF Los Ríos',
  },
];

// ── API functions ──
export const obtenerAlertas = async () => {
  try {
    const res = await fetch(`${BASE_URL}`);
    if (!res.ok) throw new Error('Error al obtener alertas');
    return await res.json();
  } catch {
    return MOCK_ALERTAS;
  }
};

export const cerrarAlerta = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}/cerrar`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Error al cerrar alerta');
    return await res.json();
  } catch {
    return { success: true, id };
  }
};

export const crearAlerta = async (datos) => {
  try {
    const res = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    if (!res.ok) throw new Error('Error al crear alerta');
    return await res.json();
  } catch {
    return { success: true, id: Date.now(), ...datos };
  }
};
