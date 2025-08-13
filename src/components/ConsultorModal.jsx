import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const ConsultorModal = ({ consultor, onClose, onSave }) => {
  const [nombre, setNombre] = useState('')
  const isEditing = !!consultor

  useEffect(() => {
    if (consultor) {
      setNombre(consultor.nombre)
    }
  }, [consultor])

  const handleSave = () => {
    if (nombre.trim()) {
      onSave({ nombre: nombre.trim() })
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditing ? 'Editar Consultor' : 'Añadir Consultor'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Nombre del Consultor
            </label>
            <input
              type="text"
              className="input-field w-full"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ingrese el nombre del consultor"
              autoFocus
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!nombre.trim()}
            className={`${
              nombre.trim() 
                ? 'btn-primary' 
                : 'bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            {isEditing ? 'Guardar' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConsultorModal 