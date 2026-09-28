import { fallIntervalMsForLevel, MAX_LEVEL } from './constants'
import { TETROMINOES, type ActivePiece } from './tetrominoes'

/** Пастельный зелёный снаряд Строителя. */
export const BUILDER_SHELL_COLOR = 0xe8ffe6

/** Пастельный красный снаряд Разрушителя. */
export const DESTROYER_SHELL_COLOR = 0xffe6e8

/** @deprecated используйте BUILDER_SHELL_COLOR */
export const SHELL_COLOR = BUILDER_SHELL_COLOR

/** Кулдаун выстрела активных фигур (Строитель / Разрушитель). */
export const ACTIVE_SHOT_COOLDOWN_MS = 500

/** @deprecated используйте ACTIVE_SHOT_COOLDOWN_MS */
export const BUILDER_SHOT_COOLDOWN_MS = ACTIVE_SHOT_COOLDOWN_MS

/**
 * Шаг снаряда (мс на клетку): в 9 раз быстрее гравитации 10 уровня
 * (база ×1.5 от ур.10, затем ×3 и ещё ×2).
 */
export const SHELL_CELL_MS = fallIntervalMsForLevel(MAX_LEVEL) / 1.5 / 3 / 2

export type ProjectileMode = 'build' | 'destroy'

export type FallingProjectile = {
    id: number
    x: number
    /** Дробный ряд — плавное движение и шлейф. */
    y: number
    color: number
    mode: ProjectileMode
}

let nextProjectileId = 1

export function createEmptyProjectiles(): FallingProjectile[] {
    return []
}

/** Мерцание снаряда (как у активных фигур). */
export function getShellAlpha(elapsedMs: number): number {
    return 0.675 + 0.325 * Math.sin(elapsedMs * 0.01)
}

export type SpawnShellOptions = {
    piece: Pick<ActivePiece, 'type' | 'rotation' | 'x' | 'y'>
    board: number[][]
    projectiles: readonly FallingProjectile[]
    color: number
    mode: ProjectileMode
}

/**
 * Спавн снаряда по центру под фигурой.
 * @returns новый массив projectiles или null, если выстрел невозможен.
 */
export function trySpawnShell(options: SpawnShellOptions): FallingProjectile[] | null {
    const { piece, board, projectiles, color, mode } = options
    const shapes = TETROMINOES[piece.type].shapes
    const shape = shapes[piece.rotation % shapes.length]
    const width = shape[0]?.length ?? 1
    const height = shape.length
    const x = piece.x + Math.floor(width / 2)
    const y = piece.y + height
    const rows = board.length
    const cols = board[0]?.length ?? 0

    if (x < 0 || x >= cols || y < 0) {
        return null
    }

    if (y >= rows) {
        return null
    }

    if (board[y][x] !== 0) {
        return null
    }

    const shell: FallingProjectile = {
        id: nextProjectileId++,
        x,
        y,
        color,
        mode,
    }

    return [...projectiles, shell]
}

/** @deprecated используйте trySpawnShell */
export function trySpawnBuilderShell(
    piece: Pick<ActivePiece, 'type' | 'rotation' | 'x' | 'y'>,
    board: number[][],
    projectiles: readonly FallingProjectile[],
): FallingProjectile[] | null {
    return trySpawnShell({
        piece,
        board,
        projectiles,
        color: BUILDER_SHELL_COLOR,
        mode: 'build',
    })
}

function placeMonomino(board: number[][], x: number, y: number, color: number): number[][] {
    const rows = board.length
    const cols = board[0]?.length ?? 0
    if (y < 0 || y >= rows || x < 0 || x >= cols) {
        return board.map((row) => [...row])
    }

    if (board[y][x] !== 0) {
        return board.map((row) => [...row])
    }

    const next = board.map((row) => [...row])
    next[y][x] = color
    return next
}

function clearMonomino(board: number[][], x: number, y: number): number[][] {
    const rows = board.length
    const cols = board[0]?.length ?? 0
    if (y < 0 || y >= rows || x < 0 || x >= cols) {
        return board.map((row) => [...row])
    }

    if (board[y][x] === 0) {
        return board.map((row) => [...row])
    }

    const next = board.map((row) => [...row])
    next[y][x] = 0
    return next
}

/**
 * Двигает снаряды вниз.
 * build — новый мономино на клетке ВЫШЕ препятствия;
 * destroy — удаляет 1×1 клетку препятствия.
 *
 * Спрайт занимает [y, y+1). Нельзя допускать y больше клетки удара/посадки,
 * иначе на 1–2 кадра снаряд (и шлейф) рисуются под/поверх блока.
 * — build: стоп на placeRow = obstacle − 1
 * — destroy: стоп на самой клетке obstacle (не заезжая ниже неё)
 */
export function advanceProjectiles(
    board: number[][],
    projectiles: readonly FallingProjectile[],
    deltaMs: number,
): { board: number[][]; projectiles: FallingProjectile[] } {
    if (projectiles.length === 0 || deltaMs <= 0) {
        return {
            board,
            projectiles: projectiles as FallingProjectile[],
        }
    }

    const rows = board.length
    const speed = 1 / SHELL_CELL_MS
    let nextBoard = board
    const surviving: FallingProjectile[] = []

    for (const shell of projectiles) {
        const nextY = shell.y + speed * deltaMs
        const readBoard = nextBoard === board ? board : nextBoard

        let obstacleRow = rows
        const scanFrom = Math.max(0, Math.floor(shell.y) + 1)
        for (let row = scanFrom; row < rows; row++) {
            if (readBoard[row][shell.x] !== 0) {
                obstacleRow = row
                break
            }
        }

        if (shell.mode === 'destroy') {
            // Пустая колонка до низа — просто исчезаем, не заезжая за низ
            if (obstacleRow >= rows) {
                if (nextY > rows - 1) {
                    continue
                }
                surviving.push({ ...shell, y: nextY })
                continue
            }

            // Удар о блок: не заезжаем ниже целевой клетки
            if (nextY > obstacleRow) {
                nextBoard = clearMonomino(nextBoard, shell.x, obstacleRow)
                continue
            }

            surviving.push({ ...shell, y: nextY })
            continue
        }

        // build
        const placeRow = obstacleRow - 1

        if (placeRow < 0) {
            continue
        }

        if (nextY > placeRow) {
            nextBoard = placeMonomino(nextBoard, shell.x, placeRow, shell.color)
            continue
        }

        surviving.push({ ...shell, y: nextY })
    }

    return { board: nextBoard, projectiles: surviving }
}
