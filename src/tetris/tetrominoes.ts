export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'

export type ActivePiece = {
    type: PieceType
    rotation: number
    x: number
    y: number
}

type TetrominoDefinition = {
    color: number
    shapes: number[][][]
}

export const PIECE_TYPES: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L']

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
}

export function randomPieceType(): PieceType {
    return PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)]
}

export function createPiece(type: PieceType, cols: number): ActivePiece {
    return {
        type,
        rotation: 0,
        x: Math.floor((cols - 4) / 2),
        y: 0,
    }
}

export function getPieceCells(piece: ActivePiece): { x: number; y: number; color: number }[] {
    const { color, shapes } = TETROMINOES[piece.type]
    const shape = shapes[piece.rotation % shapes.length]
    const cells: { x: number; y: number; color: number }[] = []

    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                cells.push({
                    x: piece.x + col,
                    y: piece.y + row,
                    color,
                })
            }
        }
    }

    return cells
}
