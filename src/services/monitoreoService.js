const BASE_URL = 'http://localhost:8080/api/monitoreo';

const MOCK_FOCOS = [
  {
    id: 1,
    lat: -38.7359,
    lng: -72.5904,
    nombre: 'Foco Forestal Temuco Norte',
    estado: 'activo',
    nivelRiesgo: 'critico',
    hectareasAfectadas: 320,
    temperatura: 42,
    humedad: 18,
    velocidadViento: 35,
    unidadesAsignadas: 4,
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    region: 'La Araucanía',
  },
  {
    id: 2,
    lat: -41.4717,
    lng: -72.9419,
    nombre: 'Incendio Puerto Montt Sector Costero',
    estado: 'activo',
    nivelRiesgo: 'alto',
    hectareasAfectadas: 85,
    temperatura: 38,
    humedad: 22,
    velocidadViento: 28,
    unidadesAsignadas: 2,
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    region: 'Los Lagos',
  },
  {
    id: 3,
    lat: -39.8196,
    lng: -73.2452,
    nombre: 'Foco Valdivia Sector Cordillerano',
    estado: 'controlado',
    nivelRiesgo: 'medio',
    hectareasAfectadas: 47,
    temperatura: 34,
    humedad: 28,
    velocidadViento: 18,
    unidadesAsignadas: 3,
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    region: 'Los Ríos',
  },
  {
    id: 4,
    lat: -43.1203,
    lng: -72.7041,
    nombre: 'Avistamiento Coyhaique',
    estado: 'vigilancia',
    nivelRiesgo: 'bajo',
    hectareasAfectadas: 12,
    temperatura: 29,
    humedad: 35,
    velocidadViento: 12,
    unidadesAsignadas: 1,
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    region: 'Aysén',
  },
];

const MOCK_ESTADISTICAS = {
  focosActivos: 2,
  focosControlados: 1,
  focosVigilancia: 1,
  hectareasAfectadasTotal: 464,
  unidadesDeployadas: 10,
  alertasCriticas: 1,
};

// GeoJSON de zonas de riesgo — Sur de Chile
export const GEOJSON_ZONAS_RIESGO = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { nombre: 'Zona Riesgo Alto — Precordillera Temuco', nivel: 'alto' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-72.8, -38.5], [-72.3, -38.5], [-72.3, -38.9], [-72.8, -38.9], [-72.8, -38.5],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: { nombre: 'Zona Riesgo Medio — Cuenca Valdivia', nivel: 'medio' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-73.4, -39.6], [-72.9, -39.6], [-72.9, -40.1], [-73.4, -40.1], [-73.4, -39.6],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: { nombre: 'Corredor Evacuación Ruta 5 Sur', nivel: 'evacuacion' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-72.59, -38.73],
          [-72.70, -39.30],
          [-72.94, -39.82],
          [-73.10, -40.58],
          [-72.94, -41.47],
        ],
      },
    },
  ],
};

// ── API functions ──
export const obtenerFocos = async () => {
  try {
    const res = await fetch(`${BASE_URL}/focos`);
    if (!res.ok) throw new Error('Error al obtener focos');
    return await res.json();
  } catch {
    // Devuelve mock si el servidor no está disponible
    return MOCK_FOCOS;
  }
};

export const obtenerEstadisticas = async () => {
  try {
    const res = await fetch(`${BASE_URL}/estadisticas`);
    if (!res.ok) throw new Error('Error al obtener estadísticas');
    return await res.json();
  } catch {
    return MOCK_ESTADISTICAS;
  }
};
