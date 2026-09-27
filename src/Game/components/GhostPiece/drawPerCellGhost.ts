import type { Graphics } from 'pixi.js'
import type { ActivePiece } from '@src/tetris/tetrominoes'
import { getShapeLocalCells } from '@src/tetris/tetrominoes'
import {
    GHOST_CELL_PADDING,
    GHOST_CORNER_RADIUS,
    GHOST_STROKE_ALPHA,
    GHOST_STROKE_WIDTH,
    type GhostDrawStyle,
} from './ghostStyle'

function getPerCellLayout(cellSize: number, style: GhostDrawStyle) {
    const step = Math.round(cellSize)
    const padding = style.cellPadding ?? GHOST_CELL_PADDING
    const size = Math.max(0, step - padding * 2)
    const cornerRadius = Math.min(
        style.cornerRadius ?? GHOST_CORNER_RADIUS,
        Math.max(0, size / 5),
    )

    return { step, padding, size, cornerRadius }
}

/** Поклеточная заливка ghost непрозрачной. Прозрачность — на запечённом спрайте. */
export function drawPerCellGhostFill(
    graphics: Graphics,
    piece: Pick<ActivePiece, 'type' | 'rotation'>,
    cellSize: number,
    style: GhostDrawStyle,
): void {
    const cells = getShapeLocalCells(piece.type, piece.rotation)

    if (cells.length === 0 || cellSize <= 0) {
        return
    }

    const { step, padding, size, cornerRadius } = getPerCellLayout(cellSize, style)

    for (const { x, y } of cells) {
        graphics
            .roundRect(x * step + padding, y * step + padding, size, size, cornerRadius)
            .fill({ color: style.color, alpha: 1 })
    }
}

/** Поклеточная обводка ghost. */
export function drawPerCellGhostStroke(
    graphics: Graphics,
    piece: Pick<ActivePiece, 'type' | 'rotation'>,
    cellSize: number,
    style: GhostDrawStyle,
): void {
    const cells = getShapeLocalCells(piece.type, piece.rotation)

    if (cells.length === 0 || cellSize <= 0) {
        return
    }

    const { step, padding, size, cornerRadius } = getPerCellLayout(cellSize, style)
    const strokeWidth = style.strokeWidth ?? GHOST_STROKE_WIDTH
    const strokeAlpha = style.strokeAlpha ?? GHOST_STROKE_ALPHA

    for (const { x, y } of cells) {
        graphics
            .roundRect(x * step + padding, y * step + padding, size, size, cornerRadius)
            .stroke({
                width: strokeWidth,
                color: style.color,
                alpha: strokeAlpha,
                alignment: 1,
                join: 'round',
            })
    }
}

/** @deprecated Используйте drawPerCellGhostFill + drawPerCellGhostStroke. */
export function drawPerCellGhost(
    graphics: Graphics,
    piece: Pick<ActivePiece, 'type' | 'rotation'>,
    cellSize: number,
    style: GhostDrawStyle,
): void {
    drawPerCellGhostFill(graphics, piece, cellSize, style)
    drawPerCellGhostStroke(graphics, piece, cellSize, style)
}
