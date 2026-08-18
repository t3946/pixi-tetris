import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_BLOCK_THEME, EBlockTheme, setActiveBlockTheme } from '@src/tetris/blocks/themes'

export type UserState = {
    blockTheme: EBlockTheme
}

type UserContextValue = {
    user: UserState
    setBlockTheme: (theme: EBlockTheme) => void
}

const UserContext = createContext<UserContextValue | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
    const [blockTheme, setBlockThemeState] = useState<EBlockTheme>(DEFAULT_BLOCK_THEME)

    const setBlockTheme = useCallback((theme: EBlockTheme) => {
        setActiveBlockTheme(theme)
        setBlockThemeState(theme)
    }, [])

    const value = useMemo(
        () => ({
            user: { blockTheme },
            setBlockTheme,
        }),
        [blockTheme, setBlockTheme],
    )

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser(): UserContextValue {
    const value = useContext(UserContext)

    if (!value) {
        throw new Error('useUser must be used within UserProvider')
    }

    return value
}
