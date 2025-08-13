import React from 'react'
import { User, Edit, Trash2 } from 'lucide-react'

const ConsultorItem = ({ consultor, onEdit, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-6 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{consultor.nombre}</h3>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <button
          onClick={onEdit}
          className="p-2 text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          title="Editar consultor"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          title="Eliminar consultor"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}

export default ConsultorItem 