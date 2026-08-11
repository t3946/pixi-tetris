import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useTetrisGame } from '../hooks/useTetrisGame'
import type { GameState } from '@src/tetris/engine'
import { BOARD_COLS, BOARD_ROWS } from '@src/tetris/constants'

type TetrisGameContextValue = {
    state: GameState
    togglePause: () => void
}

const TetrisGameContext = createContext<TetrisGameContextValue | null>(null)

export function TetrisGameProvider({ children }: { children: ReactNode }) {
    const { state, togglePause } = useTetrisGame(BOARD_ROWS, BOARD_COLS)

    const value = useMemo(
        () => ({ state, togglePause }),
        [state, togglePause],
    )

    return (
        <TetrisGameContext.Provider value={value}>
            {children}
        </TetrisGameContext.Provider>
    )
}

function useTetrisGameContext(): TetrisGameContextValue {
    const value = useContext(TetrisGameContext)

    if (!value) {
        throw new Error('useTetrisGameState must be used within TetrisGameProvider')
    }

    return value
}

export function useTetrisGameState(): GameState {
    return useTetrisGameContext().state
}

export function useTogglePause(): () => void {
    return useTetrisGameContext().togglePause
}
