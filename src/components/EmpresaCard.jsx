import React from 'react'
import { Building2, FileText, Euro, User } from 'lucide-react'
import Card from './Card'

const EmpresaCard = ({ empresa, onAsignarConsultor, onGestionarFacturas, formatearMoneda }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
                       <div className="flex items-center space-x-4 mb-6">
                   <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                     empresa.estado === 'verde' ? 'bg-green-600' :
                     empresa.estado === 'amarillo' ? 'bg-yellow-600' :
                     empresa.estado === 'rojo' ? 'bg-red-600' : 'bg-blue-600'
                   }`}>
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
                     <div className="flex items-center space-x-2 mt-1">
                       <span className={`text-xs px-2 py-1 rounded-full ${
                         empresa.estado === 'verde' ? 'bg-green-900/30 text-green-400' :
                         empresa.estado === 'amarillo' ? 'bg-yellow-900/30 text-yellow-400' :
                         empresa.estado === 'rojo' ? 'bg-red-900/30 text-red-400' : 'bg-blue-900/30 text-blue-400'
                       }`}>
                         {empresa.estado?.toUpperCase()}
                       </span>
                     </div>
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
            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            <p className="font-semibold text-red-400">{formatearMoneda(empresa.montoTotal)}</p>
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