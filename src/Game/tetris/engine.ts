import {
    ActivePiece,
    CLASSIC_PIECE_TYPES,
    countShapeCells,
    createPiece,
    getPieceCells,
    randomPieceType,
    TETROMINOES,
    type PieceType,
} from './tetrominoes'
import { getActiveBlockTheme } from './blocks/themes'
import { getActiveFigure, isActiveFigureType } from './activeFigures'
import {
    advanceProjectiles,
    createEmptyProjectiles,
    type FallingProjectile,
} from './projectiles'
import { getGameThemeTetrominoColor } from '@components/GameThemes/GameTheme.ts'
import { getLevelConfig, MIN_LEVEL } from './constants'

export type Board = number[][]
export type { FallingProjectile }

export type GameState = {
    board: Board
    piece: ActivePiece | null
    /** Тип следующей фигуры (показывается в превью) */
    nextType: PieceType
    /** Цвета клеток следующей фигуры, выбранные темой при постановке в очередь */
    nextCellColors: number[]
    /** Скрыть превью «Далее» (иконка «?» вместо фигуры). */
    nextPreviewHidden: boolean
    gameOver: boolean
    paused: boolean
    linesCleared: number
    score: number
    /** Текущий уровень (1…10); fallStep / lockDelay / maxResets — из LEVEL_CONFIGS. */
    level: number
    /** Пул фигур для случайного спавна (классика ± пентамино). */
    pieceBag: readonly PieceType[]
    /** Индексы полных рядов, ждущих визуальной очистки. Пока не пусто — фигура не спавнится. */
    pendingClearLines: number[]
    /** Оставшееся время до фиксации (мс); null — фигура в воздухе. */
    lockRemainingMs: number | null
    /** Сколько раз уже сбрасывали таймер move/rotate на текущем «потолке» опоры. */
    lockResets: number
    /** Максимальный Y фигуры с момента спавна (Step Reset при новом полу). */
    lockFloorY: number | null
    /** Снаряды активных фигур (Строитель и т.п.). */
    projectiles: FallingProjectile[]
    /** performance.now() последнего выстрела активной фигуры; null — ещё не стреляли. */
    activeShotAtMs: number | null
    /**
     * Маркер очистки от снаряда: после completeLineClear вернуть/сдвинуть эту фигуру,
     * не беря следующую из очереди. Во время анимации `piece` остаётся на поле.
     */
    stashedPiece: ActivePiece | null
}

export type CreateGameOptions = {
    /** Стартовый уровень (1…10). */
    level?: number
    /** Пул фигур; по умолчанию только классические тетромино. */
    pieceBag?: readonly PieceType[]
    /** Заполнить нижние N рядов случайным хламом (без полных линий). */
    garbageRows?: number
}

/** Очки за очистку: Single / Double / Triple / Tetris */
const LINE_CLEAR_SCORES = [0, 100, 300, 500, 1200] as const

/** Вероятность скрыть превью следующей фигуры. */
const NEXT_PREVIEW_HIDDEN_CHANCE = 0.3

function rollNextPreviewHidden(): boolean {
    return Math.random() < NEXT_PREVIEW_HIDDEN_CHANCE
}

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

function randomGarbageColor(): number {
    const type = CLASSIC_PIECE_TYPES[Math.floor(Math.random() * CLASSIC_PIECE_TYPES.length)]

    return rollThemeColors(type)[0] ?? TETROMINOES[type].color
}

/**
 * Засыпает нижние `garbageRows` рядов случайными клетками.
 * В каждом ряде остаётся минимум одна дырка — полных линий нет.
 */
