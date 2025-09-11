import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BarChart3, Building2, Users } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { useData } from '../context/DataContext'

const Header = () => {
  const location = useLocation()
  const { apiBusy, apiError, probarConexion } = useData()

  let statusLabel = 'Conectado'
  let statusDot = 'bg-emerald-500'
  if (apiBusy > 0) {
    statusLabel = 'Conectando'
    statusDot = 'bg-yellow-500'
  } else if (apiError) {
    statusLabel = 'Sin conexion'
    statusDot = 'bg-red-500'
  }

  const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/empresas', label: 'Empresas', icon: Building2 },
    { path: '/consultores', label: 'Consultores', icon: Users }
  ]

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/logo-atisa.png" alt="Atisa" className="h-12 w-auto" />
            </Link>
          </div>

          <nav className="flex items-center space-x-4">
            <div className="flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                      ${isActive
                        ? 'bg-teal-600 text-white'
                        : 'text-gray-600 hover:text-teal-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-teal-400 dark:hover:bg-gray-700'}
                    `}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
            <button
              type="button"
              onClick={probarConexion}
              title="Probar conexión con el backend"
              className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <span className={`inline-block w-2 h-2 rounded-full ${statusDot}`}></span>
              <span className="text-xs text-gray-700 dark:text-gray-300">{statusLabel}</span>
            </button>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header


