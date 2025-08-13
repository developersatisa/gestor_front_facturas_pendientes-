import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Obtener el tema guardado en localStorage o usar claro por defecto
    const savedTheme = localStorage.getItem('theme')
    return savedTheme ? savedTheme === 'dark' : false
  })

  useEffect(() => {
    // Guardar el tema en localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
    
    // Aplicar el tema al documento usando el sistema de Tailwind
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const value = {
    isDarkMode,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
} 