export function fillBottomGarbage(board: Board, garbageRows: number): Board {
    if (garbageRows <= 0) {
        return board
    }

    const rows = board.length
    const cols = board[0]?.length ?? 0
    if (rows === 0 || cols === 0) {
        return board
    }

    const next = board.map((row) => [...row])
    const startY = Math.max(0, rows - garbageRows)

    for (let y = startY; y < rows; y++) {
        const depth = y - startY
        const span = Math.max(1, garbageRows - 1)
        // Ниже — плотнее (~0.5…0.75)
        const fillChance = 0.5 + (depth / span) * 0.25
        const occupied: boolean[] = Array.from({ length: cols }, () => Math.random() < fillChance)
        let filled = occupied.filter(Boolean).length

        if (filled === cols) {
            occupied[Math.floor(Math.random() * cols)] = false
            filled -= 1
        }

        // Верхние ряды хлама могут быть почти пустыми — на дне хоть немного клеток
        if (filled === 0 && depth >= Math.floor(garbageRows / 2)) {
            const holes = 1 + Math.floor(Math.random() * 2)
            const emptySlots = Array.from({ length: cols }, (_, x) => x)
            for (let i = emptySlots.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1))
                ;[emptySlots[i], emptySlots[j]] = [emptySlots[j], emptySlots[i]]
            }
            for (let i = 0; i < cols - holes; i++) {
                occupied[emptySlots[i]] = true
            }
        }

        for (let x = 0; x < cols; x++) {
            next[y][x] = occupied[x] ? randomGarbageColor() : 0
        }
    }

    return next
}

