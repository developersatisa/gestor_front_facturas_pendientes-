import axios from 'axios'

// Base URL dinámica. Soporta varias variables: VITE_API_BASE_URL, VITE_API_URL, VITE_BACKEND_URL.
const ENV_BASE = import.meta?.env?.VITE_API_BASE_URL || import.meta?.env?.VITE_API_URL || import.meta?.env?.VITE_BACKEND_URL
const DEFAULT_BASE = typeof window !== 'undefined' && window.location?.origin
  ? window.location.origin
  : 'http://127.0.0.1:8000'
const API_BASE_URL = ENV_BASE || DEFAULT_BASE

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000,
  withCredentials: false,
})

if (typeof window !== 'undefined' && import.meta && import.meta.env && import.meta.env.DEV) {
  // Log visible en consola del navegador para verificar a dónde apunta el cliente
  // Útil para depurar 404 cuando el proxy de Vite no está activo o la env no carga
  console.info('[API] baseURL =', API_BASE_URL)
}

// Manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la API:', error)
    return Promise.reject(error)
  }
)

export const facturasAPI = {
  // Obtener estadísticas del dashboard
  getEstadisticas: () => api.get('/api/estadisticas'),
  // Obtener clientes con resumen
  getClientesConResumen: () => api.get('/api/clientes-con-resumen'),
  // Obtener facturas de un cliente específico
  getFacturasCliente: (idCliente) => api.get(`/api/facturas-cliente/${idCliente}`),
  // Obtener facturas con datos de clientes
  getFacturasConClientes: () => api.get('/api/facturas-con-clientes'),
  // Obtener facturas básicas
  getFacturas: () => api.get('/api/facturas'),
  // Obtener clientes
  getClientes: () => api.get('/api/clientes'),
  // Obtener sociedades
  getSociedades: () => api.get('/api/sociedades'),
}

// Historial de facturas
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

// Registro (acciones y cambios de factura)
export const registroAPI = {
  // Acciones
  addAccion: (payload) => api.post('/api/facturas/acciones', payload),
  listAcciones: (params = {}) => api.get('/api/facturas/acciones', { params }),
  // Cambios
  addCambio: (payload) => api.post('/api/facturas/cambios', payload),
  listCambios: (params = {}) => api.get('/api/facturas/cambios', { params }),
}

// Consultores y asignaciones
export const consultoresAPI = {
  list: (solo_activos = false) => api.get(`/api/consultores`, { params: { solo_activos } }),
  create: ({ nombre, estado = 'activo' }) => api.post('/api/consultores', { nombre, estado }),
  update: (id, { nombre, estado = 'activo' }) => api.put(`/api/consultores/${id}`, { nombre, estado }),
  remove: (id) => api.delete(`/api/consultores/${id}`),
  getAsignacion: (idcliente) => api.get(`/api/consultores/asignacion/${idcliente}`),
  asignar: ({ idcliente, consultor_id }) => api.post(`/api/consultores/asignar`, { idcliente, consultor_id }),
  desasignar: (idcliente) => api.delete(`/api/consultores/asignacion/${idcliente}`),
  listAsignaciones: () => api.get('/api/consultores/asignaciones'),
}

// Función de prueba para verificar la conexión
export const testConnection = () => api.get('/docs')

export default api
