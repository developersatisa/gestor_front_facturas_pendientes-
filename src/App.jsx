import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { DataProvider } from './context/DataContext'
import { ThemeProvider } from './context/ThemeContext'
import ErrorBoundary from './components/ErrorBoundary'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Empresas from './pages/Empresas'
import Consultores from './pages/Consultores'
import FacturasEmpresa from './pages/FacturasEmpresa'

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/empresas" element={<Empresas />} />
        <Route path="/consultores" element={<Consultores />} />
        <Route path="/empresas/:id/facturas" element={<FacturasEmpresa />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App 
