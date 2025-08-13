import { useState } from 'react'

export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    entityType: 'item',
    entityName: '',
    onConfirm: null
  })

  const showConfirm = ({ title, message, type = 'warning', entityType = 'item', entityName = '', onConfirm }) => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      type,
      entityType,
      entityName,
      onConfirm
    })
  }

  const hideConfirm = () => {
    setConfirmState(prev => ({ ...prev, isOpen: false }))
  }

  const handleConfirm = () => {
    if (confirmState.onConfirm) {
      confirmState.onConfirm()
    }
    hideConfirm()
  }

  return {
    confirmState,
    showConfirm,
    hideConfirm,
    handleConfirm
  }
} 