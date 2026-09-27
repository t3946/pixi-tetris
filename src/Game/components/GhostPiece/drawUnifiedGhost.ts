import type { Graphics } from 'pixi.js'
import type { ActivePiece } from '@src/tetris/tetrominoes'
import {
    GHOST_STROKE_ALPHA,
    GHOST_STROKE_WIDTH,
    type GhostDrawStyle,
} from './ghostStyle'
import { getUnifiedGhostGeometry } from './unifiedGhostGeometry'

/**
 * Заливка цельного ghost непрозрачной.
 * Прозрачность — на запечённом спрайте (useBakedGhostFill), иначе видны швы earcut.
 */
export function drawUnifiedGhostFill(
    graphics: Graphics,
    piece: Pick<ActivePiece, 'type' | 'rotation'>,
    cellSize: number,
    style: GhostDrawStyle,
): void {
    const geometry = getUnifiedGhostGeometry(piece, cellSize, style.cellPadding)

    if (!geometry) {
        return
    }

    graphics.roundShape(geometry.path, geometry.cornerRadius).fill({ color: style.color, alpha: 1 })
}

/** Обводка цельного ghost. */
export function drawUnifiedGhostStroke(
    graphics: Graphics,
    piece: Pick<ActivePiece, 'type' | 'rotation'>,
    cellSize: number,
    style: GhostDrawStyle,
): void {
    const geometry = getUnifiedGhostGeometry(piece, cellSize, style.cellPadding)

    if (!geometry) {
        return
    }

    graphics.roundShape(geometry.path, geometry.cornerRadius).stroke({
        width: style.strokeWidth ?? GHOST_STROKE_WIDTH,
        color: style.color,
        alpha: style.strokeAlpha ?? GHOST_STROKE_ALPHA,
        alignment: 1,
        join: 'round',
    })
}

/** @deprecated Используйте drawUnifiedGhostFill + drawUnifiedGhostStroke с alpha на контейнере. */
export function drawUnifiedGhost(
    graphics: Graphics,
    piece: Pick<ActivePiece, 'type' | 'rotation'>,
    cellSize: number,
    style: GhostDrawStyle,
): void {
    drawUnifiedGhostFill(graphics, piece, cellSize, style)
    drawUnifiedGhostStroke(graphics, piece, cellSize, style)
}
