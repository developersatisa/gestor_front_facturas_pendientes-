import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000' // URL hardcodeada para evitar problemas de .env

const api = axios.create({
  baseURL: API_URL,
  timeout: 300000, // 5 minutos para permitir procesamiento de grandes volúmenes de datos
  withCredentials: false,
})

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la API:', error)
    return Promise.reject(error)
  }
)

export const facturasAPI = {
  // Obtener estadÃ­sticas del dashboard
  getEstadisticas: () => api.get('/api/estadisticas'),
  
  // Obtener clientes con resumen
  getClientesConResumen: () => api.get('/api/clientes-con-resumen'),
  
  // Obtener facturas de un cliente especÃ­fico
  getFacturasCliente: (idCliente) => api.get(`/api/facturas-cliente/${idCliente}`),
  
  // Obtener facturas con datos de clientes
  getFacturasConClientes: () => api.get('/api/facturas-con-clientes'),
  
  // Obtener facturas bÃ¡sicas
  getFacturas: () => api.get('/api/facturas'),
  
  // Obtener clientes
  getClientes: () => api.get('/api/clientes'),
  
  // Obtener sociedades
  getSociedades: () => api.get('/api/sociedades'),
}

// FunciÃ³n de prueba para verificar la conexiÃ³n
export const testConnection = () => api.get('/docs')

export default api 