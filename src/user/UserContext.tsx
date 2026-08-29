import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_BLOCK_THEME, EBlockTheme, setActiveBlockTheme } from '@src/tetris/blocks/themes'
import { EGameTheme } from "@components/GameThemes/EGameTheme.ts";
import { DEFAULT_SETTINGS, type Settings } from '@src/user/settings'

export type UserState = {
    blockTheme: EBlockTheme
    gameTheme: EGameTheme,
    settings: Settings
    progress: {
        gameTheme: Record<EGameTheme, number>
    }
}

type UserContextValue = {
    user: UserState
    setBlockTheme: (theme: EBlockTheme) => void
    setGameTheme: (theme: EGameTheme) => void
    patchSettings: (patch: Partial<Settings>) => void
}

const UserContext = createContext<UserContextValue | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
    const [blockTheme, setBlockThemeState] = useState<EBlockTheme>(DEFAULT_BLOCK_THEME)
    const [gameTheme, setGameThemeState] = useState<EGameTheme>(EGameTheme.CrystalSquares)
    const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS)

    const setBlockTheme = useCallback((theme: EBlockTheme) => {
        setActiveBlockTheme(theme)
        setBlockThemeState(theme)
    }, [])

    const setGameTheme = useCallback((theme: EGameTheme) => {
        setGameThemeState(theme)
    }, [])

    const patchSettings = useCallback((patch: Partial<Settings>) => {
        setSettingsState((prev) => ({ ...prev, ...patch }))
    }, [])

    const value = useMemo(
        () => ({
            user: {
                blockTheme,
                gameTheme,
                settings,
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
            patchSettings,
        }),
        [
            blockTheme,
            settings,
            setBlockTheme,
            gameTheme,
            setGameTheme,
            patchSettings,
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
