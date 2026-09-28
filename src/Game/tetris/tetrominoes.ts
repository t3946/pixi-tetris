import { EPieceType } from '@src/tetris/blocks/themes'
import {
    ACTIVE_FIGURE_SPAWN_CHANCE,
    getActiveFigure,
    pickRandomActiveFigureType,
} from '@src/tetris/activeFigures'

export type PieceType = EPieceType

export type ActivePiece = {
    type: PieceType
    rotation: number
    x: number
    y: number
    /** Цвет первой клетки — для ghost и запасной tint. */
    color: number
    /** Цвет каждой заполненной клетки в порядке обхода текущего shape. */
    cellColors: number[]
}

type TetrominoDefinition = {
    color: number
    shapes: number[][][]
}

/** Классические тетромино (режим «Легко» и база для остальных). */
export const CLASSIC_PIECE_TYPES: PieceType[] = [
    EPieceType.I,
    EPieceType.O,
    EPieceType.T,
    EPieceType.S,
    EPieceType.Z,
    EPieceType.J,
    EPieceType.L,
]

/** Все фигуры, включая пентамино. */
export const PIECE_TYPES: PieceType[] = [
    ...CLASSIC_PIECE_TYPES,
    EPieceType.X,
    EPieceType.V,
    EPieceType.W,
]

/** Пул = классика + дополнительные фигуры (пентамино в «Средне»). */
export function pieceBagWithExtras(extras: readonly PieceType[] = []): PieceType[] {
    if (extras.length === 0) {
        return [...CLASSIC_PIECE_TYPES]
    }

    return [...CLASSIC_PIECE_TYPES, ...extras]
}

export const TETROMINOES: Record<PieceType, TetrominoDefinition> = {
    I: {
        color: 0x00f0f0,
        shapes: [
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
            ],
            [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
            ],
        ],
    },
    O: {
        color: 0xf0f000,
        shapes: [
            [
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
        ],
    },
    T: {
        color: 0xa000f0,
        shapes: [
            [
                [0, 1, 0, 0],
                [1, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 0, 0, 0],
                [1, 1, 1, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0],
            ],
        ],
    },
    S: {
        color: 0x00f000,
        shapes: [
            [
                [0, 1, 1, 0],
                [1, 1, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [1, 1, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [1, 0, 0, 0],
                [1, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0],
            ],
        ],
    },
    Z: {
        color: 0xf00000,
        shapes: [
            [
                [1, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 0, 1, 0],
                [0, 1, 1, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 0, 0, 0],
                [1, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 1, 0, 0],
                [1, 1, 0, 0],
                [1, 0, 0, 0],
                [0, 0, 0, 0],
            ],
        ],
    },
    J: {
        color: 0x0000f0,
        shapes: [
            [
                [1, 0, 0, 0],
                [1, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 1, 1, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 0, 0, 0],
                [1, 1, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 0, 0, 0],
            ],
        ],
    },
    L: {
        color: 0xf0a000,
        shapes: [
            [
                [0, 0, 1, 0],
                [1, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0],
            ],
            [
                [0, 0, 0, 0],
                [1, 1, 1, 0],
                [1, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            [
                [1, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0],
            ],
        ],
    },
    X: {
        color: 0xf050c8,
        shapes: [
            [
                [0, 1, 0],
                [1, 1, 1],
                [0, 1, 0],
            ],
        ],
    },
    V: {
        color: 0x80d0ff,
        shapes: [
            [
                [1, 0, 0],
                [1, 0, 0],
                [1, 1, 1],
            ],
            [
                [1, 1, 1],
                [1, 0, 0],
                [1, 0, 0],
            ],
            [
                [1, 1, 1],
                [0, 0, 1],
                [0, 0, 1],
            ],
            [
                [0, 0, 1],
                [0, 0, 1],
                [1, 1, 1],
            ],
        ],
    },
    W: {
        color: 0xd07040,
        shapes: [
            [
                [1, 0, 0],
                [1, 1, 0],
                [0, 1, 1],
            ],
            [
                [0, 1, 1],
                [1, 1, 0],
                [1, 0, 0],
            ],
            [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 1],
            ],
            [
                [0, 0, 1],
                [0, 1, 1],
                [1, 1, 0],
            ],
        ],
    },
    Builder: (() => {
        const figure = getActiveFigure(EPieceType.Builder)
        if (!figure) {
            throw new Error('Builder active figure is not registered')
        }
        return figure.toTetrominoDefinition()
    })(),
}

export function randomPieceType(bag: readonly PieceType[] = CLASSIC_PIECE_TYPES): PieceType {
    if (Math.random() < ACTIVE_FIGURE_SPAWN_CHANCE) {
        return pickRandomActiveFigureType()
    }

    const pool = bag.length > 0 ? bag : CLASSIC_PIECE_TYPES

    return pool[Math.floor(Math.random() * pool.length)]
}

export function countShapeCells(type: PieceType, rotation = 0): number {
    const { shapes } = TETROMINOES[type]
    const shape = shapes[rotation % shapes.length]
    let count = 0

    for (const row of shape) {
        for (const cell of row) {
            if (cell) {
                count += 1
            }
        }
    }

    return count
}

export function createPiece(type: PieceType, cols: number, cellColors: number[]): ActivePiece {
    const shapeWidth = TETROMINOES[type].shapes[0][0]?.length ?? 4

    return {
        type,
        rotation: 0,
        x: Math.floor((cols - shapeWidth) / 2),
        y: 0,
        color: cellColors[0] ?? 0,
        cellColors,
    }
}

export function getPieceCells(piece: ActivePiece): { x: number; y: number; color: number }[] {
    const { shapes } = TETROMINOES[piece.type]
    const shape = shapes[piece.rotation % shapes.length]
    const cells: { x: number; y: number; color: number }[] = []
    let colorIndex = 0

    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                cells.push({
                    x: piece.x + col,
                    y: piece.y + row,
                    color: piece.cellColors[colorIndex] ?? piece.color,
                })
                colorIndex += 1
            }
        }
    }

    return cells
}

/** Клетки фигуры в локальных координатах (для превью следующей детали) */
export function getShapeLocalCells(
    type: PieceType,
    rotation = 0,
    color: number | readonly number[] = TETROMINOES[type].color,
): { x: number; y: number; color: number }[] {
    const { shapes } = TETROMINOES[type]
    const shape = shapes[rotation % shapes.length]
    const cells: { x: number; y: number; color: number }[] = []
    const palette = typeof color === 'number' ? null : color
    const fallback = typeof color === 'number' ? color : (color[0] ?? TETROMINOES[type].color)
    let colorIndex = 0

    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                cells.push({
                    x: col,
                    y: row,
                    color: palette?.[colorIndex] ?? fallback,
                })
                colorIndex += 1
            }
        }
    }

    return cells
}
