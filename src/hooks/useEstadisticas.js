import { useState, useEffect, useRef } from 'react'
import { facturasAPI } from '../services/api'

export const useEstadisticas = () => {
  const [estadisticas, setEstadisticas] = useState({
    total_empresas_pendientes: 0,
    total_facturas_pendientes: 0,
    monto_total_adeudado: 0,
    empresas_con_montos: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const hasLoaded = useRef(false)

  const cargarEstadisticas = async () => {
    if (hasLoaded.current) return
    
    hasLoaded.current = true
    
    try {
      setLoading(true)
      setError(null)

      const response = await facturasAPI.getEstadisticas()
      setEstadisticas(response.data)
    } catch (err) {
      console.error('Error cargando estadísticas:', err)
      let errorMessage = 'Error al cargar las estadísticas del servidor.'
      
      if (err.code === 'ECONNREFUSED') {
        errorMessage = 'No se puede conectar al backend. Verifica que esté ejecutándose en http://127.0.0.1:8000'
      } else if (err.response) {
        errorMessage = `Error del servidor: ${err.response.status} - ${err.response.statusText}`
      } else if (err.request) {
        errorMessage = 'No se recibió respuesta del servidor. Verifica la URL y el endpoint.'
      } else {
        errorMessage = `Error de conexión: ${err.message}`
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarEstadisticas()
  }, [])

  const recargarEstadisticas = () => {
    hasLoaded.current = false
    cargarEstadisticas()
  }

  return { 
    estadisticas, 
    loading, 
    error, 
    recargarEstadisticas 
  }
} 