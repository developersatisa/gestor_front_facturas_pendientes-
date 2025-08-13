import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { facturasAPI } from '../services/api'
import { mockConsultores } from '../data/mockData'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData debe ser usado dentro de un DataProvider')
  }
  return context
}

export const DataProvider = ({ children }) => {
  const [empresas, setEmpresas] = useState([])
  
  // Cargar consultores desde localStorage o usar mockConsultores como fallback
  const [consultores, setConsultores] = useState(() => {
    try {
      const savedConsultores = localStorage.getItem('atisa_consultores')
      return savedConsultores ? JSON.parse(savedConsultores) : mockConsultores
    } catch (error) {
      console.error('Error cargando consultores desde localStorage:', error)
      return mockConsultores
    }
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dataLoaded, setDataLoaded] = useState(false)
  const hasLoaded = useRef(false)

  // FunciÃ³n para procesar los datos de clientes con resumen
  const procesarDatosClientes = (clientesData) => {
    return clientesData.map(cliente => ({
      id: cliente.idcliente,
      nombre: cliente.nombre_cliente?.trim() || 'Sin nombre',
      cif: cliente.cif_cliente?.trim() || 'Sin CIF',
      cif_empresa: cliente.cif_cliente?.trim() || 'Sin CIF empresa',
      idcliente: cliente.idcliente?.trim() || '',
      facturasPendientes: cliente.numero_facturas || 0,
      montoTotal: parseFloat(cliente.monto_debe) || 0,
      estado: cliente.estado || 'verde',
      consultorAsignado: null
    }))
  }

  const cargarDatos = async () => {
    if (hasLoaded.current) return
    
    hasLoaded.current = true
    
    try {
      setLoading(true)
      setError(null)

      const response = await facturasAPI.getClientesConResumen()
      const clientesData = response.data || []
      const empresasProcesadas = procesarDatosClientes(clientesData)
      
      setEmpresas(empresasProcesadas)
      setDataLoaded(true)
    } catch (err) {
      console.error('Error cargando datos del servidor:', err)
      let errorMessage = 'Error al cargar los datos del servidor.'
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'La solicitud tardó más de 5 minutos en responder. El servidor está procesando un gran volumen de empresas. Intenta nuevamente o contacta al administrador si el problema persiste.'
      } else if (err.code === 'ECONNREFUSED') {
        errorMessage = 'No se puede conectar al backend. Verifica que esté ejecutándose en http://127.0.0.1:8000'
      } else if (err.response) {
        errorMessage = `Error del servidor: ${err.response.status} - ${err.response.statusText}`
      } else if (err.request) {
        errorMessage = 'No se recibió respuesta del servidor. Verifica la URL y el endpoint.'
      } else {
        errorMessage = `Error de conexión: ${err.message}`
      }
      
      setError(errorMessage)
      
      // Usar datos mock cuando la API falle para evitar errores en la UI
      const mockEmpresas = [
        {
          id: 1,
          nombre: 'SELIER BY ATISA SL',
          cif: 'B12345678',
          cif_empresa: 'B12345678',
          idcliente: '001',
          facturasPendientes: 3,
          montoTotal: 15000.00,
          estado: 'verde',
          consultorAsignado: 'Allan Cantos Delgado'
        },
        {
          id: 2,
          nombre: 'EMPRESA EJEMPLO SA',
          cif: 'B87654321',
          cif_empresa: 'B87654321',
          idcliente: '002',
          facturasPendientes: 2,
          montoTotal: 8500.00,
          estado: 'amarillo',
          consultorAsignado: null
        },
        {
          id: 3,
          nombre: 'CLIENTE TEST SL',
          cif: 'B11223344',
          cif_empresa: 'B11223344',
          idcliente: '003',
          facturasPendientes: 1,
          montoTotal: 22000.00,
          estado: 'rojo',
          consultorAsignado: 'María García'
        }
      ]
      
      setEmpresas(mockEmpresas)
      setDataLoaded(true)
    } finally {
      setLoading(false)
    }
  }

  const recargarDatos = () => {
    hasLoaded.current = false
    cargarDatos()
  }

  // Función para guardar consultores en localStorage
  const saveConsultoresToStorage = (newConsultores) => {
    try {
      localStorage.setItem('atisa_consultores', JSON.stringify(newConsultores))
    } catch (error) {
      console.error('Error guardando consultores en localStorage:', error)
    }
  }

  // Función para agregar un nuevo consultor
  const addConsultor = (consultor) => {
    const newConsultor = {
      ...consultor,
      id: Date.now(), // ID único basado en timestamp
      estado: 'activo'
    }
    const updatedConsultores = [...consultores, newConsultor]
    setConsultores(updatedConsultores)
    saveConsultoresToStorage(updatedConsultores)
  }

  // Función para actualizar un consultor existente
  const updateConsultor = (id, updatedData) => {
    const updatedConsultores = consultores.map(consultor =>
      consultor.id === id ? { ...consultor, ...updatedData } : consultor
    )
    setConsultores(updatedConsultores)
    saveConsultoresToStorage(updatedConsultores)
  }

  // Función para eliminar un consultor
  const deleteConsultor = (id) => {
    const updatedConsultores = consultores.filter(consultor => consultor.id !== id)
    setConsultores(updatedConsultores)
    saveConsultoresToStorage(updatedConsultores)
  }

  const getFacturasEmpresa = async (empresaId) => {
    try {
      const response = await facturasAPI.getFacturasCliente(empresaId)
      const facturasData = response.data || []
      
      return facturasData.map(factura => ({
        id: factura.asiento,
        numero: `${factura.tipo}-${factura.asiento}`,
        vencimiento: factura.vencimiento?.split('T')[0] || '',
        monto: parseFloat(factura.importe) || 0,
        estado: factura.estado || (factura.check_pago === 1 ? 'pagado' : 'pendiente'),
        tipo: factura.tipo,
        sociedad: factura.sociedad,
        tercero: factura.tercero,
        forma_pago: factura.forma_pago,
        nivel_reclamacion: factura.nivel_reclamacion,
        fecha_reclamacion: factura.fecha_reclamacion?.split('T')[0] || '',
        check_pago: factura.check_pago,
        moneda: factura.moneda,
        colectivo: factura.colectivo,
        planta: factura.planta,
        pago: factura.pago,
        sentido: factura.sentido
      }))
    } catch (err) {
      console.error('Error cargando facturas de empresa:', err)
      return []
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      cargarDatos()
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const value = {
    empresas,
    consultores,
    loading,
    error,
    dataLoaded,
    recargarDatos,
    getFacturasEmpresa,
    addConsultor,
    updateConsultor,
    deleteConsultor
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
} 