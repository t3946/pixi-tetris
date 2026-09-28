import { EPieceType } from '@src/tetris/blocks/themes'
import { ActiveFigure } from './ActiveFigure'
import {
    BUILDER_SHOT_COOLDOWN_MS,
    trySpawnBuilderShell,
    type FallingProjectile,
} from '../projectiles'

/** Ярко-зелёный «Строитель». */
export const BUILDER_COLOR = 0x39ff14

type BuilderHostState = {
    piece: { type: EPieceType; x: number; y: number; rotation: number } | null
    board: number[][]
    projectiles: readonly FallingProjectile[]
    activeShotAtMs: number | null
}

/**
 * Форма:
 * 101
 * 111
 * 010
 */
export class BuilderFigure extends ActiveFigure {
    readonly type = EPieceType.Builder
    readonly color = BUILDER_COLOR
    readonly shape = [
        [1, 0, 1],
        [1, 1, 1],
        [0, 1, 0],
    ]

    /** Мерцание: прозрачность по синусоиде ~0.35…1. */
    getAlpha(elapsedMs: number): number {
        return 0.675 + 0.325 * Math.sin(elapsedMs * 0.008)
    }

    /** Выстрел снарядом 1×1 по центру под фигурой (не чаще 1/500 ms). */
    activate<TState>(state: TState, _cols: number): TState {
        const host = state as TState & BuilderHostState
        if (!host.piece || !host.projectiles || !host.board) {
            return state
        }

        const now = performance.now()
        if (
            host.activeShotAtMs != null &&
            now - host.activeShotAtMs < BUILDER_SHOT_COOLDOWN_MS
        ) {
            return state
        }

        const nextProjectiles = trySpawnBuilderShell(host.piece, host.board, host.projectiles)
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

export const builderFigure = new BuilderFigure()
