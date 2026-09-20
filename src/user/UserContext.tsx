import { createContext, useCallback, useContext, useMemo, useReducer, useState, type ReactNode } from 'react'
import { DEFAULT_BLOCK_THEME, EBlockTheme, setActiveBlockTheme } from '@src/tetris/blocks/themes'
import { EGameTheme } from '@components/GameThemes/EGameTheme.ts'
import { DEFAULT_SETTINGS, type Settings } from '@src/user/settings'
import type { GameModeId } from '@components/MainMenu/gameModes'
import {
    BLITZ_MISSIONS_TOTAL,
    INITIAL_BLITZ_MISSIONS_COMPLETED,
    createBlitzMission,
    type Mission,
} from '@src/user/missions'

export type UserState = {
    blockTheme: EBlockTheme
    gameTheme: EGameTheme
    settings: Settings
    /** Выбранный режим на главном экране */
    selectedMode: GameModeId
    /** Активная миссия текущей игровой сессии (null — без цели) */
    activeMission: Mission | null
    progress: {
        gameTheme: Record<EGameTheme, number>
        /** Сколько миссий Блица уже пройдено в этой сессии */
        blitzMissionsCompleted: number
    }
}

type UserContextValue = {
    user: UserState
    setBlockTheme: (theme: EBlockTheme) => void
    setGameTheme: (theme: EGameTheme) => void
    setSelectedMode: (mode: GameModeId) => void
    patchSettings: (patch: Partial<Settings>) => void
    /** Сгенерировать миссию под выбранный режим при старте партии */
    startActiveMission: () => void
    /** Засчитать выполнение миссии Блица (идемпотентно) */
    completeActiveMission: () => void
}

type MissionSession = {
    activeMission: Mission | null
    blitzMissionsCompleted: number
}

type MissionAction =
    | { type: 'start'; mode: GameModeId }
    | { type: 'complete'; mode: GameModeId }

function missionSessionReducer(state: MissionSession, action: MissionAction): MissionSession {
    switch (action.type) {
        case 'start':
            if (action.mode === 'blitz') {
                return { ...state, activeMission: createBlitzMission() }
            }
            return { ...state, activeMission: null }
        case 'complete':
            if (state.activeMission == null) {
                return state
            }
            if (action.mode === 'blitz') {
                return {
                    activeMission: null,
                    blitzMissionsCompleted: Math.min(
                        BLITZ_MISSIONS_TOTAL,
                        state.blitzMissionsCompleted + 1,
                    ),
                }
            }
            return { ...state, activeMission: null }
        default:
            return state
    }
}

const UserContext = createContext<UserContextValue | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
    const [blockTheme, setBlockThemeState] = useState<EBlockTheme>(DEFAULT_BLOCK_THEME)
    const [gameTheme, setGameThemeState] = useState<EGameTheme>(EGameTheme.CrystalSquares)
    const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS)
    const [selectedMode, setSelectedModeState] = useState<GameModeId>('blitz')
    const [missionSession, dispatchMission] = useReducer(missionSessionReducer, {
        activeMission: null,
        blitzMissionsCompleted: INITIAL_BLITZ_MISSIONS_COMPLETED,
    })

    const setBlockTheme = useCallback((theme: EBlockTheme) => {
        setActiveBlockTheme(theme)
        setBlockThemeState(theme)
    }, [])

    const setGameTheme = useCallback((theme: EGameTheme) => {
        setGameThemeState(theme)
    }, [])

    const setSelectedMode = useCallback((mode: GameModeId) => {
        setSelectedModeState(mode)
    }, [])

    const patchSettings = useCallback((patch: Partial<Settings>) => {
        setSettingsState((prev) => ({ ...prev, ...patch }))
    }, [])

    const startActiveMission = useCallback(() => {
        dispatchMission({ type: 'start', mode: selectedMode })
    }, [selectedMode])

    const completeActiveMission = useCallback(() => {
        dispatchMission({ type: 'complete', mode: selectedMode })
    }, [selectedMode])

    const value = useMemo(
        () => ({
            user: {
                blockTheme,
                gameTheme,
                settings,
                selectedMode,
                activeMission: missionSession.activeMission,
                progress: {
                    gameTheme: {
                        [EGameTheme.CrystalSquares]: 10,
                        [EGameTheme.WadingCausticBlue]: 10,
                        [EGameTheme.WadingCausticRed]: 10,
                        [EGameTheme.NeonwaveSunrise]: 10,
                        [EGameTheme.OceanUnder]: 10,
                        [EGameTheme.Shine]: 10,
                    },
                    blitzMissionsCompleted: missionSession.blitzMissionsCompleted,
                },
            },
            setBlockTheme,
            setGameTheme,
            setSelectedMode,
            patchSettings,
            startActiveMission,
            completeActiveMission,
        }),
        [
            blockTheme,
            gameTheme,
            settings,
            selectedMode,
            missionSession,
            setBlockTheme,
            setGameTheme,
            setSelectedMode,
            patchSettings,
            startActiveMission,
            completeActiveMission,
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
