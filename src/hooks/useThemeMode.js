import { useEffect, useState } from 'react'

const THEME_STORAGE_KEY = 'zoqueda_roi_theme_mode'

function getInitialThemeMode() {
  try {
    const savedMode = window.localStorage.getItem(THEME_STORAGE_KEY)

    if (savedMode === 'light' || savedMode === 'dark') {
      return savedMode
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

function useThemeMode() {
  const [themeMode, setThemeMode] = useState(getInitialThemeMode)

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, themeMode)
    } catch {
      return
    }
  }, [themeMode])

  return {
    isDarkMode: themeMode === 'dark',
    themeMode,
    toggleThemeMode: () => {
      setThemeMode((currentMode) => (currentMode === 'dark' ? 'light' : 'dark'))
    },
  }
}

export default useThemeMode

