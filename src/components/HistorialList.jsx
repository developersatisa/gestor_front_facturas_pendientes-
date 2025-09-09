import React from 'react'

const HistorialList = ({ eventos }) => {
  if (!eventos || eventos.length === 0) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">Sin eventos de historial.</div>
    )
  }

  return (
    <div className="space-y-2">
      {eventos.map(ev => (
        <div key={ev.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-sm flex items-center justify-between">
          <div className="text-gray-800 dark:text-gray-200">
            <span className="font-medium">{ev.estado_nuevo}</span>
            {ev.motivo ? <span className="ml-2 text-gray-600 dark:text-gray-300">— {ev.motivo}</span> : null}
            {ev.nueva_fecha ? <span className="ml-2 text-blue-500">Nueva fecha: {ev.nueva_fecha}</span> : null}
          </div>
          <div className="text-gray-500 dark:text-gray-400">{new Date(ev.creado_en).toLocaleString('es-ES')}</div>
        </div>
      ))}
    </div>
  )
}

export default HistorialList

