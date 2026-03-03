'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
    theme: Theme
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    toggleTheme: () => { },
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem('bus-theme') as Theme | null
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const initial = saved ?? (prefersDark ? 'dark' : 'light')
        setTheme(initial)
        document.documentElement.setAttribute('data-theme', initial)
        setMounted(true)
    }, [])

    const toggleTheme = () => {
        const next = theme === 'light' ? 'dark' : 'light'
        setTheme(next)
        localStorage.setItem('bus-theme', next)
        document.documentElement.setAttribute('data-theme', next)
    }

    if (!mounted) return null

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext)
}
