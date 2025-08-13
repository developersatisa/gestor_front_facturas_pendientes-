import React from 'react'
import { AlertTriangle, CheckCircle, XCircle, Trash2, User, FileText, Building2 } from 'lucide-react'

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirmar acción',
  message = '¿Está seguro de que desea realizar esta acción?',
  type = 'warning', // 'warning', 'danger', 'info'
  entityType = 'item', // 'consultor', 'factura', 'empresa', 'accion'
  entityName = ''
}) => {
  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <Trash2 className="w-6 h-6 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />
      case 'info':
        return <CheckCircle className="w-6 h-6 text-blue-500" />
      default:
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />
    }
  }

  const getEntityIcon = () => {
    switch (entityType) {
      case 'consultor':
        return <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
      case 'factura':
        return <FileText className="w-4 h-4 text-yellow-500" />
      case 'empresa':
        return <Building2 className="w-4 h-4 text-blue-500" />
      case 'accion':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      default:
        return null
    }
  }

  const getButtonStyles = () => {
    switch (type) {
      case 'danger':
        return {
          confirm: 'bg-red-600 hover:bg-red-700 text-white',
          cancel: 'bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
        }
      case 'warning':
        return {
          confirm: 'bg-yellow-600 hover:bg-yellow-700 text-white',
          cancel: 'bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
        }
      case 'info':
        return {
          confirm: 'bg-blue-600 hover:bg-blue-700 text-white',
          cancel: 'bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
        }
      default:
        return {
          confirm: 'bg-teal-600 hover:bg-teal-700 text-white',
          cancel: 'bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
        }
    }
  }

  const buttonStyles = getButtonStyles()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-md w-full mx-4 transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            {getIcon()}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {message}
          </p>
          
          {entityName && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2">
                {getEntityIcon()}
                <span className="font-medium text-gray-900 dark:text-white">
                  {entityName}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${buttonStyles.cancel}`}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${buttonStyles.confirm}`}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal 