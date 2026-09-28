import type { EPieceType } from '@src/tetris/blocks/themes'
import type { ActiveFigure } from './ActiveFigure'
import { builderFigure } from './BuilderFigure'
import { destroyerFigure } from './DestroyerFigure'

const ACTIVE_FIGURES: readonly ActiveFigure[] = [builderFigure, destroyerFigure]

const BY_TYPE = new Map<EPieceType, ActiveFigure>(
    ACTIVE_FIGURES.map((figure) => [figure.type, figure]),
)

export function getActiveFigure(type: EPieceType): ActiveFigure | undefined {
    return BY_TYPE.get(type)
}

export function isActiveFigureType(type: EPieceType): boolean {
    return BY_TYPE.has(type)
}

export function getAllActiveFigures(): readonly ActiveFigure[] {
    return ACTIVE_FIGURES
}

/**
 * Взвешенный ролл активной фигуры по `spawnChance`.
 * Порядок: накопление шансов; иначе null (обычный спавн).
 */
export function rollActiveFigureType(): EPieceType | null {
    const roll = Math.random()
    let acc = 0

    for (const figure of ACTIVE_FIGURES) {
        acc += figure.spawnChance
        if (roll < acc) {
            return figure.type
        }
    }

    return null
}

/** @deprecated используйте rollActiveFigureType */
export function pickRandomActiveFigureType(): EPieceType {
    return rollActiveFigureType() ?? ACTIVE_FIGURES[0].type
}

/** @deprecated сумма шансов больше не используется как единый ролл */
export const ACTIVE_FIGURE_SPAWN_CHANCE = ACTIVE_FIGURES.reduce(
    (sum, figure) => sum + figure.spawnChance,
    0,
)
