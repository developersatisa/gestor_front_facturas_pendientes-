import React, { useState } from 'react'
import { X } from 'lucide-react'

const AsignarConsultorModal = ({ empresa, consultores, onClose, onSave }) => {
  const [selectedConsultor, setSelectedConsultor] = useState('')

  const handleSave = () => {
    if (selectedConsultor) {
      onSave(selectedConsultor)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Asignar Consultor
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
            <p className="text-gray-600 dark:text-gray-400 mb-2">Empresa:</p>
            <p className="text-gray-900 dark:text-white font-medium">{empresa?.nombre}</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Seleccionar Consultor
            </label>
            <select
              className="input-field w-full"
              value={selectedConsultor}
              onChange={(e) => setSelectedConsultor(e.target.value)}
            >
              <option value="">Seleccione un consultor</option>
              {consultores.map(consultor => (
                <option key={consultor.id} value={consultor.id}>
                  {consultor.nombre}
                </option>
              ))}
            </select>
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
            disabled={!selectedConsultor}
            className={`${
              selectedConsultor 
                ? 'btn-primary' 
                : 'bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

export default AsignarConsultorModal 