import axios from 'axios'

// Configuración de la URL base de la API según la guía de producción.
// Por defecto, apunta a 'http://TU_SERVIDOR_IP:8000' (reemplazar en producción).
// Permite sobreescribir mediante variables de entorno VITE_API_BASE_URL, VITE_API_URL o VITE_BACKEND_URL.
const ENV_BASE =
  import.meta?.env?.VITE_API_BASE_URL ||
  import.meta?.env?.VITE_API_URL ||
  import.meta?.env?.VITE_BACKEND_URL

// Si no hay variable de entorno, usar la URL de la ventana (útil en desarrollo local),
// o bien la URL de ejemplo de producción.
const DEFAULT_BASE =
  typeof window !== 'undefined' && window.location?.origin
    ? window.location.origin
    : 'http://10.150.22.15:8000'

const API_BASE_URL = ENV_BASE || DEFAULT_BASE

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000,
  withCredentials: false,
})

if (
  typeof window !== 'undefined' &&
  import.meta &&
  import.meta.env &&
  import.meta.env.DEV
) {
  // Log para depuración en desarrollo
  console.info('[API] baseURL =', API_BASE_URL)
}

// Interceptor para manejo de errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la API:', error)
    return Promise.reject(error)
  }
)

// API de facturas
export const facturasAPI = {
  getEstadisticas: () => api.get('/api/estadisticas'),
  getClientesConResumen: () => api.get('/api/clientes-con-resumen'),
  getFacturasCliente: (idCliente) => api.get(`/api/facturas-cliente/${idCliente}`),
  getFacturasConClientes: () => api.get('/api/facturas-con-clientes'),
  getFacturas: () => api.get('/api/facturas'),
  getClientes: () => api.get('/api/clientes'),
  getSociedades: () => api.get('/api/sociedades'),
}

// API de historial de facturas
export const historialAPI = {
  list: ({ tercero, tipo, asiento, limit } = {}) => {
    const params = new URLSearchParams()
    if (tercero) params.set('tercero', String(tercero))
    if (tipo) params.set('tipo', String(tipo))
    if (asiento) params.set('asiento', String(asiento))
    if (limit) params.set('limit', String(limit))
    const qs = params.toString()
    return api.get(`/api/historial-facturas${qs ? `?${qs}` : ''}`)
  },
  add: (payload) => api.post('/api/historial-facturas', payload),
}

// API de historial de pagos
export const pagosAPI = {
  getHistorialPago: ({ tipo, asiento, tercero, sociedad }) =>
    api.get('/api/facturas/historial-pago', {
      params: { tipo, asiento, tercero, sociedad },
    }),
  listPagadas: ({ tercero, limit = 200 } = {}) =>
    api.get('/api/facturas/historial-pagadas', { params: { tercero, limit } }),
}

// API de registro de acciones y cambios
export const registroAPI = {
  addAccion: (payload) => api.post('/api/facturas/acciones', payload),
  listAcciones: (params = {}) => api.get('/api/facturas/acciones', { params }),
  addCambio: (payload) => api.post('/api/facturas/cambios', payload),
  listCambios: (params = {}) => api.get('/api/facturas/cambios', { params }),
}

// API de consultores y asignaciones
export const consultoresAPI = {
  list: (solo_activos = false) =>
    api.get(`/api/consultores`, { params: { solo_activos } }),
  create: ({ nombre, estado = 'activo' }) =>
    api.post('/api/consultores', { nombre, estado }),
  update: (id, { nombre, estado = 'activo' }) =>
    api.put(`/api/consultores/${id}`, { nombre, estado }),
  remove: (id) => api.delete(`/api/consultores/${id}`),
  getAsignacion: (idcliente) =>
    api.get(`/api/consultores/asignacion/${idcliente}`),
  asignar: ({ idcliente, consultor_id }) =>
    api.post(`/api/consultores/asignar`, { idcliente, consultor_id }),
  desasignar: (idcliente) =>
    api.delete(`/api/consultores/asignacion/${idcliente}`),
  listAsignaciones: () => api.get('/api/consultores/asignaciones'),
}

// Función de prueba para verificar la conexión con la API
export const testConnection = () => api.get('/docs')

export default api
