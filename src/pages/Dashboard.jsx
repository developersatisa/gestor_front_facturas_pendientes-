import React from 'react'
import { Building2, FileText, Euro, RefreshCw } from 'lucide-react'
import Card from '../components/Card'
import { useEstadisticas } from '../hooks/useEstadisticas'

const Dashboard = () => {
  const { estadisticas, loading, error, recargarEstadisticas } = useEstadisticas()
  const { total_empresas_pendientes, total_facturas_pendientes, monto_total_adeudado, empresas_con_montos } = estadisticas
  
  // Calcular deuda por empresa (top 4)
  const deudaPorEmpresa = empresas_con_montos.slice(0, 4)

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(valor)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={recargarEstadisticas} className="btn-primary">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Cuadro de Mandos
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={recargarEstadisticas}
              disabled={loading}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Total Empresas */}
          <Card className="flex items-center space-x-6 py-8">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Empresas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{total_empresas_pendientes}</p>
            </div>
          </Card>

          {/* Facturas Pendientes */}
          <Card className="flex items-center space-x-6 py-8">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Facturas Pendientes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{total_facturas_pendientes}</p>
            </div>
          </Card>

          {/* Monto Total Adeudado */}
          <Card className="flex items-center space-x-6 py-8">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <Euro className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monto Total Adeudado</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatearMoneda(monto_total_adeudado)}</p>
            </div>
          </Card>
        </div>

        {/* Contenido */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Próximos Avisos */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Próximos Avisos</h2>
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">No hay avisos programados.</p>
          </Card>

          {/* Deuda por Empresa */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Deuda por Empresa</h2>
            <div className="space-y-4">
              {deudaPorEmpresa.map((empresa) => {
                const porcentaje = (empresa.monto / monto_total_adeudado) * 100
                return (
                  <div key={empresa.idcliente} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{empresa.nombre.trim()}</span>
                      <span className="text-sm font-bold text-red-400">
                        {formatearMoneda(empresa.monto)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 