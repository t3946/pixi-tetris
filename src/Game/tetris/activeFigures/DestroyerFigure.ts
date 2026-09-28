import { EPieceType } from '@src/tetris/blocks/themes'
import { ActiveFigure } from './ActiveFigure'
import { BUILDER_LIKE_SHAPE } from './BuilderFigure'
import {
    ACTIVE_SHOT_COOLDOWN_MS,
    DESTROYER_SHELL_COLOR,
    trySpawnShell,
    type FallingProjectile,
} from '../projectiles'

/** Ярко-красный «Разрушитель». */
export const DESTROYER_COLOR = 0xff1439

type ActiveShooterHostState = {
    piece: { type: EPieceType; x: number; y: number; rotation: number } | null
    board: number[][]
    projectiles: readonly FallingProjectile[]
    activeShotAtMs: number | null
}

/**
 * Тот же силуэт, что у Строителя, но снаряды сносят блок 1×1.
 * Форма:
 * 101
 * 111
 * 010
 */
export class DestroyerFigure extends ActiveFigure {
    readonly type = EPieceType.Destroyer
    readonly color = DESTROYER_COLOR
    readonly shape = BUILDER_LIKE_SHAPE
    readonly spawnChance = 0.03

    getAlpha(elapsedMs: number): number {
        return 0.675 + 0.325 * Math.sin(elapsedMs * 0.008)
    }

    /** Выстрел снарядом 1×1: удаляет клетку при попадании (не чаще 1/500 ms). */
    activate<TState>(state: TState, _cols: number): TState {
        const host = state as TState & ActiveShooterHostState
        if (!host.piece || !host.projectiles || !host.board) {
            return state
        }

        const now = performance.now()
        if (
            host.activeShotAtMs != null &&
            now - host.activeShotAtMs < ACTIVE_SHOT_COOLDOWN_MS
        ) {
            return state
        }

        const nextProjectiles = trySpawnShell({
            piece: host.piece,
            board: host.board,
            projectiles: host.projectiles,
            color: DESTROYER_SHELL_COLOR,
            mode: 'destroy',
        })
        if (!nextProjectiles) {
            return state
        }

        return {
            ...host,
            projectiles: nextProjectiles,
            activeShotAtMs: now,
        } as TState
    }
}

export const destroyerFigure = new DestroyerFigure()
