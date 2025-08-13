import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Edit, Trash2, FileText, Bell, Mail, User, Calendar } from 'lucide-react'
import Card from '../components/Card'
import SearchBar from '../components/SearchBar'

import FacturaModal from '../components/FacturaModal'
import AsignarConsultorModal from '../components/AsignarConsultorModal'
import ConfirmModal from '../components/ConfirmModal'
import { useData } from '../context/DataContext'

const FacturasEmpresa = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { empresas, consultores, getFacturasEmpresa, error, recargarDatos } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [showFacturaModal, setShowFacturaModal] = useState(false)
  const [facturas, setFacturas] = useState([])
  const [loadingFacturas, setLoadingFacturas] = useState(true)
  const [editingFactura, setEditingFactura] = useState(null)
  const [acciones, setAcciones] = useState([])
  const [showAccionForm, setShowAccionForm] = useState({})
  const [editingAccion, setEditingAccion] = useState(null)
  const [accionFormData, setAccionFormData] = useState({
    descripcion: '',
    tipo: 'Email',
    aviso: ''
  })
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showAsignarConsultorModal, setShowAsignarConsultorModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [deleteType, setDeleteType] = useState('') // 'factura' o 'accion'

  const empresa = empresas.find(e => e.id === id)
  const consultor = consultores.find(c => c.nombre === empresa?.consultorAsignado)

  // Cargar facturas cuando se monta el componente
  useEffect(() => {
    const cargarFacturas = async () => {
      if (id) {
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
  }, [id, getFacturasEmpresa])

  // Cargar acciones (mock data por ahora)
  useEffect(() => {
    // Mock acciones para demostración
    setAcciones([
      {
        id: 1,
        fecha: '2024-07-20',
        autor: 'Allan Cantos Delgado',
        tipo: 'Email',
        descripcion: 'Se envió primer recordatorio por email.',
        aviso: '2024-07-27',
        facturaId: 'TS-2024-001'
      }
    ])
  }, [])

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
  const hasConsultor = !!empresa.consultorAsignado

  const facturasFiltradas = facturas.filter(factura => {
    const searchLower = searchTerm.toLowerCase()
    return (
      factura.numero?.toLowerCase().includes(searchLower) ||
      factura.monto?.toString().includes(searchLower)
    )
  })

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
    if (!accionFormData.descripcion.trim()) return

    const accionData = {
      ...accionFormData,
      fecha: new Date().toISOString().split('T')[0],
      autor: consultor?.nombre || 'Usuario'
    }

    handleSaveAccion(accionData, facturaId)
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
    const formattedDate = selectedDate.toISOString().split('T')[0]
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

  const handleAsignarConsultor = (consultorId) => {
    // Aquí deberías actualizar la empresa con el consultor asignado
    // Por ahora, simularemos la actualización
    const consultorSeleccionado = consultores.find(c => c.id === consultorId)
    if (consultorSeleccionado) {
      // En una aplicación real, aquí harías una llamada a la API
      // Por ahora, solo cerramos el modal y recargamos la página
      setShowAsignarConsultorModal(false)
      window.location.reload() // Recargar para ver los cambios
    }
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
          </div>
          
          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar
              placeholder="Buscar por nº de factura o importe..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
        </div>

        {/* Facturas List */}
        <div className="space-y-6">
          {loadingFacturas ? (
            <Card>
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Cargando facturas...</p>
              </div>
            </Card>
          ) : facturasFiltradas.length > 0 ? (
            facturasFiltradas.map(factura => (
              <Card key={factura.id} className="p-6">
                <div className="flex justify-between items-start">
                  {/* Left side - Invoice details */}
                  <div className="flex-1">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Factura #{factura.numero}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
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
                                    {formatearFecha(accion.fecha)} - {accion.autor} ({accion.tipo})
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
                          <form onSubmit={(e) => handleAccionFormSubmit(e, factura.numero)} className="space-y-6">
                            {/* Información del consultor */}
                            <div className="bg-gray-200 dark:bg-[#374151] rounded-lg p-4">
                              <div className="flex items-center space-x-3 mb-2">
                                <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">Acción registrada por:</span>
                              </div>
                              <p className="text-gray-900 dark:text-white font-medium">
                                {consultor?.nombre || 'Usuario'}
                              </p>
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
                                required
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

                            {/* Fecha de aviso */}
                            <div>
                              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                                Fecha de aviso (opcional)
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
                                <p className="text-xs text-gray-500">
                                  Deja vacío si no necesitas un aviso programado
                                </p>
                                {accionFormData.aviso && (
                                  <span className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                                    ✓ Aviso configurado
                                  </span>
                                )}
                              </div>
                            </div>

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
                          className="btn-secondary text-sm"
                        >
                          Añadir Acción
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right side - Amount and actions */}
                  <div className="flex items-center space-x-4 ml-6">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-400">
                        {formatearMoneda(factura.monto)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditFactura(factura)}
                        className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Edit className="w-4 h-4 text-gray-600 dark:text-white" />
                      </button>
                      <button
                        onClick={() => handleDeleteFactura(factura)}
                        className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-gray-600 dark:text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm ? 'No se encontraron facturas con el filtro aplicado.' : 'No hay facturas registradas.'}
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Modals */}
        {showFacturaModal && (
          <FacturaModal
            factura={editingFactura}
            onSave={handleSaveFactura}
            onClose={() => setShowFacturaModal(false)}
          />
        )}

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

      </div>
    </div>
  )
}

export default FacturasEmpresa 