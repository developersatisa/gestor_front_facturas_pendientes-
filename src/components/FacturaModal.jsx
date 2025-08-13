import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const FacturaModal = ({ factura, onClose, onSave }) => {
  const [numero, setNumero] = useState('')
  const [monto, setMonto] = useState('')
  const [vencimiento, setVencimiento] = useState('')
  const isEditing = !!factura

  useEffect(() => {
    if (factura) {
      setNumero(factura.numero)
      setMonto(factura.monto.toString())
      setVencimiento(factura.vencimiento)
    }
  }, [factura])

  const handleSave = () => {
    if (numero.trim() && monto && vencimiento) {
      onSave({
        numero: numero.trim(),
        monto: parseFloat(monto),
        vencimiento: vencimiento
      })
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditing ? 'Editar Factura' : 'Añadir Factura'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Número de Factura
            </label>
            <input
              type="text"
              className="input-field w-full"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              placeholder="Ej: FAC-2024-001"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Monto
            </label>
            <input
              type="number"
              step="0.01"
              className="input-field w-full"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Fecha de Vencimiento
            </label>
            <input
              type="date"
              className="input-field w-full"
              value={vencimiento}
              onChange={(e) => setVencimiento(e.target.value)}
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
            disabled={!numero.trim() || !monto || !vencimiento}
            className={`${
              numero.trim() && monto && vencimiento
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

export default FacturaModal 