import { fallIntervalMsForLevel, MAX_LEVEL } from './constants'
import { TETROMINOES, type ActivePiece } from './tetrominoes'

/** Очень светлый белый с зеленоватым оттенком / пастельный зелёный. */
export const SHELL_COLOR = 0xe8ffe6

/** Кулдаун выстрела Строителя. */
export const BUILDER_SHOT_COOLDOWN_MS = 500

/**
 * Шаг снаряда (мс на клетку): в 9 раз быстрее гравитации 10 уровня
 * (база ×1.5 от ур.10, затем ×3 и ещё ×2).
 */
export const SHELL_CELL_MS = fallIntervalMsForLevel(MAX_LEVEL) / 1.5 / 3 / 2

export type FallingProjectile = {
    id: number
    x: number
    /** Дробный ряд — плавное движение и шлейф. */
    y: number
    color: number
}

let nextProjectileId = 1

export function createEmptyProjectiles(): FallingProjectile[] {
    return []
}

/** Мерцание снаряда (как у активных фигур). */
export function getShellAlpha(elapsedMs: number): number {
    return 0.675 + 0.325 * Math.sin(elapsedMs * 0.01)
}

/**
 * Спавн снаряда по центру под фигурой.
 * @returns новый массив projectiles или null, если выстрел невозможен.
 */
export function trySpawnBuilderShell(
    piece: Pick<ActivePiece, 'type' | 'rotation' | 'x' | 'y'>,
    board: number[][],
    projectiles: readonly FallingProjectile[],
): FallingProjectile[] | null {
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

    // Уже за границей низа — некуда стрелять
    if (y >= rows) {
        return null
    }

    // Клетка занята — не спавним в занятую
    if (board[y][x] !== 0) {
        return null
    }

    const shell: FallingProjectile = {
        id: nextProjectileId++,
        x,
        y,
        color: SHELL_COLOR,
    }

    return [...projectiles, shell]
}

function placeMonomino(board: number[][], x: number, y: number, color: number): number[][] {
    const rows = board.length
    const cols = board[0]?.length ?? 0
    if (y < 0 || y >= rows || x < 0 || x >= cols) {
        return board.map((row) => [...row])
    }

    // Не затираем существующий блок — только пустая клетка
    if (board[y][x] !== 0) {
        return board.map((row) => [...row])
    }

    const next = board.map((row) => [...row])
    next[y][x] = color
    return next
}

/**
 * Двигает снаряды вниз.
 * При ударе о блок — новый мономино на клетке ВЫШЕ него;
 * при ударе о низ стакана — на нижней клетке колонки (если свободна).
 *
 * Важно: спрайт занимает [y, y+1), поэтому y не должен становиться > placeRow,
 * иначе на 1–2 кадра снаряд (и шлейф) рисуются поверх/под блоком удара.
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

        // Первое препятствие ниже текущей позиции (блок или низ стакана)
        let obstacleRow = rows
        const scanFrom = Math.max(0, Math.floor(shell.y) + 1)
        for (let row = scanFrom; row < rows; row++) {
            if (readBoard[row][shell.x] !== 0) {
                obstacleRow = row
                break
            }
        }

        const placeRow = obstacleRow - 1

        if (placeRow < 0) {
            // Некуда ставить (препятствие в самом верху)
            continue
        }

        // Достигли клетки посадки — ставим блок и убираем снаряд, без y > placeRow
        if (nextY > placeRow) {
            nextBoard = placeMonomino(nextBoard, shell.x, placeRow, shell.color)
            continue
        }

        surviving.push({ ...shell, y: nextY })
    }

    return { board: nextBoard, projectiles: surviving }
}
