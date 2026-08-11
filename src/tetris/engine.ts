import {
    ActivePiece,
    createPiece,
    getPieceCells,
    randomPieceType,
    TETROMINOES,
    type PieceType,
} from './tetrominoes'

export type Board = number[][]

export type GameState = {
    board: Board
    piece: ActivePiece | null
    /** Тип следующей фигуры (показывается в превью) */
    nextType: PieceType
    gameOver: boolean
    paused: boolean
    linesCleared: number
}

const WALL_KICK_OFFSETS = [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: -2, y: 0 },
    { x: 2, y: 0 },
    { x: 0, y: -1 },
]

export function createEmptyBoard(rows: number, cols: number): Board {
    return Array.from({ length: rows }, () => Array(cols).fill(0))
}

export function createInitialState(rows: number, cols: number): GameState {
    const board = createEmptyBoard(rows, cols)
    const { piece, nextType } = spawnFromQueue(board, cols, randomPieceType())

    return {
        board,
        piece,
        nextType,
        gameOver: piece === null,
        paused: false,
        linesCleared: 0,
    }
}

/**
 * Берёт фигуру типа `type` как текущую и сразу готовит случайную следующую.
 * Если текущая не влезает на поле — piece = null (game over).
 */
function spawnFromQueue(
    board: Board,
    cols: number,
    type: PieceType,
): { piece: ActivePiece | null; nextType: PieceType } {
    const piece = createPiece(type, cols)
    const nextType = randomPieceType()

    if (!isValidPosition(piece, board)) {
        return { piece: null, nextType }
    }

    return { piece, nextType }
}

export function isValidPosition(piece: ActivePiece, board: Board): boolean {
    const rows = board.length
    const cols = board[0]?.length ?? 0

    for (const cell of getPieceCells(piece)) {
        if (cell.x < 0 || cell.x >= cols || cell.y >= rows) {
            return false
        }

        if (cell.y >= 0 && board[cell.y][cell.x] !== 0) {
            return false
        }
    }

    return true
}

function lockPiece(piece: ActivePiece, board: Board): Board {
    const nextBoard = board.map((row) => [...row])

    for (const cell of getPieceCells(piece)) {
        if (cell.y >= 0 && cell.y < nextBoard.length && cell.x >= 0 && cell.x < nextBoard[0].length) {
            nextBoard[cell.y][cell.x] = cell.color
        }
    }

    return nextBoard
}

function clearFullLines(board: Board): { board: Board; cleared: number } {
    const rows = board.length
    const cols = board[0]?.length ?? 0
    const remainingRows = board.filter((row) => row.some((cell) => cell === 0))
    const cleared = rows - remainingRows.length

    while (remainingRows.length < rows) {
        remainingRows.unshift(Array(cols).fill(0))
    }

    return { board: remainingRows, cleared }
}

function movePiece(piece: ActivePiece, board: Board, dx: number, dy: number): ActivePiece | null {
    const movedPiece = { ...piece, x: piece.x + dx, y: piece.y + dy }

    return isValidPosition(movedPiece, board) ? movedPiece : null
}

function rotatePiece(piece: ActivePiece, board: Board): ActivePiece {
    const shapes = TETROMINOES[piece.type].shapes
    const nextRotation = (piece.rotation + 1) % shapes.length

    for (const offset of WALL_KICK_OFFSETS) {
        const rotatedPiece: ActivePiece = {
            ...piece,
            rotation: nextRotation,
            x: piece.x + offset.x,
            y: piece.y + offset.y,
        }

        if (isValidPosition(rotatedPiece, board)) {
            return rotatedPiece
        }
    }

    return piece
}

function settlePiece(state: GameState, cols: number): GameState {
    if (!state.piece) {
        return state
    }

    const lockedBoard = lockPiece(state.piece, state.board)
    const { board, cleared } = clearFullLines(lockedBoard)
    const { piece, nextType } = spawnFromQueue(board, cols, state.nextType)

    return {
        board,
        piece,
        nextType,
        gameOver: piece === null,
        paused: state.paused,
        linesCleared: state.linesCleared + cleared,
    }
}

export function tick(state: GameState, cols: number): GameState {
    if (state.gameOver || state.paused || !state.piece) {
        return state
    }

    const movedPiece = movePiece(state.piece, state.board, 0, 1)

    if (movedPiece) {
        return { ...state, piece: movedPiece }
    }

    return settlePiece(state, cols)
}

export function moveHorizontal(state: GameState, direction: -1 | 1): GameState {
    if (state.gameOver || state.paused || !state.piece) {
        return state
    }

    const movedPiece = movePiece(state.piece, state.board, direction, 0)

    return movedPiece ? { ...state, piece: movedPiece } : state
}

export function moveDown(state: GameState, cols: number): GameState {
    if (state.gameOver || state.paused || !state.piece) {
        return state
    }

    const movedPiece = movePiece(state.piece, state.board, 0, 1)

    if (movedPiece) {
        return { ...state, piece: movedPiece }
    }

    return settlePiece(state, cols)
}

export function rotate(state: GameState): GameState {
    if (state.gameOver || state.paused || !state.piece) {
        return state
    }

    return {
        ...state,
        piece: rotatePiece(state.piece, state.board),
    }
}

/** Мгновенно опускает фигуру до упора и фиксирует её на поле */
export function hardDrop(state: GameState, cols: number): GameState {
    if (state.gameOver || state.paused || !state.piece) {
        return state
    }

    let piece = state.piece
    let next = movePiece(piece, state.board, 0, 1)

    while (next) {
        piece = next
        next = movePiece(piece, state.board, 0, 1)
    }

    return settlePiece({ ...state, piece }, cols)
}

/** Переключает паузу (повторное нажатие снимает паузу) */
export function togglePause(state: GameState): GameState {
    if (state.gameOver) {
        return state
    }

    return { ...state, paused: !state.paused }
}

export function restart(rows: number, cols: number): GameState {
    return createInitialState(rows, cols)
}
