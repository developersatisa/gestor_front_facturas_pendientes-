import React, { useEffect, useMemo, useState } from 'react'
import { Building2, FileText, Euro, RefreshCw } from 'lucide-react'
import Card from '../components/Card'
import { useEstadisticas } from '../hooks/useEstadisticas'

const Dashboard = () => {
  const { estadisticas, loading, error, recargarEstadisticas } = useEstadisticas()
  const { total_empresas_pendientes, total_facturas_pendientes, monto_total_adeudado, empresas_con_montos } = estadisticas
  const sociedades_con_montos = estadisticas?.sociedades_con_montos || []
  const facturas_mas_vencidas = estadisticas?.facturas_mas_vencidas || []
  const [pageVencidas, setPageVencidas] = useState(1)
  const perPageVencidas = 5
  useEffect(() => { setPageVencidas(1) }, [facturas_mas_vencidas?.length])
  const paginasVencidas = Math.max(1, Math.ceil((facturas_mas_vencidas?.length || 0) / perPageVencidas))
  const itemsVencidas = useMemo(() => {
    const start = (pageVencidas - 1) * perPageVencidas
    return facturas_mas_vencidas.slice(start, start + perPageVencidas)
  }, [facturas_mas_vencidas, pageVencidas])
  
  // Calcular deuda por empresa (top 4)
  const deudaPorEmpresa = empresas_con_montos.slice(0, 4)

  // Eliminado el fallback para evitar 404 cuando no existen endpoints auxiliares

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
          {/* Próximos Avisos (ocupa todo el ancho) */}
          <Card className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Próximos Avisos</h2>
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">No hay avisos programados.</p>
          </Card>

          {/* Deuda por Cliente */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Deuda por Cliente</h2>
            <div className="space-y-4">
              {sociedades_con_montos && sociedades_con_montos.length > 0 && (
                sociedades_con_montos.map((soc) => {
                  const totalSoc = sociedades_con_montos.reduce((acc, s) => acc + s.monto, 0) || 1
                  const porcentaje = (soc.monto / totalSoc) * 100
                  return (
                    <div key={soc.codigo} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{soc.nombre || soc.codigo}</span>
                        <span className="text-sm font-bold text-red-400">
                          {formatearMoneda(soc.monto)}
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
                })
              )}
              {(!sociedades_con_montos || sociedades_con_montos.length === 0) && (
                <p className="text-gray-600 dark:text-gray-400 text-center py-4">No hay datos de sociedades.</p>
              )}
            </div>
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

          {/* Facturas más vencidas (de mayor a menor) */}
          <Card className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Historial: Facturas más vencidas</h2>
            {!facturas_mas_vencidas || facturas_mas_vencidas.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">No hay facturas vencidas para mostrar.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600 dark:text-gray-400">
                      <th className="py-2 pr-4">Sociedad</th>
                      <th className="py-2 pr-4">Tercero</th>
                      <th className="py-2 pr-4">Vencimiento</th>
                      <th className="py-2 pr-4">Días vencidos</th>
                      <th className="py-2 pr-4 text-right">Pendiente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsVencidas.map((f, idx) => (
                      <tr key={`${f.tipo}-${f.asiento}-${idx}`} className="border-t border-gray-200 dark:border-gray-700">
                        <td className="py-2 pr-4">{f.sociedad}</td>
                        <td className="py-2 pr-4">{f.tercero}</td>
                        <td className="py-2 pr-4">{String(f.vencimiento).split('T')[0]}</td>
                        <td className="py-2 pr-4">{f.dias_vencidos}</td>
                        <td className="py-2 pl-4 text-right font-semibold">{formatearMoneda(f.pendiente || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Página {pageVencidas} de {paginasVencidas}
                  </span>
                  <div className="space-x-2">
                    <button
                      className="px-3 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                      onClick={() => setPageVencidas((p) => Math.max(1, p - 1))}
                      disabled={pageVencidas <= 1}
                    >
                      Anterior
                    </button>
                    <button
                      className="px-3 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                      onClick={() => setPageVencidas((p) => Math.min(paginasVencidas, p + 1))}
                      disabled={pageVencidas >= paginasVencidas}
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 
