import { createContext, useContext, type ReactNode } from 'react'
import { useTetrisGame } from '../hooks/useTetrisGame'
import type { GameState } from '@src/tetris/engine'
import { BOARD_COLS, BOARD_ROWS } from '@src/tetris/constants'

const TetrisGameContext = createContext<GameState | null>(null)

export function TetrisGameProvider({ children }: { children: ReactNode }) {
    const state = useTetrisGame(BOARD_ROWS, BOARD_COLS)

    return (
        <TetrisGameContext.Provider value={state}>
            {children}
        </TetrisGameContext.Provider>
    )
}

export function useTetrisGameState(): GameState {
    const state = useContext(TetrisGameContext)

    if (!state) {
        throw new Error('useTetrisGameState must be used within TetrisGameProvider')
    }

    return state
}
