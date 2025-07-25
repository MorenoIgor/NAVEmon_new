"use client"
import { useState, useEffect } from 'react'

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Carregar preferência salva no localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'true')
    } else {
      setIsDarkMode(prefersDark)
    }
  }, [])

  // Aplicar tema quando isDarkMode mudar
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
      document.body.classList.add('dark-mode')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
      document.body.classList.remove('dark-mode')
    }
    
    // Salvar preferência no localStorage
    localStorage.setItem('darkMode', isDarkMode.toString())
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
  }

  return {
    isDarkMode,
    toggleDarkMode
  }
}
