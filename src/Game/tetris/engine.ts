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
import { getGameThemeTetrominoColor } from '@components/GameThemes/GameTheme.ts'
import { getLevelConfig, MIN_LEVEL } from './constants'

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
    /** Текущий уровень (1…10); fallStep / lockDelay / maxResets — из LEVEL_CONFIGS. */
    level: number
    /** Индексы полных рядов, ждущих визуальной очистки. Пока не пусто — фигура не спавнится. */
    pendingClearLines: number[]
    /** Оставшееся время до фиксации (мс); null — фигура в воздухе. */
    lockRemainingMs: number | null
    /** Сколько раз уже сбрасывали таймер move/rotate на текущем «потолке» опоры. */
    lockResets: number
    /** Максимальный Y фигуры с момента спавна (Step Reset при новом полу). */
    lockFloorY: number | null
}

export type CreateGameOptions = {
    /** Стартовый уровень (1…10). */
    level?: number
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

function resolveLevel(level?: number): number {
    return getLevelConfig(level ?? MIN_LEVEL).level
}

function idleLockFields(): Pick<GameState, 'lockRemainingMs' | 'lockResets' | 'lockFloorY'> {
    return {
        lockRemainingMs: null,
        lockResets: 0,
        lockFloorY: null,
    }
}

export function createEmptyBoard(rows: number, cols: number): Board {
    return Array.from({ length: rows }, () => Array(cols).fill(0))
}

export function createInitialState(
    rows: number,
    cols: number,
    options?: CreateGameOptions,
): GameState {
    const board = createEmptyBoard(rows, cols)
    const level = resolveLevel(options?.level)
    const firstType = randomPieceType()
    const { piece, nextType, nextCellColors } = spawnFromQueue(
        board,
        cols,
        firstType,
        rollThemeColors(firstType),
    )

    const base: GameState = {
        board,
        piece,
        nextType,
        nextCellColors,
        gameOver: piece === null,
        paused: false,
        linesCleared: 0,
        score: 0,
        level,
        pendingClearLines: [],
        ...idleLockFields(),
    }

    if (!piece) {
        return base
    }

    return syncLockState(base, piece, { didMoveOrRotate: false }, cols)
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
        level: MIN_LEVEL,
        pendingClearLines: [],
        ...idleLockFields(),
    }
}

/**
 * Меняет уровень (параметры из LEVEL_CONFIGS).
 * Текущий таймер на опоре поджимается под новый lockDelay.
 */
export function setLevel(state: GameState, level: number): GameState {
    const nextLevel = resolveLevel(level)

    if (nextLevel === state.level) {
        return state
    }

    const { lockDelay } = getLevelConfig(nextLevel)
    let lockRemainingMs = state.lockRemainingMs
    if (lockRemainingMs !== null) {
        lockRemainingMs = Math.min(lockRemainingMs, lockDelay)
    }

    return {
        ...state,
        level: nextLevel,
        lockRemainingMs,
    }
}

function rollThemeColors(type: PieceType): number[] {
    const count = countShapeCells(type)
    const gameThemeColor = getGameThemeTetrominoColor(type)

    if (gameThemeColor !== null) {
        return Array.from({ length: count }, () => gameThemeColor)
    }

    const theme = getActiveBlockTheme()

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

/** Фигура не может сдвинуться вниз — стоит на опоре. */
export function isGrounded(piece: ActivePiece, board: Board): boolean {
    return movePiece(piece, board, 0, 1) === null
}

function pieceEquals(a: ActivePiece, b: ActivePiece): boolean {
    return a.x === b.x && a.y === b.y && a.rotation === b.rotation && a.type === b.type
}

/**
 * Синхронизирует Lock Delay после изменения позиции фигуры.
 * — В воздухе: таймер сброшен (null), floorY/resets сохраняются до Step Reset.
 * — На опоре: старт/перезапуск таймера; Move Reset при сдвиге/повороте; Step Reset при новом Y.
 * — lockDelay === 0: мгновенная фиксация на опоре.
 */
function syncLockState(
    state: GameState,
    piece: ActivePiece,
    meta: { didMoveOrRotate: boolean },
    cols: number,
): GameState {
    const grounded = isGrounded(piece, state.board)
    const prevFloorY = state.lockFloorY
    const floorY = prevFloorY === null ? piece.y : Math.max(prevFloorY, piece.y)
    const steppedToNewFloor = prevFloorY !== null && piece.y > prevFloorY

    if (!grounded) {
        return {
            ...state,
            piece,
            lockRemainingMs: null,
            lockFloorY: floorY,
        }
    }

    const { lockDelay, maxResets } = getLevelConfig(state.level)

    if (lockDelay <= 0) {
        return settlePiece({ ...state, piece, ...idleLockFields() }, cols)
    }

    let lockResets = state.lockResets
    let lockRemainingMs = state.lockRemainingMs

    if (steppedToNewFloor) {
        // Step Reset — новый «пол», счётчик сбросов обнуляется
        lockResets = 0
        lockRemainingMs = lockDelay
    } else if (lockRemainingMs === null) {
        // Только что коснулись опоры
        lockRemainingMs = lockDelay
    } else if (meta.didMoveOrRotate && lockResets < maxResets) {
        // Move Reset — успешный сдвиг/поворот продлевает окно
        lockResets += 1
        lockRemainingMs = lockDelay
    }

    return {
        ...state,
        piece,
        lockRemainingMs,
        lockResets,
        lockFloorY: floorY,
    }
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

        const spawned: GameState = {
            ...state,
            board: lockedBoard,
            piece,
            nextType,
            nextCellColors,
            gameOver: piece === null,
            pendingClearLines: [],
            ...idleLockFields(),
        }

        if (!piece) {
            return spawned
        }

        return syncLockState(spawned, piece, { didMoveOrRotate: false }, cols)
    }

    return {
        ...state,
        board: lockedBoard,
        piece: null,
        pendingClearLines,
        ...idleLockFields(),
    }
}

