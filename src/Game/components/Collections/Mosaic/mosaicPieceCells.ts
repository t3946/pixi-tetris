import { getShapeLocalCells, type PieceType } from '@src/tetris/tetrominoes.ts'

export type MosaicPiece = {
    type: PieceType
    /** Клетка сетки — левый верх занятого bbox фигуры */
    x: number
    y: number
    rotation?: number
}

/** Клетки фигуры на доске: (x, y) — левый верх bbox занятых клеток. */
export function getPieceBoardCells(piece: MosaicPiece): { x: number; y: number }[] {
    const local = getShapeLocalCells(piece.type, piece.rotation ?? 0)
    const minX = Math.min(...local.map((cell) => cell.x))
    const minY = Math.min(...local.map((cell) => cell.y))

    return local.map((cell) => ({
        x: piece.x + (cell.x - minX),
        y: piece.y + (cell.y - minY),
    }))
}
