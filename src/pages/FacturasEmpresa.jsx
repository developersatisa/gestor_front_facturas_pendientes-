import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Edit, Trash2, FileText, Bell, Mail, User, Calendar, History } from 'lucide-react'
import Card from '../components/Card'
import SearchBar from '../components/SearchBar'

import FacturaModal from '../components/FacturaModal'
import AsignarConsultorModal from '../components/AsignarConsultorModal'
import ConfirmModal from '../components/ConfirmModal'
import HistorialList from '../components/HistorialList'
import { pagosAPI } from '../services/api'
import { useData } from '../context/DataContext'

const FacturasEmpresa = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { empresas, consultores, getFacturasEmpresa, error, recargarDatos, getHistorialFactura, registrarEventoHistorial, asignarConsultorACliente, getAcciones, registrarAccion } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [sociedadFilter, setSociedadFilter] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState('ambos') // 'ambos' | 'facturas' | 'abonos'
  const [showFacturaModal, setShowFacturaModal] = useState(false)
  const [facturas, setFacturas] = useState([])
  const [loadingFacturas, setLoadingFacturas] = useState(true)
  const [editingFactura, setEditingFactura] = useState(null)
  const [acciones, setAcciones] = useState([])
  const [showAccionForm, setShowAccionForm] = useState({})
  const [editingAccion, setEditingAccion] = useState(null)
  const [accionFormErrors, setAccionFormErrors] = useState({})
  const [accionFormData, setAccionFormData] = useState({
    descripcion: '',
    tipo: 'Email',
    aviso: '',
    usuario: ''
  })
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showAsignarConsultorModal, setShowAsignarConsultorModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [deleteType, setDeleteType] = useState('') // 'factura' o 'accion'
  // Historial de facturas
  const [historialMap, setHistorialMap] = useState({}) // { [facturaId]: eventos[] }
  const [openHistorial, setOpenHistorial] = useState({}) // { [facturaId]: bool }
  const [historialPagoMap, setHistorialPagoMap] = useState({}) // { [facturaId]: pago }
  const [pagadasList, setPagadasList] = useState([])
  const [showPagadas, setShowPagadas] = useState(false)
  const [loadingPagadas, setLoadingPagadas] = useState(false)
  const [showHistorialModal, setShowHistorialModal] = useState(false)
  const [historialMode, setHistorialMode] = useState('pagada') // 'pagada' | 'aplazar'
  const [selectedFactura, setSelectedFactura] = useState(null)
  const [showPagadasModal, setShowPagadasModal] = useState(false)
  const [showHistorialFacturaModal, setShowHistorialFacturaModal] = useState(false)
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null)
  const [historialFacturaEspecifica, setHistorialFacturaEspecifica] = useState([])
  const [loadingHistorialFactura, setLoadingHistorialFactura] = useState(false)

  // Prevenir scroll cuando el modal está abierto
  React.useEffect(() => {
    if (showPagadasModal || showHistorialFacturaModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    // Cleanup: restaurar scroll cuando el componente se desmonta
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showPagadasModal, showHistorialFacturaModal])
  // Helpers visuales para sociedades
  const socEmoji = (code) => (code === 'S005' ? '🟩' : code === 'S001' ? '🟦' : code === 'S010' ? '🟨' : '⚪')
  const socDotCls = (code) => (
    code === 'S005' ? 'bg-teal-500' : code === 'S001' ? 'bg-indigo-500' : code === 'S010' ? 'bg-amber-500' : 'bg-gray-400'
  )
  const [openSocSelect, setOpenSocSelect] = useState(false)
  const socSelectRef = useRef(null)
  useEffect(() => {
    const handler = (e) => {
      if (socSelectRef.current && !socSelectRef.current.contains(e.target)) setOpenSocSelect(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const empresa = empresas.find(e => e.id === id)
  const consultor = empresa ? consultores.find(c => c.nombre === (empresa?.consultorAsignado || '').trim()) : null

  // Cargar facturas cuando se monta el componente
  useEffect(() => {
    const cargarFacturas = async () => {
      if (id && empresas.length > 0) {
        setLoadingFacturas(true)
        try {
          const facturasData = await getFacturasEmpresa(id)
          setFacturas(facturasData)
        } catch (error) {
          console.error('Error cargando facturas:', error)
          setFacturas([])
        } finally {
          setLoadingFacturas(false)
        }
      }
    }
    cargarFacturas()
  }, [id, empresas.length])

  const toggleHistorial = async (factura) => {
    setOpenHistorial(prev => ({ ...prev, [factura.id]: !prev[factura.id] }))
    if (!historialMap[factura.id]) {
      const eventos = await getHistorialFactura({ tercero: factura.tercero, tipo: factura.tipo, asiento: factura.asiento })
      setHistorialMap(prev => ({ ...prev, [factura.id]: eventos }))
    }
    if (!historialPagoMap[factura.id]) {
      try {
        const { data } = await pagosAPI.getHistorialPago({ tipo: String(factura.tipo), asiento: String(factura.asiento), tercero: String(factura.tercero), sociedad: String(factura.sociedad) })
        setHistorialPagoMap(prev => ({ ...prev, [factura.id]: data || null }))
      } catch (e) {
        setHistorialPagoMap(prev => ({ ...prev, [factura.id]: null }))
      }
    }
  }

  const cargarPagadasCliente = async () => {
    setLoadingPagadas(true)
    try {
      // Normalizar el ID del cliente: quitar ceros a la izquierda
      const terceroRaw = empresa?.id || empresa?.idcliente
      const tercero = terceroRaw ? String(parseInt(terceroRaw, 10)) : null
      const { data } = await pagosAPI.listPagadas({ tercero, limit: 200 })
      setPagadasList(Array.isArray(data) ? data : [])
    } catch (e) {
      setPagadasList([])
    } finally {
      setLoadingPagadas(false)
    }
  }

  const cargarHistorialFacturaEspecifica = async (factura) => {
    setLoadingHistorialFactura(true)
    try {
      // Usar el rowid de la factura para buscar en la tabla de pagos
      const { data } = await pagosAPI.listPagadas({ factura_id: factura.id, limit: 200 })
      setHistorialFacturaEspecifica(Array.isArray(data) ? data : [])
    } catch (e) {
      setHistorialFacturaEspecifica([])
    } finally {
      setLoadingHistorialFactura(false)
    }
  }

  const handleVerHistorialFactura = async (factura) => {
    setFacturaSeleccionada(factura)
    setShowHistorialFacturaModal(true)
    await cargarHistorialFacturaEspecifica(factura)
  }

  const handleTogglePagadas = async () => {
    if (pagadasList.length === 0) {
      await cargarPagadasCliente()
    }
    setShowPagadasModal(true)
  }

  const handleMarcarPagada = (factura) => {
    setSelectedFactura(factura)
    setHistorialMode('pagada')
    setShowHistorialModal(true)
  }

  const handleAplazar = (factura) => {
    setSelectedFactura(factura)
    setHistorialMode('aplazar')
    setShowHistorialModal(true)
  }

  const handleSaveHistorialEvento = async (payload) => {
    try {
      const saved = await registrarEventoHistorial(payload)
      if (selectedFactura) {
        setHistorialMap(prev => {
          const current = prev[selectedFactura.id] || []
          return { ...prev, [selectedFactura.id]: [saved, ...current] }
        })
      }
      setShowHistorialModal(false)
      setSelectedFactura(null)
    } catch (e) {
      alert('No se pudo guardar el evento de historial')
    }
  }

  // Cargar acciones desde la API (por empresa)
  useEffect(() => {
    const cargarAcciones = async () => {
      if (!empresa) return
      try {
        const lista = await getAcciones({ idcliente: empresa.id || empresa.idcliente })
        const mapeadas = lista.map(a => {
          const fMatch = facturas.find(f => String(f.tipo) === String(a.tipo) && String(f.asiento) === String(a.asiento))
          return {
            id: a.id,
            fecha: a.creado_en?.split('T')[0] || '',
            autor: a.usuario || 'Usuario',
            tipo: a.accion_tipo,
            descripcion: a.descripcion || '',
            aviso: a.aviso?.split('T')[0] || '',
            facturaId: `${a.tipo}-${a.asiento}`,
            nombre_factura: fMatch?.nombre_factura || null,
          }
        })
        setAcciones(mapeadas)
      } catch (e) {
        console.error('Error cargando acciones:', e)
      }
    }
    cargarAcciones()
  }, [empresa, facturas])

  // Cerrar calendario al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDatePicker && !event.target.closest('.date-picker-container')) {
        setShowDatePicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDatePicker])

  // If global data is still loading, show global loading
  if (empresas.length === 0 && !empresa) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500 mx-auto mb-6">
            <div className="w-8 h-8 text-teal-500 mx-auto mt-4"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Conectando con el servidor</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Cargando datos de clientes desde la base de datos...</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mb-4">Procesando solicitud... Esto puede tardar hasta 5 minutos si hay muchas empresas</p>
          <p className="text-gray-500 dark:text-gray-500 text-xs">El servidor está procesando un gran volumen de datos</p>
          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          
          {/* Barra de progreso simulada */}
          <div className="w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mx-auto">
            <div className="bg-teal-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
          
          <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
            ⏱️ Tiempo máximo de espera: 5 minutos
          </p>
        </div>
      </div>
    )
  }

  if (!empresa) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Empresa no encontrada</h2>
          <p className="text-gray-400 mb-4">La empresa solicitada no existe.</p>
          <button
            onClick={() => navigate('/empresas')}
            className="btn-primary"
          >
            Volver a Empresas
          </button>
        </div>
      </div>
    )
  }

  // Verificar si la empresa tiene consultor asignado
  const hasConsultor = !!((empresa?.consultorAsignado || '').trim() && consultor)

  const facturasFiltradas = facturas.filter(factura => {
    const searchLower = String(searchTerm || '').toLowerCase().trim()

    // Intenta interpretar el término de búsqueda como número en formato ES o EN
    const parseSearchNumber = (s) => {
      if (!s) return null
      let t = String(s).trim().replace(/\s+/g, '')
      // Si hay coma después del último punto, tratamos coma como decimal y punto como separador de miles
      const lastComma = t.lastIndexOf(',')
      const lastDot = t.lastIndexOf('.')
      if (lastComma !== -1 && lastComma > lastDot) {
        t = t.replace(/\./g, '').replace(',', '.')
      } else {
        // Estilo EN: quitar comas de miles
        t = t.replace(/,/g, '')
      }
      const n = Number(t)
      return Number.isFinite(n) ? n : null
    }

    const formatNumberEs = (n) => {
      try {
        return new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n) || 0)
      } catch {
        return String(n ?? '')
      }
    }

    const searchNum = parseSearchNumber(searchTerm)

    const numeroStr = String(factura.numero || '').toLowerCase()
    const nombreFacturaStr = String(factura.nombre_factura || '').toLowerCase()
    const sociedadStr = String(factura.sociedad || '').toLowerCase()

    const montoNum = Number(factura.monto) || 0
    const pagoNum = Number(factura.pago) || 0
    const pendienteNum = typeof factura.pendiente === 'number' ? Number(factura.pendiente) : Math.max(0, montoNum - pagoNum)

    const montoStr = String(montoNum)
    const pendienteStr = String(pendienteNum)

    const montoEs = formatNumberEs(montoNum) // ej: 33.209,66
    const pendienteEs = formatNumberEs(pendienteNum)

    const epsilon = 0.005 // tolerancia para comparación a 2 decimales

    const matchSearch = (
      // Coincidencias por texto
      (searchLower.length === 0) ||
      numeroStr.includes(searchLower) ||
      nombreFacturaStr.includes(searchLower) ||
      sociedadStr.includes(searchLower) ||
      montoStr.includes(searchLower) ||
      pendienteStr.includes(searchLower) ||
      montoEs.includes(searchTerm) ||
      pendienteEs.includes(searchTerm) ||
      // Coincidencias numéricas exactas (a 2 decimales)
      (searchNum !== null && (
        Math.abs(montoNum - searchNum) < epsilon ||
        Math.abs(pendienteNum - searchNum) < epsilon ||
        Math.abs(pagoNum - searchNum) < epsilon
      ))
    )

    const matchSociedad = !sociedadFilter || factura.sociedad === sociedadFilter
    return matchSearch && matchSociedad
  })

  // Separar abonos: FLGCLE_0 = -1 (check_pago) o SNS_0 = -1, o importe negativo
  const esAbono = (f) => Number(f.check_pago) === -1 || Number(f.sentido) === -1 || Number(f.monto) < 0
  const abonos = facturasFiltradas.filter(esAbono)
  const facturasPend = facturasFiltradas.filter(f => !esAbono(f))

  // Totales: suma de pendiente de facturas menos abonos
  const totalPendienteFacturas = facturasPend.reduce((sum, f) => {
    const importe = Number(f.monto) || 0
    const pago = Number(f.pago) || 0
    const pendiente = typeof f.pendiente === 'number' ? Number(f.pendiente) : (importe - pago)
    return sum + Math.max(0, pendiente)
  }, 0)
  const totalAbonos = abonos.reduce((sum, a) => sum + Math.abs(Number(a.monto) || 0), 0)
  const totalPendienteReal = totalPendienteFacturas - totalAbonos

  // Resumen de sociedades presentes (independiente del filtro actual)
  const sociedadesResumenAll = React.useMemo(() => {
    const map = new Map()
    // Usar todas las facturas no-abono sin aplicar sociedadFilter para que el select no se "encoja"
    for (const f of facturas) {
      const esAb = Number(f.check_pago) === -1 || Number(f.sentido) === -1 || Number(f.monto) < 0
      if (esAb) continue
      const codigo = (f?.sociedad || '').trim() || 'N/D'
      const nombre = (f?.sociedad_nombre || f?.sociedad || 'N/D').toString()
      const importe = Number(f?.monto) || 0
      const pago = Number(f?.pago) || 0
      const pendiente = typeof f?.pendiente === 'number' ? Number(f.pendiente) : Math.max(0, importe - pago)
      const prev = map.get(codigo) || { codigo, nombre, cantidad: 0, pendiente: 0 }
      prev.cantidad += 1
      prev.pendiente += pendiente
      map.set(codigo, prev)
    }
    return Array.from(map.values()).sort((a, b) => b.pendiente - a.pendiente)
  }, [facturas])

  const handleAddFactura = () => {
    if (!hasConsultor) {
      alert('No se puede añadir facturas sin un consultor asignado.')
      return
    }
    setEditingFactura(null)
    setShowFacturaModal(true)
  }

  const handleEditFactura = (factura) => {
    setEditingFactura(factura)
    setShowFacturaModal(true)
  }

  const handleDeleteFactura = (factura) => {
    setItemToDelete(factura)
    setDeleteType('factura')
    setShowConfirmModal(true)
  }

  const confirmDeleteFactura = () => {
    if (itemToDelete && deleteType === 'factura') {
      setFacturas(facturas.filter(f => f.id !== itemToDelete.id))
      setItemToDelete(null)
      setDeleteType('')
    }
  }

  const handleAddAccion = (facturaId) => {
    // Para pruebas, permitir añadir acciones sin consultor
    // if (!consultor) {
    //   alert('No se puede añadir acciones sin un consultor asignado.')
    //   return
    // }
    setShowAccionForm(prev => ({ ...prev, [facturaId]: true }))
    setEditingAccion(null)
    const defaultUsuario = (consultor?.nombre) || (Array.isArray(consultores) && consultores.length > 0 ? (consultores[0]?.nombre || 'Usuario') : 'Usuario')
    setAccionFormData(prev => ({ ...prev, usuario: defaultUsuario }))
    setAccionFormErrors(prev => ({ ...prev, [facturaId]: '' }))
  }

  const handleSaveFactura = (facturaData) => {
    if (editingFactura) {
      setFacturas(facturas.map(f => f.id === editingFactura.id ? { ...f, ...facturaData } : f))
    } else {
      const newFactura = {
        id: Date.now(),
        ...facturaData
      }
      setFacturas([...facturas, newFactura])
    }
    setShowFacturaModal(false)
  }

  const handleSaveAccion = (accionData, facturaId) => {
    if (editingAccion) {
      // Editar acción existente
      setAcciones(acciones.map(accion => 
        accion.id === editingAccion.id 
          ? { ...accion, ...accionData }
          : accion
      ))
    } else {
      // Crear nueva acción
      const newAccion = {
        id: Date.now(),
        ...accionData,
        facturaId: facturaId
      }
      setAcciones([...acciones, newAccion])
    }
    
    setShowAccionForm(prev => ({ ...prev, [facturaId]: false }))
    setEditingAccion(null)
  }

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(valor)
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return ''
    return new Date(fecha).toLocaleDateString('es-ES')
  }

  const getAccionesFactura = (facturaId) => {
    return acciones.filter(accion => accion.facturaId === facturaId)
  }

  const handleEditAccion = (accion, facturaId) => {
    setEditingAccion(accion)
    setAccionFormData({
      descripcion: accion.descripcion || '',
      tipo: accion.tipo || 'Email',
      aviso: accion.aviso || ''
    })
    setShowAccionForm(prev => ({ ...prev, [facturaId]: true }))
  }

  const handleDeleteAccion = (accion) => {
    setItemToDelete(accion)
    setDeleteType('accion')
    setShowConfirmModal(true)
  }

  const confirmDeleteAccion = () => {
    if (itemToDelete && deleteType === 'accion') {
      setAcciones(acciones.filter(accion => accion.id !== itemToDelete.id))
      setItemToDelete(null)
      setDeleteType('')
    }
  }

  const handleCancelAccion = (facturaId) => {
    setShowAccionForm(prev => ({ ...prev, [facturaId]: false }))
    setEditingAccion(null)
    setAccionFormData({
      descripcion: '',
      tipo: 'Email',
      aviso: ''
    })
  }

  const handleAccionFormChange = (e) => {
    const { name, value } = e.target
    setAccionFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAccionFormSubmit = (e, facturaId) => {
    e.preventDefault()
    if (!accionFormData.descripcion.trim()) {
      setAccionFormErrors(prev => ({ ...prev, [facturaId]: 'La descripción de la acción es obligatoria.' }))
      return
    }
    if (!accionFormData.aviso) {
      setAccionFormErrors(prev => ({ ...prev, [facturaId]: 'Selecciona una fecha de aviso (obligatoria).' }))
      return
    }

    const [tipoFactura, asientoFactura] = String(facturaId).split('-')
    const payload = {
      idcliente: parseInt(empresa?.id || empresa?.idcliente || '0', 10) || undefined,
      tercero: empresa?.idcliente || empresa?.id || '',
      tipo: tipoFactura || '',
      asiento: asientoFactura || '',
      accion_tipo: accionFormData.tipo || 'Otro',
      descripcion: accionFormData.descripcion,
      aviso: accionFormData.aviso,
      usuario: (accionFormData.usuario && accionFormData.usuario.trim()) || consultor?.nombre || 'Usuario',
    }
    registrarAccion(payload)
      .then(() => getAcciones({ idcliente: payload.idcliente }))
      .then((lista) => {
        const mapeadas = lista.map(a => ({
          id: a.id,
          fecha: a.creado_en?.split('T')[0] || '',
          autor: a.usuario || 'Usuario',
          tipo: a.accion_tipo,
          descripcion: a.descripcion || '',
          aviso: a.aviso?.split('T')[0] || '',
          facturaId: `${a.tipo}-${a.asiento}`,
        }))
        setAcciones(mapeadas)
        handleCancelAccion(facturaId)
      })
      .catch(() => alert('No se pudo registrar la acción'))
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const handleDateSelect = (day) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    // Formatear a YYYY-MM-DD en horario local para evitar desfases por zona horaria
    const y = selectedDate.getFullYear()
    const m = String(selectedDate.getMonth() + 1).padStart(2, '0')
    const d = String(selectedDate.getDate()).padStart(2, '0')
    const formattedDate = `${y}-${m}-${d}`
    setAccionFormData(prev => ({ ...prev, aviso: formattedDate }))
    setShowDatePicker(false)
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
  }

  const handleAsignarConsultor = async (consultorId) => {
    try {
      const idcliente = empresa?.id || empresa?.idcliente || id
      await asignarConsultorACliente(idcliente, consultorId)
    } finally {
      setShowAsignarConsultorModal(false)
    }
  }

  // Verificación de seguridad: si no hay empresa, mostrar loading o error
  if (!empresa && !loadingFacturas) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando información de la empresa...</p>
        </div>
      </div>
    )
  }

  if (!empresa) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🏢</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Empresa no encontrada
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No se pudo encontrar la empresa con ID: {id}
          </p>
          <button
            onClick={() => navigate('/empresas')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Volver a Empresas
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          {/* Notificación de error de conexión */}
          {error && (
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h3 className="text-white font-medium">Modo Offline</h3>
                    <p className="text-yellow-300 text-sm">{error}</p>
                  </div>
                </div>
                <button
                  onClick={recargarDatos}
                  className="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {/* Advertencia si no hay consultor asignado */}
          {!hasConsultor && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h3 className="text-white font-medium">Consultor no asignado</h3>
                    <p className="text-red-300 text-sm">Es recomendable asignar un consultor para gestionar las facturas</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAsignarConsultorModal(true)}
                  className="btn-primary text-sm"
                >
                  Asignar Consultor
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate('/empresas')}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{empresa.nombre}</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Consultor Asignado: {consultor ? (
                  <span className="text-teal-600 dark:text-teal-400">{consultor.nombre}</span>
                ) : (
                  <span className="text-gray-500">Sin asignar</span>
                )}
              </p>
            </div>
            {false && (
            <div className="ml-auto">
              <button
                onClick={handleAddFactura}
                className={`flex items-center space-x-2 ${
                  hasConsultor 
                    ? 'btn-primary' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200'
                }`}
                title={!hasConsultor ? 'Necesitas un consultor asignado para añadir facturas' : ''}
              >
                <Plus size={20} />
                <span>Añadir Factura</span>
              </button>
            </div>
            )}
          </div>
          
          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar
              placeholder="Buscar por numero de factura o importe..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
            {/* Selector de sociedades (se reubica junto al toggle inferior) */}
            {/* Toggle tipo + Select sociedades + Ver pagadas en una sola fila */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
                <button
                  type="button"
                  className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                    tipoFiltro === 'ambos'
                      ? 'bg-[#0A5C63] text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setTipoFiltro('ambos')}
                >
                  Ambos
                </button>
                <button
                  type="button"
                  className={`px-4 py-1.5 text-sm font-medium border-l border-gray-300 dark:border-gray-700 transition-colors ${
                    tipoFiltro === 'facturas'
                      ? 'bg-[#0A5C63] text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setTipoFiltro('facturas')}
                >
                  Solo facturas
                </button>
                <button
                  type="button"
                  className={`px-4 py-1.5 text-sm font-medium border-l border-gray-300 dark:border-gray-700 transition-colors ${
                    tipoFiltro === 'abonos'
                      ? 'bg-[#0A5C63] text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setTipoFiltro('abonos')}
                >
                  Solo abonos
                </button>
              </div>
              {/* Derecha: Select de sociedades + botón Ver pagadas */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Select moderno de sociedades (custom dropdown para no truncar) */}
                <div ref={socSelectRef} className="relative w-full sm:w-[28rem]">
                  <button
                    type="button"
                    onClick={() => setOpenSocSelect((v) => !v)}
                    className="w-full flex items-center justify-between gap-3 pl-8 pr-9 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-750 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    aria-haspopup="listbox"
                    aria-expanded={openSocSelect}
                  >
                    <span className={`absolute left-3 inline-block w-2.5 h-2.5 rounded-full ${sociedadFilter ? socDotCls(sociedadFilter) : 'bg-gray-400'}`}></span>
                    <span className="flex-1 whitespace-normal break-words">
                      {(() => {
                        const s = sociedadesResumenAll.find(x => x.codigo === sociedadFilter)
                        return s
                          ? `${s.codigo} — ${s.nombre || s.codigo} · ${formatearMoneda(s.pendiente)} · ${s.cantidad} facs`
                          : 'Todas las sociedades'
                      })()}
                    </span>
                    <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {openSocSelect && (
                    <ul
                      role="listbox"
                      className="absolute z-10 mt-2 w-full max-h-64 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg"
                    >
                      <li
                        role="option"
                        aria-selected={sociedadFilter === ''}
                        onClick={() => { setSociedadFilter(''); setOpenSocSelect(false) }}
                        className={`cursor-pointer px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${sociedadFilter === '' ? 'bg-gray-50 dark:bg-gray-700/50' : ''}`}
                      >
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-gray-400"></span>
                        <span className="whitespace-normal break-words">Todas las sociedades</span>
                      </li>
                      {sociedadesResumenAll.map((s) => (
                        <li
                          key={s.codigo}
                          role="option"
                          aria-selected={sociedadFilter === s.codigo}
                          onClick={() => { setSociedadFilter(s.codigo); setOpenSocSelect(false) }}
                          className={`cursor-pointer px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${sociedadFilter === s.codigo ? 'bg-gray-50 dark:bg-gray-700/50' : ''}`}
                        >
                          <span className={`inline-block w-2.5 h-2.5 rounded-full ${socDotCls(s.codigo)}`}></span>
                          <span className="flex-1 whitespace-normal break-words">
                            {`${s.codigo} — ${s.nombre || s.codigo} · ${formatearMoneda(s.pendiente)} · ${s.cantidad} facs`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleTogglePagadas}
                  className="px-4 py-1.5 text-sm font-medium rounded-lg transition-colors bg-teal-600 hover:bg-teal-700 text-white"
                  disabled={loadingPagadas}
                  title="Ver facturas pagadas fuera de plazo"
                >
                  {loadingPagadas ? 'Cargando…' : 'Ver pagadas'}
                </button>
              </div>
            </div>
          </div>
          {/* Resumen de totales */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Pendiente facturas</div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white">{formatearMoneda(totalPendienteFacturas)}</div>
            </div>
            <div className="rounded-lg p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Abonos</div>
              <div className="text-xl font-semibold text-amber-600">{formatearMoneda(totalAbonos)}</div>
            </div>
            <div className="rounded-lg p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Total neto</div>
              <div className={`text-xl font-bold ${totalPendienteReal >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-500'}`}>{formatearMoneda(totalPendienteReal)}</div>
            </div>
          </div>

          {/* (El box de sociedades se ha eliminado, la info se muestra en el select) */}
        </div>

        {/* Facturas List */}
        {tipoFiltro !== 'abonos' && (
        <div className="space-y-6">
          {loadingFacturas ? (
            <Card>
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Cargando facturas...</p>
              </div>
            </Card>
          ) : facturasPend.length > 0 ? (
            facturasPend.map(factura => (
              <Card key={factura.id} className="p-6">
                <div className="flex justify-between items-start">
                  {/* Left side - Invoice details */}
                  <div className="flex-1">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Factura #{factura.numero}</h3>
                      {factura.nombre_factura && (
                        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{factura.nombre_factura}</p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          factura.sociedad === 'S005' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-100' :
                          factura.sociedad === 'S001' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-100' :
                          factura.sociedad === 'S010' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100' :
                          'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {factura.sociedad_nombre || factura.sociedad || 'Sociedad'}
                        </span>
                        <button
                          className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-md bg-[#0A5C63] hover:bg-[#A4C63B] text-white transition-colors text-xs"
                          onClick={() => handleVerHistorialFactura(factura)}
                          title="Ver historial de pagos de esta factura"
                        >
                          <History className="w-3.5 h-3.5" />
                          <span>Historial</span>
                        </button>
                      </div>
                      {/* Montos compactos debajo del encabezado */}
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <div className="text-gray-600 dark:text-gray-300">
                          <span className="text-xs uppercase tracking-wide">Importe</span>{' '}
                          <span className="font-semibold text-gray-900 dark:text-white">{formatearMoneda(factura.monto)}</span>
                        </div>
                        {Number(factura.pago) > 0 && (
                          <>
                            <div className="text-gray-600 dark:text-gray-300">
                              <span className="text-xs uppercase tracking-wide">Pagado</span>{' '}
                              <span className="font-semibold text-emerald-600">{formatearMoneda(factura.pago)}</span>
                            </div>
                            <div className="text-gray-600 dark:text-gray-300">
                              <span className="text-xs uppercase tracking-wide">Pendiente</span>{' '}
                              <span className="font-bold text-red-500">{formatearMoneda(factura.pendiente)}</span>
                            </div>
                          </>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Vencimiento: {formatearFecha(factura.vencimiento)}
                      </p>
                    </div>

                    {/* Action Tracking */}
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Seguimiento de Acciones:
                      </h4>
                      
                      {/* Mostrar acciones existentes */}
                      {getAccionesFactura(factura.numero).length > 0 ? (
                        <div className="space-y-3 mb-4">
                          {getAccionesFactura(factura.numero).map(accion => (
                            <div key={accion.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                  <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                  <span className="text-gray-900 dark:text-white text-sm">
                                    {formatearFecha(accion.fecha)} — {accion.autor} ({accion.tipo}){accion.nombre_factura ? ` — ${accion.nombre_factura}` : ''}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleEditAccion(accion, factura.numero)}
                                    className="p-1 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 transition-colors"
                                    title="Editar acción"
                                  >
                                    <Edit className="w-3 h-3 text-gray-600 dark:text-white" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAccion(accion)}
                                    className="p-1 rounded bg-red-600 hover:bg-red-500 transition-colors"
                                    title="Eliminar acción"
                                  >
                                    <Trash2 className="w-3 h-3 text-white" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                                {accion.descripcion}
                              </p>
                              {accion.aviso && (
                                <div className="flex items-center space-x-2">
                                  <Bell className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                  <span className="text-green-600 dark:text-green-400 text-sm">
                                    Aviso para el: {formatearFecha(accion.aviso)}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic mb-4">No hay acciones registradas.</p>
                      )}

                      {/* Formulario de acción */}
                      {showAccionForm[factura.numero] ? (
                        <div className="bg-gray-100 dark:bg-[#1f2937] rounded-xl border border-gray-200 dark:border-gray-700 p-6 mt-4">
                          <form noValidate onSubmit={(e) => handleAccionFormSubmit(e, factura.numero)} className="space-y-6">
                            {/* Usuario que registra la acción (select de consultores) */}
                            <div className="bg-gray-200 dark:bg-[#374151] rounded-lg p-4">
                              <div className="flex items-center space-x-3 mb-2">
                                <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">Acción registrada por:</span>
                              </div>
                              <select
                                name="usuario"
                                value={accionFormData.usuario || consultor?.nombre || 'Usuario'}
                                onChange={handleAccionFormChange}
                                className="w-full bg-white dark:bg-[#1f2937] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                                title="Selecciona el usuario que registra la acción"
                              >
                                {(() => {
                                  const assigned = consultor?.nombre || null
                                  const names = []
                                  if (assigned) names.push(assigned)
                                  if (Array.isArray(consultores)) {
                                    for (const c of consultores) {
                                      const n = c?.nombre
                                      if (n && n !== assigned) names.push(n)
                                    }
                                  }
                                  if (names.length === 0) names.push('Usuario')
                                  return names.map(n => (
                                    <option key={n} value={n}>{n}{assigned === n ? ' (asignado)' : ''}</option>
                                  ))
                                })()}
                              </select>
                              <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1">Por defecto, el consultor asignado. Puedes cambiarlo.</p>
                            </div>

                            {/* Descripción de la acción */}
                            <div>
                              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                                Descripción de la acción
                              </label>
                              <textarea
                                name="descripcion"
                                value={accionFormData.descripcion}
                                onChange={handleAccionFormChange}
                                rows={4}
                                className="w-full bg-white dark:bg-[#374151] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                                placeholder="Describe la acción realizada..."
                              />
                            </div>

                            {/* Tipo de acción */}
                            <div>
                              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                                Tipo de acción
                              </label>
                              <select
                                name="tipo"
                                value={accionFormData.tipo}
                                onChange={handleAccionFormChange}
                                className="w-full bg-white dark:bg-[#374151] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer"
                              >
                                <option value="Email">📧 Email</option>
                                <option value="Llamada">📞 Llamada</option>
                                <option value="TEAMS">💬 TEAMS</option>
                              </select>
                            </div>

                            {/* Fecha de aviso (obligatoria) */}
                            <div>
                              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                                Fecha de aviso
                              </label>
                              <div className="relative date-picker-container">
                                <button
                                  type="button"
                                  onClick={() => setShowDatePicker(!showDatePicker)}
                                  className="w-full bg-white dark:bg-[#374151] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 text-left flex items-center justify-between"
                                >
                                  <div className="flex items-center">
                                    <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400 mr-3" />
                                    <span className={accionFormData.aviso ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                                      {accionFormData.aviso ? formatDate(new Date(accionFormData.aviso)) : 'Seleccionar fecha'}
                                    </span>
                                  </div>
                                  {accionFormData.aviso && (
                                    <div className="w-2 h-2 bg-teal-600 dark:bg-teal-400 rounded-full animate-pulse"></div>
                                  )}
                                </button>
                                
                                {/* Calendario personalizado */}
                                {showDatePicker && (
                                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-50 p-4">
                                    {/* Header con navegación */}
                                    <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center space-x-2">
                                        <button
                                          onClick={goToPreviousMonth}
                                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                          title="Mes anterior"
                                        >
                                          ‹
                                        </button>
                                        <h3 className="text-gray-900 dark:text-white font-medium min-w-[120px] text-center">
                                          {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                                        </h3>
                                        <button
                                          onClick={goToNextMonth}
                                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                          title="Mes siguiente"
                                        >
                                          ›
                                        </button>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <button
                                          onClick={goToToday}
                                          className="text-xs bg-teal-600 hover:bg-teal-500 text-white px-2 py-1 rounded transition-colors"
                                        >
                                          Hoy
                                        </button>
                                        <button
                                          onClick={() => setShowDatePicker(false)}
                                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors p-1"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    </div>
                                    
                                    {/* Días de la semana */}
                                    <div className="grid grid-cols-7 gap-1 mb-2">
                                      {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                                        <div key={day} className="text-center text-xs text-gray-500 dark:text-gray-400 font-medium py-2">
                                          {day}
                                        </div>
                                      ))}
                                    </div>
                                    
                                    {/* Días del mes */}
                                    <div className="grid grid-cols-7 gap-1">
                                      {Array.from({ length: getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth()) }, (_, i) => (
                                        <div key={`empty-${i}`} className="h-8"></div>
                                      ))}
                                      {Array.from({ length: getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth()) }, (_, i) => {
                                        const day = i + 1
                                        const currentDate = new Date()
                                        const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                                        const isToday = dayDate.toDateString() === currentDate.toDateString()
                                        const isSelected = accionFormData.aviso && new Date(accionFormData.aviso).toDateString() === dayDate.toDateString()
                                        const isPast = dayDate < new Date(currentDate.setHours(0, 0, 0, 0))
                                        
                                        return (
                                          <button
                                            key={day}
                                            onClick={() => handleDateSelect(day)}
                                            disabled={isPast}
                                            className={`h-8 rounded-md text-sm font-medium transition-colors ${
                                              isSelected
                                                ? 'bg-teal-500 text-white'
                                                : isToday
                                                ? 'bg-teal-100 text-teal-900 dark:bg-teal-900 dark:text-teal-100'
                                                : isPast
                                                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                                : 'text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                          >
                                            {day}
                                          </button>
                                        )
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-gray-500">Campo obligatorio</p>
                                {accionFormData.aviso && (
                                  <span className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                                    ✓ Aviso configurado
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Mensajes de error bonitos */}
                            {accionFormErrors[factura.numero] && (
                              <div className="mt-2 p-3 rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700 flex items-start gap-2">
                                <svg className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l6.518 11.59c.75 1.336-.213 2.99-1.742 2.99H3.48c-1.53 0-2.492-1.654-1.743-2.99L8.257 3.1zM11 14a1 1 0 10-2 0 1 1 0 002 0zm-.25-6.75a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-red-700 dark:text-red-300">{accionFormErrors[factura.numero]}</p>
                              </div>
                            )}

                            {/* Botones */}
                            <div className="flex space-x-3 pt-4">
                              <button
                                type="button"
                                onClick={() => handleCancelAccion(factura.numero)}
                                className="flex-1 btn-secondary"
                              >
                                Cancelar
                              </button>
                              <button
                                type="submit"
                                className="flex-1 btn-primary"
                              >
                                {editingAccion ? 'Actualizar Acción' : 'Guardar Acción'}
                              </button>
                            </div>
                          </form>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddAccion(factura.numero)}
                          className="text-sm inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-green-600 transition-colors"
                        >
                          Añadir Acción
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right side - Actions (editar/eliminar factura deshabilitados) */}
                  <div className="flex items-center space-x-4 ml-6" />
                </div>
                {openHistorial[factura.id] && (
                  <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                    {/* Historial de pago (tabla externa) */}
                    {historialPagoMap[factura.id] ? (
                      <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
                        <p className="text-sm text-green-800 dark:text-green-300">
                          Vencida desde: <span className="font-semibold">{formatearFecha(historialPagoMap[factura.id].vencimiento)}</span>
                          {` · `}Pagada el: <span className="font-semibold">{formatearFecha(historialPagoMap[factura.id].fecha_pago)}</span>
                          {` · `}Días de retraso: <span className="font-semibold">{historialPagoMap[factura.id].dias_retraso ?? Math.max(0, Math.ceil((new Date(historialPagoMap[factura.id].fecha_pago) - new Date(historialPagoMap[factura.id].vencimiento)) / (1000*60*60*24)))}</span>
                        </p>
                      </div>
                    ) : (
                      <div className="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-700 dark:text-gray-300">No hay registro de pago para esta factura.</p>
                      </div>
                    )}
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Historial de la factura</h4>
                    <HistorialList eventos={historialMap[factura.id]} />
                  </div>
                )}
              </Card>
            ))
          ) : (
            <Card>
              <div className="text-center py-8">
                <FileText className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400">No hay facturas que coincidan con el filtro.</p>
              </div>
            </Card>
          )}
        </div>
        )}

          {/* Sección de abonos */}
          {tipoFiltro !== 'facturas' && ( abonos.length > 0 ? (
            <div className="mt-10">
              <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-400 mb-4">Abonos (facturas de abono)</h3>
              <div className="space-y-6">
                {abonos.map(factura => (
                  <Card key={`abono-${factura.id}`} className="p-6 border border-amber-300 dark:border-amber-700">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="mb-2">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Factura #{factura.numero}</h4>
                          {factura.nombre_factura && (
                            <p className="text-sm text-gray-700 dark:text-gray-300">{factura.nombre_factura}</p>
                          )}
                          <span className="mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Abono</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">Vencimiento: {formatearFecha(factura.vencimiento)}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Importe (abono)</div>
                        <div className="text-base font-bold text-amber-600">{formatearMoneda(factura.monto)}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No hay abonos que coincidan con el filtro.</p>
              </div>
            </Card>
          ))}

        {/* Modals */}
        {/* Edición/creación de factura deshabilitada */}

        {/* Modal de Asignar Consultor */}
        {showAsignarConsultorModal && (
          <AsignarConsultorModal
            empresa={empresa}
            consultores={consultores}
            onClose={() => setShowAsignarConsultorModal(false)}
            onSave={handleAsignarConsultor}
          />
        )}

        {/* Modal de Confirmación */}
        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => {
            setShowConfirmModal(false)
            setItemToDelete(null)
            setDeleteType('')
          }}
          onConfirm={() => {
            if (deleteType === 'factura') {
              confirmDeleteFactura()
            } else if (deleteType === 'accion') {
              confirmDeleteAccion()
            }
          }}
          title={deleteType === 'factura' ? 'Eliminar Factura' : 'Eliminar Acción'}
          message={
            deleteType === 'factura' 
              ? '¿Está seguro de que desea eliminar esta factura? Esta acción no se puede deshacer.'
              : '¿Está seguro de que desea eliminar esta acción? Esta acción no se puede deshacer.'
          }
          type="danger"
          entityType={deleteType}
          entityName={
            deleteType === 'factura' 
              ? itemToDelete?.numero 
              : itemToDelete?.descripcion?.substring(0, 30) + '...'
          }
        />

        {/* Modal de facturas pagadas fuera de plazo */}
        {showPagadasModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPagadasModal(false)}
          >
            <div 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header del modal */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Historial de Pagos</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {pagadasList.length} registro(s)
                  </span>
                  <button
                    onClick={() => setShowPagadasModal(false)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    <span className="text-gray-500 dark:text-gray-400 text-lg">×</span>
                  </button>
                </div>
              </div>

              {/* Contenido del modal */}
              <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
                {loadingPagadas ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
                    <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando...</span>
                  </div>
                ) : pagadasList.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">✅</div>
                    <p className="text-gray-600 dark:text-gray-400">No hay pagos registrados</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pagadasList.map((factura, idx) => (
                      <div key={`${factura.factura_id || factura.tipo + '-' + factura.asiento}-${idx}`} 
                           className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                        
                        {/* Header compacto */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {factura.factura_id || `${factura.tipo}-${factura.asiento}`}
                            </span>
                            <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs text-gray-600 dark:text-gray-300">
                              {factura.sociedad || 'Sin sociedad'}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {formatearMoneda(factura.total_pagado || 0)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Pagado</div>
                          </div>
                        </div>
                        
                        {/* Información de importes */}
                        <div className="grid grid-cols-3 gap-3 text-xs mb-2">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Total:</span>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {formatearMoneda(factura.importe_total || 0)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Pagado:</span>
                            <div className="font-medium text-green-600 dark:text-green-400">
                              {formatearMoneda(factura.total_pagado || 0)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Pendiente:</span>
                            <div className="font-medium text-red-600 dark:text-red-400">
                              {formatearMoneda(factura.importe_pendiente || 0)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Información de fechas */}
                        <div className="grid grid-cols-3 gap-3 text-xs">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Vencimiento:</span>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {formatearFecha(factura.vencimiento) || 'N/A'}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Último Pago:</span>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {factura.pagos && factura.pagos.length > 0 
                                ? formatearFecha(factura.pagos[factura.pagos.length - 1].fecha_pago) 
                                : 'N/A'}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Retraso:</span>
                            <div className={`font-medium ${factura.dias_retraso > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                              {factura.dias_retraso != null ? `${factura.dias_retraso} días` : 'N/A'}
                            </div>
                          </div>
                        </div>
                        
                        {/* Lista de pagos si hay múltiples */}
                        {factura.pagos && factura.pagos.length > 1 && (
                          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                              Pagos realizados ({factura.pagos.length}):
                            </div>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {factura.pagos.map((pago, pIdx) => (
                                <div key={pIdx} className="flex justify-between items-center text-xs bg-gray-100 dark:bg-gray-600 rounded px-2 py-1">
                                  <span className="text-gray-600 dark:text-gray-300">
                                    {formatearFecha(pago.fecha_pago)}
                                  </span>
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {formatearMoneda(pago.monto_pagado || 0)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal de historial específico de factura */}
        {showHistorialFacturaModal && facturaSeleccionada && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowHistorialFacturaModal(false)}
          >
            <div 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header del modal */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Historial de Pagos - Factura {facturaSeleccionada.numero}
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {historialFacturaEspecifica.length} registro(s)
                  </span>
                  <button
                    onClick={() => setShowHistorialFacturaModal(false)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    <span className="text-gray-500 dark:text-gray-400 text-lg">×</span>
                  </button>
                </div>
              </div>

              {/* Contenido del modal */}
              <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
                {loadingHistorialFactura ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
                    <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando...</span>
                  </div>
                ) : historialFacturaEspecifica.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📄</div>
                    <p className="text-gray-600 dark:text-gray-400">No hay pagos registrados para esta factura</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Información general de la factura */}
                    {historialFacturaEspecifica.length > 0 && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 p-4 mb-4">
                        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                          Información de la Factura
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-blue-700 dark:text-blue-300 font-medium">Importe Total:</span>
                            <div className="text-blue-900 dark:text-blue-100 font-semibold">
                              {formatearMoneda(historialFacturaEspecifica[0].importe_total || 0)}
                            </div>
                          </div>
                          <div>
                            <span className="text-blue-700 dark:text-blue-300 font-medium">Vencimiento:</span>
                            <div className="text-blue-900 dark:text-blue-100 font-semibold">
                              {formatearFecha(historialFacturaEspecifica[0].vencimiento) || 'N/A'}
                            </div>
                          </div>
                          <div>
                            <span className="text-blue-700 dark:text-blue-300 font-medium">Total Pagado:</span>
                            <div className="text-green-600 dark:text-green-400 font-semibold">
                              {formatearMoneda(historialFacturaEspecifica[0].total_pagado || 0)}
                            </div>
                          </div>
                          <div>
                            <span className="text-blue-700 dark:text-blue-300 font-medium">Pendiente:</span>
                            <div className="text-red-600 dark:text-red-400 font-semibold">
                              {formatearMoneda(historialFacturaEspecifica[0].importe_pendiente || 0)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Lista de pagos individuales */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Pagos Realizados ({historialFacturaEspecifica.length > 0 ? historialFacturaEspecifica[0].pagos?.length || 0 : 0})
                      </h3>
                      {historialFacturaEspecifica.length > 0 && historialFacturaEspecifica[0].pagos ? (
                        historialFacturaEspecifica[0].pagos.map((pago, idx) => (
                          <div key={`pago-${idx}`} 
                               className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                            
                            {/* Header del pago */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                  <span className="text-blue-600 dark:text-blue-300 font-semibold text-sm">
                                    {idx + 1}
                                  </span>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    Pago #{idx + 1}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatearFecha(pago.fecha_pago) || 'Fecha no disponible'}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                  {formatearMoneda(pago.monto_pagado || 0)}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Importe Pagado</div>
                              </div>
                            </div>
                            
                            {/* Información adicional */}
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">Fecha de Pago:</span>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {formatearFecha(pago.fecha_pago) || 'N/A'}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">Días de Retraso:</span>
                                <div className={`font-medium ${historialFacturaEspecifica[0].dias_retraso > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                  {historialFacturaEspecifica[0].dias_retraso !== null ? `${historialFacturaEspecifica[0].dias_retraso} días` : 'N/A'}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                          No hay pagos registrados para esta factura
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
      {/* Historial modal eliminado: funcionalidad de pagada/aplazar desactivada */}
    </div>
  )
}

export default FacturasEmpresa 


