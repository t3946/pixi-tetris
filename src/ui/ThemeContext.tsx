import { createContext, useContext, type ReactNode } from 'react'
import { theme as defaultTheme, type Theme } from './themes/default'

const ThemeContext = createContext<Theme | null>(null)

export function ThemeProvider({
    children,
    theme = defaultTheme,
}: {
    children: ReactNode
    theme?: Theme
}) {
    return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

export function useTheme(): Theme {
    const theme = useContext(ThemeContext)

    if (!theme) {
        throw new Error('useTheme must be used within ThemeProvider')
    }

    return theme
}
