import React, { useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import Card from '../components/Card'
import ConsultorItem from '../components/ConsultorItem'
import ConsultorFormModal from '../components/ConsultorFormModal'
import ConfirmModal from '../components/ConfirmModal'
import { useData } from '../context/DataContext'

const Consultores = () => {
  const { consultores, addConsultor, updateConsultor, deleteConsultor } = useData()
  const [showModal, setShowModal] = useState(false)
  const [editingConsultor, setEditingConsultor] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [consultorToDelete, setConsultorToDelete] = useState(null)

  const handleAddConsultor = () => {
    setEditingConsultor(null)
    setShowModal(true)
  }

  const handleEditConsultor = (consultor) => {
    setEditingConsultor(consultor)
    setShowModal(true)
  }

  const handleDeleteConsultor = (consultor) => {
    setConsultorToDelete(consultor)
    setShowConfirmModal(true)
  }

  const confirmDeleteConsultor = () => {
    if (consultorToDelete) {
      deleteConsultor(consultorToDelete.id)
      setConsultorToDelete(null)
    }
  }

  const handleSaveConsultor = (consultorData) => {
    if (editingConsultor) {
      // Editar consultor existente
      updateConsultor(editingConsultor.id, consultorData)
    } else {
      // Agregar nuevo consultor
      addConsultor(consultorData)
    }
    setShowModal(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Mantenimiento de Consultores
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestiona los consultores del sistema.
            </p>
          </div>
          <button
            onClick={handleAddConsultor}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Añadir Consultor</span>
          </button>
        </div>

        {/* Lista de consultores */}
        <Card>
          {consultores.length > 0 ? (
            <div className="space-y-6">
              {consultores.map(consultor => (
                <ConsultorItem
                  key={consultor.id}
                  consultor={consultor}
                  onEdit={() => handleEditConsultor(consultor)}
                  onDelete={() => handleDeleteConsultor(consultor)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No hay consultores registrados.</p>
            </div>
          )}
        </Card>

        {/* Modal de Consultor */}
        {showModal && (
          <ConsultorFormModal
            consultor={editingConsultor}
            onSave={handleSaveConsultor}
            onClose={() => setShowModal(false)}
          />
        )}

        {/* Modal de Confirmación */}
        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => {
            setShowConfirmModal(false)
            setConsultorToDelete(null)
          }}
          onConfirm={confirmDeleteConsultor}
          title="Eliminar Consultor"
          message="¿Está seguro de que desea eliminar este consultor? Esta acción no se puede deshacer."
          type="danger"
          entityType="consultor"
          entityName={consultorToDelete?.nombre}
        />
      </div>
    </div>
  )
}

export default Consultores 