export function createInitialState(
    rows: number,
    cols: number,
    options?: CreateGameOptions,
): GameState {
    const board = fillBottomGarbage(createEmptyBoard(rows, cols), options?.garbageRows ?? 0)
    const level = resolveLevel(options?.level)
    const pieceBag = options?.pieceBag ?? CLASSIC_PIECE_TYPES
    const firstType = randomPieceType(pieceBag)
    const { piece, nextType, nextCellColors, nextPreviewHidden } = spawnFromQueue(
        board,
        cols,
        firstType,
        rollThemeColors(firstType),
        pieceBag,
    )

    const base: GameState = {
        board,
        piece,
        nextType,
        nextCellColors,
        nextPreviewHidden,
        gameOver: piece === null,
        paused: false,
        linesCleared: 0,
        score: 0,
        level,
        pieceBag,
        pendingClearLines: [],
        projectiles: createEmptyProjectiles(),
        activeShotAtMs: null,
        stashedPiece: null,
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
        nextType: randomPieceType(CLASSIC_PIECE_TYPES),
        nextCellColors: [],
        nextPreviewHidden: false,
        gameOver: false,
        paused: true,
        linesCleared: 0,
        score: 0,
        level: MIN_LEVEL,
        pieceBag: CLASSIC_PIECE_TYPES,
        pendingClearLines: [],
        projectiles: createEmptyProjectiles(),
        activeShotAtMs: null,
        stashedPiece: null,
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
    const activeFigure = getActiveFigure(type)

    if (activeFigure) {
        return Array.from({ length: count }, () => activeFigure.color)
    }

    const gameThemeColor = getGameThemeTetrominoColor(type)

    if (gameThemeColor !== null) {
        return Array.from({ length: count }, () => gameThemeColor)
    }

    const theme = getActiveBlockTheme()

    return Array.from({ length: count }, () => theme.getMaterial(type).color)
}

/**
 * Берёт фигуру типа `type` как текущую и сразу готовит случайную следующую.
 * Если обычная фигура не влезает — piece = null (game over).
 * Активные фигуры (Строитель и т.п.) блоков не оставляют: при нехватке места
 * пропускаются, берётся следующая из очереди.
 */
function spawnFromQueue(
    board: Board,
    cols: number,
    type: PieceType,
    cellColors: number[],
    pieceBag: readonly PieceType[] = CLASSIC_PIECE_TYPES,
    depth = 0,
): {
    piece: ActivePiece | null
    nextType: PieceType
    nextCellColors: number[]
    nextPreviewHidden: boolean
} {
    const nextType = randomPieceType(pieceBag)
    const nextCellColors = rollThemeColors(nextType)
    const nextPreviewHidden = rollNextPreviewHidden()

    // Защита от бесконечного пропуска активных фигур
    if (depth > 24) {
        return { piece: null, nextType, nextCellColors, nextPreviewHidden }
    }

    const piece = createPiece(type, cols, cellColors)

    if (isValidPosition(piece, board)) {
        return { piece, nextType, nextCellColors, nextPreviewHidden }
    }

    if (isActiveFigureType(type)) {
        return spawnFromQueue(board, cols, nextType, nextCellColors, pieceBag, depth + 1)
    }

    return { piece: null, nextType, nextCellColors, nextPreviewHidden }
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
    const activeFigure = getActiveFigure(piece.type)
    if (activeFigure && !activeFigure.leavesMonominoes) {
        return board.map((row) => [...row])
    }

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
        const { piece, nextType, nextCellColors, nextPreviewHidden } = spawnFromQueue(
            lockedBoard,
            cols,
            state.nextType,
            state.nextCellColors,
            state.pieceBag,
        )

        const spawned: GameState = {
            ...state,
            board: lockedBoard,
            piece,
            nextType,
            nextCellColors,
            nextPreviewHidden,
            gameOver: piece === null,
            pendingClearLines: [],
            stashedPiece: null,
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
        stashedPiece: null,
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
    const linesCleared = awardScore ? state.linesCleared + lines.length : state.linesCleared
    const score = awardScore ? state.score + scoreForClearedLines(lines.length) : state.score

    // Очистка от снаряда: вернуть текущую фигуру, очередь next не трогать
    if (state.stashedPiece) {
        const restored = adjustPieceAfterLineClear(state.stashedPiece, lines)

        if (isValidPosition(restored, board)) {
            const restoredState: GameState = {
                ...state,
                board,
                piece: restored,
                stashedPiece: null,
                pendingClearLines: [],
                linesCleared,
                score,
                ...idleLockFields(),
            }

            return syncLockState(restoredState, restored, { didMoveOrRotate: false }, cols)
        }
    }

    const { piece, nextType, nextCellColors, nextPreviewHidden } = spawnFromQueue(
        board,
        cols,
        state.nextType,
        state.nextCellColors,
        state.pieceBag,
    )

    const next: GameState = {
        ...state,
        board,
        piece,
        nextType,
        nextCellColors,
        nextPreviewHidden,
        gameOver: piece === null,
        pendingClearLines: [],
        stashedPiece: null,
        linesCleared,
        score,
        ...idleLockFields(),
    }

    if (!piece) {
        return next
    }

    return syncLockState(next, piece, { didMoveOrRotate: false }, cols)
}

/**
 * Сдвиг активной фигуры после removeLines:
 * newY = y - (очищено строго выше) + (всего очищено).
 */
function adjustPieceAfterLineClear(piece: ActivePiece, clearedLines: readonly number[]): ActivePiece {
    const clearedAbove = clearedLines.filter((line) => line < piece.y).length
    const newY = piece.y - clearedAbove + clearedLines.length

    if (newY === piece.y) {
        return piece
    }

    return { ...piece, y: newY }
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
        stashedPiece: null,
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

    const activeFigure = getActiveFigure(state.piece.type)
    if (activeFigure) {
        return activeFigure.activate(state, cols)
    }

    const rotated = rotatePiece(state.piece, state.board)

    if (pieceEquals(rotated, state.piece)) {
        return state
    }

    return syncLockState(state, rotated, { didMoveOrRotate: true }, cols)
}

/** Продвижение снарядов активных фигур (каждый кадр). */
export function tickProjectiles(state: GameState, deltaMs: number): GameState {
    if (
        state.gameOver ||
        state.paused ||
        isSettling(state) ||
        state.projectiles.length === 0 ||
        deltaMs <= 0
    ) {
        return state
    }

    const { board, projectiles } = advanceProjectiles(state.board, state.projectiles, deltaMs)

    if (board === state.board && projectiles === state.projectiles) {
        return state
    }

    if (board === state.board) {
        return { ...state, projectiles }
    }

    const pendingClearLines = findFullLines(board)

    if (pendingClearLines.length === 0) {
        return {
            ...state,
            board,
            projectiles,
        }
    }

    // Снаряд собрал ряд(ы) — clear-пайплайн; текущую фигуру оставляем видимой
    return {
        ...state,
        board,
        projectiles: createEmptyProjectiles(),
        stashedPiece: state.piece,
        pendingClearLines,
        ...idleLockFields(),
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
        projectiles: createEmptyProjectiles(),
        activeShotAtMs: null,
        stashedPiece: null,
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
