import type { ActivePiece } from '@src/tetris/tetrominoes'
import { getShapeLocalCells } from '@src/tetris/tetrominoes'
import { GHOST_CELL_PADDING, GHOST_CORNER_RADIUS } from './ghostStyle'
import { buildPolyominoOutline, offsetOrthogonalPolygon } from './polyominoOutline'

type Point = { x: number; y: number }

export type UnifiedGhostGeometry = {
    path: Point[]
    cornerRadius: number
}

export function getUnifiedGhostGeometry(
    piece: Pick<ActivePiece, 'type' | 'rotation'>,
    cellSize: number,
    cellPadding = GHOST_CELL_PADDING,
): UnifiedGhostGeometry | null {
    const cells = getShapeLocalCells(piece.type, piece.rotation)
    const outline = buildPolyominoOutline(cells)

    if (outline.length < 3 || cellSize <= 0) {
        return null
    }

    const step = Math.round(cellSize)
    const scaled = outline.map((point) => ({
        x: point.x * step,
        y: point.y * step,
    }))
    const path = offsetOrthogonalPolygon(scaled, cellPadding)
    const cornerRadius = Math.min(GHOST_CORNER_RADIUS, Math.max(0, step / 5))

    return { path, cornerRadius }
}
