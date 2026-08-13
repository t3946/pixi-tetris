import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export enum SceneId {
    MainMenu = 'mainMenu',
    Game = 'game',
    Dev = 'dev',
    RowEffect = 'rowEffect',
}

type SceneContextValue = {
    scene: SceneId
    setScene: (scene: SceneId) => void
}

const SceneContext = createContext<SceneContextValue | null>(null)

export function SceneProvider({ children }: { children: ReactNode }) {
    const [scene, setScene] = useState<SceneId>(SceneId.MainMenu)

    const value = useMemo(() => ({ scene, setScene }), [scene])

    return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>
}

export function useScene(): SceneContextValue {
    const value = useContext(SceneContext)

    if (!value) {
        throw new Error('useScene must be used within SceneProvider')
    }

    return value
}
