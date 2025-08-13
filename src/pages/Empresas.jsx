import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import Card from '../components/Card'
import SearchBar from '../components/SearchBar'
import EmpresaCard from '../components/EmpresaCard'
import AsignarConsultorModal from '../components/AsignarConsultorModal'
import { useData } from '../context/DataContext'

const Empresas = () => {
  const navigate = useNavigate()
  const { empresas, consultores, loading, error, dataLoaded, recargarDatos } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedConsultor, setSelectedConsultor] = useState('')
  const [showAsignarModal, setShowAsignarModal] = useState(false)
  const [selectedEmpresa, setSelectedEmpresa] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const empresasPerPage = 9

  // Filtrar empresas
  const empresasFiltradas = empresas.filter(empresa => {
    const matchesSearch = empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         empresa.cif.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         empresa.cif_empresa.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesConsultor = !selectedConsultor || empresa.consultorAsignado === selectedConsultor
    return matchesSearch && matchesConsultor
  })

  // Calcular paginación
  const totalPages = Math.ceil(empresasFiltradas.length / empresasPerPage)
  const indexOfLastEmpresa = currentPage * empresasPerPage
  const indexOfFirstEmpresa = indexOfLastEmpresa - empresasPerPage
  const currentEmpresas = empresasFiltradas.slice(indexOfFirstEmpresa, indexOfLastEmpresa)

  // Resetear página cuando cambian los filtros
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedConsultor])

  const handleAsignarConsultor = (empresa) => {
    setSelectedEmpresa(empresa)
    setShowAsignarModal(true)
  }

  const handleGestionarFacturas = (empresa) => {
    navigate(`/empresas/${empresa.id}/facturas`)
  }

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(valor)
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  if (loading || !dataLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500 mx-auto mb-6">
            <RefreshCw className="w-8 h-8 text-teal-500 mx-auto mt-4" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Inicializando Sistema</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Cargando datos de clientes...</p>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Empresas con Facturas Pendientes
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Gestiona y asigna seguimientos a las empresas deudoras.
              </p>

            </div>
            <button
              onClick={recargarDatos}
              disabled={loading}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>
          </div>
        </div>

        {/* Alerta de error */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <p className="text-red-400 font-medium">Error al cargar datos</p>
              </div>
              <button 
                onClick={recargarDatos} 
                disabled={loading}
                className="text-red-400 hover:text-red-300 text-sm font-medium"
              >
                Reintentar
              </button>
            </div>
            <p className="text-red-300 text-sm mt-2 ml-5">{error}</p>
          </div>
        )}

        {/* Filtros */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SearchBar
              placeholder="Buscar empresa por nombre o CIF..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
            <select
              className="input-field"
              value={selectedConsultor}
              onChange={(e) => setSelectedConsultor(e.target.value)}
            >
              <option value="">Todos los consultores</option>
              {consultores.map(consultor => (
                <option key={consultor.id} value={consultor.nombre}>
                  {consultor.nombre}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {/* Lista de empresas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentEmpresas.map(empresa => (
            <EmpresaCard
              key={empresa.id}
              empresa={empresa}
              onAsignarConsultor={() => handleAsignarConsultor(empresa)}
              onGestionarFacturas={() => handleGestionarFacturas(empresa)}
              formatearMoneda={formatearMoneda}
            />
          ))}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <Card className="mt-8">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Mostrando {indexOfFirstEmpresa + 1} a {Math.min(indexOfLastEmpresa, empresasFiltradas.length)} de {empresasFiltradas.length} empresas
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber
                  if (totalPages <= 5) {
                    pageNumber = i + 1
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i
                  } else {
                    pageNumber = currentPage - 2 + i
                  }
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNumber
                          ? 'bg-teal-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  )
                })}
                
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </Card>
        )}

        {empresasFiltradas.length === 0 && !error && (
          <Card>
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No se encontraron empresas con los filtros aplicados.</p>
            </div>
          </Card>
        )}

        {empresasFiltradas.length === 0 && error && (
          <Card>
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No se pueden mostrar las empresas debido a un error de conexión.</p>
              <p className="text-gray-500 text-sm mt-2">Usa el botón "Reintentar" en la alerta superior para volver a cargar los datos.</p>
            </div>
          </Card>
        )}

        {/* Modal Asignar Consultor */}
        {showAsignarModal && (
          <AsignarConsultorModal
            empresa={selectedEmpresa}
            consultores={consultores}
            onClose={() => setShowAsignarModal(false)}
            onSave={(consultorId) => {
              // Aquí se actualizaría la empresa con el consultor asignado
              console.log('Consultor asignado:', consultantId)
              setShowAsignarModal(false)
            }}
          />
        )}
      </div>
    </div>
  )
}

export default Empresas 