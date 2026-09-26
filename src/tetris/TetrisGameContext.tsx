import { createContext, useCallback, useContext, useMemo, useRef, type ReactNode, type RefObject } from 'react'
import { useTick } from '@pixi/react'
import type { Ticker } from 'pixi.js'
import { useTetrisGame, type HardDropAnimation } from '../hooks/useTetrisGame'
import type { GameState } from '@src/tetris/engine'
import { BOARD_COLS, BOARD_ROWS } from '@src/tetris/constants'

const PAUSE_TIME_FADE_MS = 1250
const PLAYING_TIME_SCALE: RefObject<number> = { current: 1 }

type TetrisGameContextValue = {
    state: GameState
    togglePause: () => void
    endGame: () => void
    restart: () => void
    continueAfterAd: () => void
    timeScaleRef: RefObject<number>
    hardDropAnimationRef: RefObject<HardDropAnimation | null>
}

const TetrisGameContext = createContext<TetrisGameContextValue | null>(null)

export function TetrisGameProvider({ children }: { children: ReactNode }) {
    const { state, togglePause, endGame, restart, continueAfterAd, hardDropAnimationRef } =
        useTetrisGame(BOARD_ROWS, BOARD_COLS)
    const timeScaleRef = useRef(1)
    const pausedRef = useRef(state.paused)
    const gameOverRef = useRef(state.gameOver)
    pausedRef.current = state.paused
    gameOverRef.current = state.gameOver

    const onTimeScaleTick = useCallback((ticker: Ticker) => {
        // Пауза и конец игры (модалка награды) — замораживаем шейдер фона
        const target = pausedRef.current || gameOverRef.current ? 0 : 1
        const current = timeScaleRef.current

        if (current === target) {
            return
        }

        const direction = target > current ? 1 : -1
        timeScaleRef.current = Math.min(
            1,
            Math.max(0, current + direction * (ticker.deltaMS / PAUSE_TIME_FADE_MS)),
        )
    }, [])

    useTick(onTimeScaleTick)

    const value = useMemo(
        () => ({
            state,
            togglePause,
            endGame,
            restart,
            continueAfterAd,
            timeScaleRef,
            hardDropAnimationRef,
        }),
        [state, togglePause, endGame, restart, continueAfterAd, hardDropAnimationRef],
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

export function useHardDropAnimation(): RefObject<HardDropAnimation | null> {
    return useTetrisGameContext().hardDropAnimationRef
}

export function useTogglePause(): () => void {
    return useTetrisGameContext().togglePause
}

export function useEndGame(): () => void {
    return useTetrisGameContext().endGame
}

export function useRestartGame(): () => void {
    return useTetrisGameContext().restart
}

export function useContinueAfterAd(): () => void {
    return useTetrisGameContext().continueAfterAd
}

/** Множитель игрового времени [0, 1]. Вне провайдера всегда 1. */
export function useGameTimeScale(): RefObject<number> {
    const value = useContext(TetrisGameContext)

    return value?.timeScaleRef ?? PLAYING_TIME_SCALE
}