/** Гравитация, очки и спавн следующей фигуры после визуальной очистки. */
export function completeLineClear(
    state: GameState,
    cols: number,
    options?: { awardScore?: boolean },
): GameState {
    const lines = state.pendingClearLines

    if (lines.length === 0) {
        return state
    }

    const awardScore = options?.awardScore !== false
    const board = removeLines(state.board, lines)
    const { piece, nextType, nextCellColors } = spawnFromQueue(
        board,
        cols,
        state.nextType,
        state.nextCellColors,
    )

    const next: GameState = {
        ...state,
        board,
        piece,
        nextType,
        nextCellColors,
        gameOver: piece === null,
        pendingClearLines: [],
        linesCleared: awardScore ? state.linesCleared + lines.length : state.linesCleared,
        score: awardScore ? state.score + scoreForClearedLines(lines.length) : state.score,
        ...idleLockFields(),
    }

    if (!piece) {
        return next
    }

    return syncLockState(next, piece, { didMoveOrRotate: false }, cols)
}

/** Число нижних рядов, уничтожаемых при продолжении после game over (реклама). */
export const CONTINUE_CLEAR_ROWS = 5

/**
 * Продолжение после «Игра окончена»: снимает game over и ставит в очередь
 * очистку нижних рядов (эффект + гравитация — через обычный clear-пайплайн).
 */
export function continueAfterAd(state: GameState): GameState {
    if (!state.gameOver) {
        return state
    }

    const rows = state.board.length
    const clearCount = Math.min(CONTINUE_CLEAR_ROWS, rows)
    const pendingClearLines = Array.from(
        { length: clearCount },
        (_, index) => rows - clearCount + index,
    )

    return {
        ...state,
        gameOver: false,
        paused: false,
        piece: null,
        pendingClearLines,
        ...idleLockFields(),
    }
}

/**
 * Тик гравитации: шаг вниз, либо (если уже на опоре) только синхронизация lock.
 * Фиксация по истечении таймера — через advanceLockDelay.
 */
export function tick(state: GameState, cols: number): GameState {
    if (state.gameOver || state.paused || isSettling(state) || !state.piece) {
        return state
    }

    const movedPiece = movePiece(state.piece, state.board, 0, 1)

    if (movedPiece) {
        return syncLockState(state, movedPiece, { didMoveOrRotate: false }, cols)
    }

    return syncLockState(state, state.piece, { didMoveOrRotate: false }, cols)
}

/**
 * Непрерывное истечение Lock Delay (вызывать каждый кадр с deltaMS).
 * Когда таймер доходит до 0 — фигура фиксируется.
 */
export function advanceLockDelay(state: GameState, deltaMs: number, cols: number): GameState {
    if (
        state.gameOver ||
        state.paused ||
        isSettling(state) ||
        !state.piece ||
        state.lockRemainingMs === null ||
        deltaMs <= 0
    ) {
        return state
    }

    const remaining = state.lockRemainingMs - deltaMs

    if (remaining > 0) {
        return { ...state, lockRemainingMs: remaining }
    }

    return settlePiece({ ...state, lockRemainingMs: 0 }, cols)
}

export function moveHorizontal(state: GameState, direction: -1 | 1, cols: number): GameState {
    if (state.gameOver || state.paused || isSettling(state) || !state.piece) {
        return state
    }

    const movedPiece = movePiece(state.piece, state.board, direction, 0)

    if (!movedPiece) {
        return state
    }

    return syncLockState(state, movedPiece, { didMoveOrRotate: true }, cols)
}

export function moveDown(state: GameState, cols: number): GameState {
    if (state.gameOver || state.paused || isSettling(state) || !state.piece) {
        return state
    }

    const movedPiece = movePiece(state.piece, state.board, 0, 1)

    if (movedPiece) {
        return syncLockState(state, movedPiece, { didMoveOrRotate: false }, cols)
    }

    // Soft drop на опоре не форсит lock — ждём Lock Delay
    return syncLockState(state, state.piece, { didMoveOrRotate: false }, cols)
}

export function rotate(state: GameState, cols: number): GameState {
    if (state.gameOver || state.paused || isSettling(state) || !state.piece) {
        return state
    }

    const rotated = rotatePiece(state.piece, state.board)

    if (pieceEquals(rotated, state.piece)) {
        return state
    }

    return syncLockState(state, rotated, { didMoveOrRotate: true }, cols)
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

    return settlePiece(
        {
            ...state,
            piece: getGhostPiece(state.piece, state.board),
            ...idleLockFields(),
        },
        cols,
    )
}

/** Принудительно завершает партию (цель миссии и т.п.). */
export function endGame(state: GameState): GameState {
    if (state.gameOver) {
        return state
    }

    return {
        ...state,
        gameOver: true,
        paused: false,
        pendingClearLines: [],
        ...idleLockFields(),
    }
}

/** Переключает паузу (повторное нажатие снимает паузу) */
export function togglePause(state: GameState): GameState {
    if (state.gameOver || isSettling(state)) {
        return state
    }

    return { ...state, paused: !state.paused }
}

export function restart(
    rows: number,
    cols: number,
    options?: CreateGameOptions,
): GameState {
    return createInitialState(rows, cols, options)
}
