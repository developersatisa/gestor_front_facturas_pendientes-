import React, { useState } from 'react'
import { X, Calendar, User } from 'lucide-react'

const AccionModal = ({ factura, consultor, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    descripcion: '',
    tipo: 'Email',
    aviso: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.descripcion.trim()) return

    const accionData = {
      ...formData,
      fecha: new Date().toISOString().split('T')[0],
      autor: consultor?.nombre || 'Usuario'
    }

    onSave(accionData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Añadir Acción
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información de la factura */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Acción registrada por:</span>
            </div>
            <p className="text-gray-900 dark:text-white font-medium">
              {consultor?.nombre || 'Usuario'}
            </p>
            {factura && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Factura: {factura.numero}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Descripción de la acción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={4}
              className="input-field w-full"
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
              value={formData.tipo}
              onChange={handleChange}
              className="input-field w-full"
            >
              <option value="Email">Email</option>
              <option value="Llamada">Llamada</option>
              <option value="Visita">Visita</option>
              <option value="SMS">SMS</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {/* Fecha de aviso */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Fecha de aviso (opcional)
            </label>
            <div className="relative">
              <input
                type="date"
                name="aviso"
                value={formData.aviso}
                onChange={handleChange}
                className="input-field w-full pl-10"
              />
              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Deja vacío si no necesitas un aviso programado
            </p>
          </div>

          {/* Botones */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              Guardar Acción
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AccionModal 