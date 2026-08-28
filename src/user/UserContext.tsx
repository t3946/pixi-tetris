import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_BLOCK_THEME, EBlockTheme, setActiveBlockTheme } from '@src/tetris/blocks/themes'
import { EGameTheme } from "@components/GameThemes/EGameTheme.ts";

export type UserState = {
    blockTheme: EBlockTheme
    gameTheme: EGameTheme,
    progress: {
        gameTheme: Record<EGameTheme, number>
    }
}

type UserContextValue = {
    user: UserState
    setBlockTheme: (theme: EBlockTheme) => void
    setGameTheme: (theme: EGameTheme) => void
}

const UserContext = createContext<UserContextValue | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
    const [blockTheme, setBlockThemeState] = useState<EBlockTheme>(DEFAULT_BLOCK_THEME)
    const [gameTheme, setGameThemeState] = useState<EGameTheme>(EGameTheme.CrystalSquares)

    const setBlockTheme = useCallback((theme: EBlockTheme) => {
        setActiveBlockTheme(theme)
        setBlockThemeState(theme)
    }, [])

    const setGameTheme = useCallback((theme: EGameTheme) => {
        setGameThemeState(theme)
    }, [])

    const value = useMemo(
        () => ({
            user: {
                blockTheme,
                gameTheme,
                progress: {
                    gameTheme: {
                        [EGameTheme.CrystalSquares]: 10,
                        [EGameTheme.WadingCausticBlue]: 10,
                        [EGameTheme.WadingCausticRed]: 10,
                    }
                }
            },
            setBlockTheme,
            setGameTheme,
        }),
        [
            blockTheme,
            setBlockTheme,
            gameTheme,
            setGameTheme,
        ],
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
