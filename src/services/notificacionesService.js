const BASE_URL = 'http://localhost:8081/api/notificaciones'; // 🔁 Reemplazar

const MOCK_NOTIFICACIONES = [
  {
    id: 1,
    tipo: 'urgente',
    titulo: 'Despacho de brigadas adicionales',
    mensaje: 'Se han despachado 3 brigadas forestales adicionales al sector Temuco Norte. Coordinación con CONAF activa.',
    fecha: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    leida: false,
    emisor: 'Centro de Operaciones',
  },
  {
    id: 2,
    tipo: 'informativa',
    titulo: 'Actualización de condiciones meteorológicas',
    mensaje: 'Pronóstico para las próximas 24h: vientos del norte a 40 km/h, humedad relativa 15%. Condiciones de alto riesgo.',
    fecha: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    leida: false,
    emisor: 'Servicio Meteorológico',
  },
  {
    id: 3,
    tipo: 'preventiva',
    titulo: 'Restricción de quemas agrícolas — Región de Los Lagos',
    mensaje: 'Se decreta prohibición total de quemas a cielo abierto en la Región de Los Lagos hasta nuevo aviso.',
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    leida: true,
    emisor: 'SEREMI Agricultura',
  },
  {
    id: 4,
    tipo: 'urgente',
    titulo: 'Evacuación preventiva Sector Quilaco',
    mensaje: 'Se ordena evacuación preventiva de 450 familias del sector Quilaco, Biobío. Habilitados albergues en Mulchén.',
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    leida: true,
    emisor: 'Oficina Nacional de Emergencia (ONEMI)',
  },
  {
    id: 5,
    tipo: 'informativa',
    titulo: 'Foco controlado en Valdivia',
    mensaje: 'El foco identificado en el sector cordillerano de Valdivia ha sido controlado. Se mantiene vigilancia activa.',
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    leida: true,
    emisor: 'Brigada Forestal Valdivia',
  },
  {
    id: 6,
    tipo: 'preventiva',
    titulo: 'Activación de Plan de Emergencia Comunal',
    mensaje: 'La municipalidad de Temuco ha activado el Plan de Emergencia Comunal. Se solicita colaboración de la ciudadanía.',
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    leida: true,
    emisor: 'Municipalidad de Temuco',
  },
];

// ── API functions ──
export const obtenerNotificaciones = async () => {
  try {
    const res = await fetch(`${BASE_URL}`);
    if (!res.ok) throw new Error('Error al obtener notificaciones');
    return await res.json();
  } catch {
    return MOCK_NOTIFICACIONES;
  }
};

export const marcarLeida = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}/leer`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Error al marcar notificación');
    return await res.json();
  } catch {
    return { success: true, id };
  }
};

export const marcarTodasLeidas = async () => {
  try {
    const res = await fetch(`${BASE_URL}/leer-todas`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Error al marcar todas');
    return await res.json();
  } catch {
    return { success: true };
  }
};
