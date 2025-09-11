import React, { useEffect, useMemo, useState } from 'react'
import { Building2, FileText, Euro, User } from 'lucide-react'
import Card from './Card'
import { useData } from '../context/DataContext'
// Mapeo de nombres amigables por sociedad
const SOC_NAMES = {
  S005: 'Grupo Atisa BPO',
  S001: 'Asesores Titulados',
  S010: 'Selier by Atisa',
}

const EmpresaCard = ({ empresa, onAsignarConsultor, onGestionarFacturas, formatearMoneda }) => {
  const { getFacturasEmpresa } = useData()
  const [socResumen, setSocResumen] = useState([]) // [{codigo, nombre, cantidad, pendiente}]
  const [loadedFor, setLoadedFor] = useState(null)

  useEffect(() => {
    const load = async () => {
      const empresaId = empresa?.id || empresa?.idcliente
      if (!empresaId || loadedFor === empresaId) return
      try {
        const facts = await getFacturasEmpresa(empresaId)
        const map = new Map()
        for (const f of facts) {
          const codigo = (f?.sociedad || '').trim()
          if (!codigo) continue
          const nombre = f?.sociedad_nombre || codigo
          const importe = Number(f?.monto) || 0
          const pago = Number(f?.pago) || 0
          const pendiente = typeof f?.pendiente === 'number' ? Number(f.pendiente) : Math.max(0, importe - pago)
          const prev = map.get(codigo) || { codigo, nombre, cantidad: 0, pendiente: 0 }
          prev.cantidad += 1
          prev.pendiente += pendiente
          map.set(codigo, prev)
        }
        const lista = Array.from(map.values()).sort((a, b) => b.pendiente - a.pendiente)
        setSocResumen(lista)
        setLoadedFor(empresaId)
      } catch (_) {
        setSocResumen([])
      }
    }
    load()
  }, [empresa?.id, empresa?.idcliente, getFacturasEmpresa, loadedFor])

  const topSociedades = useMemo(() => socResumen.slice(0, 3), [socResumen])
  const restantes = Math.max(0, socResumen.length - topSociedades.length)

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
                       <div className="flex items-center space-x-4 mb-6">
                   <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-blue-600`}>
                     <Building2 className="w-5 h-5 text-white" />
                   </div>
                   <div>
                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{empresa.nombre}</h3>
                     <p className="text-sm text-gray-600 dark:text-gray-400">CIF: {empresa.cif}</p>
                     {empresa.cif_empresa && empresa.cif_empresa !== empresa.cif && (
                       <p className="text-xs text-gray-500">CIF Empresa: {empresa.cif_empresa}</p>
                     )}
                     {empresa.idcliente && (
                       <p className="text-xs text-gray-500">ID Cliente: {empresa.idcliente}</p>
                     )}
                     {/* Estado visual eliminado */}
                   </div>
                 </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-yellow-500" />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Facturas</p>
            <p className="font-semibold text-gray-900 dark:text-white">{empresa.facturasPendientes}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Euro className="w-4 h-4 text-red-500" />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400" title="Suma de pendientes de facturas menos abonos">Total neto</p>
            <p className={`font-semibold ${empresa.montoTotal > 0 ? 'text-red-400' : 'text-gray-400'}`}>{formatearMoneda(empresa.montoTotal)}</p>
          </div>
        </div>
      </div>

      {/* Consultor asignado */}
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Consultor asignado</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {empresa.consultorAsignado || 'Sin asignar'}
            </p>
          </div>
        </div>
      </div>

      {/* Sociedades resumen con importes */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sociedades</p>
        {socResumen.length === 0 ? (
          <p className="text-xs text-gray-500 dark:text-gray-400">Sin datos de sociedades</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {topSociedades.map((s) => (
              <span
                key={s.codigo}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border ${
                  s.codigo === 'S005' ? 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-100 dark:border-teal-800' :
                  s.codigo === 'S001' ? 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-100 dark:border-indigo-800' :
                  s.codigo === 'S010' ? 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-100 dark:border-amber-800' :
                  'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700'
                }`}
                title={`${s.codigo} — ${SOC_NAMES[s.codigo] || s.nombre}`}
              >
                <span className="font-semibold">{SOC_NAMES[s.codigo] || s.nombre}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/60 dark:bg-black/30 border border-white/80 dark:border-gray-600" title="Nº facturas">
                  {s.cantidad}
                </span>
                <span className="text-[11px] font-medium" title="Importe pendiente">
                  {formatearMoneda(s.pendiente)}
                </span>
              </span>
            ))}
            {restantes > 0 && (
              <span className="inline-flex items-center px-2 py-1.5 rounded-full text-xs bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                +{restantes} más
              </span>
            )}
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex space-x-3">
        <button
          onClick={onAsignarConsultor}
          className="flex-1 btn-secondary text-sm py-2"
        >
          Asignar Consultor
        </button>
        <button
          onClick={onGestionarFacturas}
          className="flex-1 btn-primary text-sm py-2"
        >
          Gestionar Facturas
        </button>
      </div>
    </Card>
  )
}

export default EmpresaCard 
