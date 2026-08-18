import {
    ActivePiece,
    countShapeCells,
    createPiece,
    getPieceCells,
    randomPieceType,
    TETROMINOES,
    type PieceType,
} from './tetrominoes'
import { getActiveBlockTheme } from './blocks/themes'

export type Board = number[][]

export type GameState = {
    board: Board
    piece: ActivePiece | null
    /** Тип следующей фигуры (показывается в превью) */
    nextType: PieceType
    /** Цвета клеток следующей фигуры, выбранные темой при постановке в очередь */
    nextCellColors: number[]
    gameOver: boolean
    paused: boolean
    linesCleared: number
    score: number
    /** Индексы полных рядов, ждущих визуальной очистки. Пока не пусто — фигура не спавнится. */
    pendingClearLines: number[]
}

/** Очки за очистку: Single / Double / Triple / Tetris */
const LINE_CLEAR_SCORES = [0, 100, 300, 500, 1200] as const

export function scoreForClearedLines(cleared: number): number {
    if (cleared <= 0) {
        return 0
    }

    return LINE_CLEAR_SCORES[cleared] ?? LINE_CLEAR_SCORES[LINE_CLEAR_SCORES.length - 1]
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
    const firstType = randomPieceType()
    const { piece, nextType, nextCellColors } = spawnFromQueue(
        board,
        cols,
        firstType,
        rollThemeColors(firstType),
    )

    return {
        board,
        piece,
        nextType,
        nextCellColors,
        gameOver: piece === null,
        paused: false,
        linesCleared: 0,
        score: 0,
        pendingClearLines: [],
    }
}

/** Статичное поле без активной фигуры (песочница эффектов). */
export function createSandboxState(rows: number, cols: number): GameState {
    return {
        board: createEmptyBoard(rows, cols),
        piece: null,
        nextType: randomPieceType(),
        nextCellColors: [],
        gameOver: false,
        paused: true,
        linesCleared: 0,
        score: 0,
        pendingClearLines: [],
    }
}

function rollThemeColors(type: PieceType): number[] {
    const theme = getActiveBlockTheme()
    const count = countShapeCells(type)

    return Array.from({ length: count }, () => theme.getMaterial(type).color)
}

/**
 * Берёт фигуру типа `type` как текущую и сразу готовит случайную следующую.
 * Если текущая не влезает на поле — piece = null (game over).
 */
function spawnFromQueue(
    board: Board,
    cols: number,
    type: PieceType,
    cellColors: number[],
): { piece: ActivePiece | null; nextType: PieceType; nextCellColors: number[] } {
    const piece = createPiece(type, cols, cellColors)
    const nextType = randomPieceType()
    const nextCellColors = rollThemeColors(nextType)

    if (!isValidPosition(piece, board)) {
        return { piece: null, nextType, nextCellColors }
    }

    return { piece, nextType, nextCellColors }
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

/** Индексы полностью заполненных рядов (сверху вниз). */
export function findFullLines(board: Board): number[] {
    const lines: number[] = []

    for (let y = 0; y < board.length; y++) {
        const row = board[y]
        if (row.length > 0 && row.every((cell) => cell !== 0)) {
            lines.push(y)
        }
    }

    return lines
}

/** Удаляет указанные ряды и добавляет пустые сверху (блоки «падают»). */
export function removeLines(board: Board, lines: readonly number[]): Board {
    if (lines.length === 0) {
        return board.map((row) => [...row])
    }

    const lineSet = new Set(lines)
    const cols = board[0]?.length ?? 0
    const remainingRows = board.filter((_, index) => !lineSet.has(index))

    while (remainingRows.length < board.length) {
        remainingRows.unshift(Array(cols).fill(0))
    }

    return remainingRows
}

function isSettling(state: GameState): boolean {
    return state.pendingClearLines.length > 0
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
    const pendingClearLines = findFullLines(lockedBoard)

    if (pendingClearLines.length === 0) {
        const { piece, nextType, nextCellColors } = spawnFromQueue(
            lockedBoard,
            cols,
            state.nextType,
            state.nextCellColors,
        )

        return {
            ...state,
            board: lockedBoard,
            piece,
            nextType,
            nextCellColors,
            gameOver: piece === null,
            pendingClearLines: [],
        }
    }

    return {
        ...state,
        board: lockedBoard,
        piece: null,
        pendingClearLines,
    }
}

/** Гравитация, очки и спавн следующей фигуры после визуальной очистки. */
export function completeLineClear(state: GameState, cols: number): GameState {
    const lines = state.pendingClearLines

    if (lines.length === 0) {
        return state
    }

    const board = removeLines(state.board, lines)
    const { piece, nextType, nextCellColors } = spawnFromQueue(
        board,
        cols,
        state.nextType,
        state.nextCellColors,
    )

    return {
        ...state,
        board,
        piece,
        nextType,
        nextCellColors,
        gameOver: piece === null,
        pendingClearLines: [],
        linesCleared: state.linesCleared + lines.length,
        score: state.score + scoreForClearedLines(lines.length),
    }
}

export function tick(state: GameState, cols: number): GameState {
    if (state.gameOver || state.paused || isSettling(state) || !state.piece) {
        return state
    }

    const movedPiece = movePiece(state.piece, state.board, 0, 1)

    if (movedPiece) {
        return { ...state, piece: movedPiece }
    }

    return settlePiece(state, cols)
}

export function moveHorizontal(state: GameState, direction: -1 | 1): GameState {
    if (state.gameOver || state.paused || isSettling(state) || !state.piece) {
        return state
    }

    const movedPiece = movePiece(state.piece, state.board, direction, 0)

    return movedPiece ? { ...state, piece: movedPiece } : state
}

export function moveDown(state: GameState, cols: number): GameState {
    if (state.gameOver || state.paused || isSettling(state) || !state.piece) {
        return state
    }

    const movedPiece = movePiece(state.piece, state.board, 0, 1)

    if (movedPiece) {
        return { ...state, piece: movedPiece }
    }

    return settlePiece(state, cols)
}

export function rotate(state: GameState): GameState {
    if (state.gameOver || state.paused || isSettling(state) || !state.piece) {
        return state
    }

    return {
        ...state,
        piece: rotatePiece(state.piece, state.board),
    }
}

/** Фигура в клетке, куда она упадёт (shadow / ghost). Поворот и форма те же. */
export function getGhostPiece(piece: ActivePiece, board: Board): ActivePiece {
    let ghost = piece
    let next = movePiece(ghost, board, 0, 1)

    while (next) {
        ghost = next
        next = movePiece(ghost, board, 0, 1)
    }

    return ghost
}

/** Мгновенно опускает фигуру до упора и фиксирует её на поле */
export function hardDrop(state: GameState, cols: number): GameState {
    if (state.gameOver || state.paused || isSettling(state) || !state.piece) {
        return state
    }

    return settlePiece({ ...state, piece: getGhostPiece(state.piece, state.board) }, cols)
}

/** Переключает паузу (повторное нажатие снимает паузу) */
export function togglePause(state: GameState): GameState {
    if (state.gameOver || isSettling(state)) {
        return state
    }

    return { ...state, paused: !state.paused }
}

export function restart(rows: number, cols: number): GameState {
    return createInitialState(rows, cols)
}
