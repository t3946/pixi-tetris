import type { EPieceType } from '@src/tetris/blocks/themes'
import type { ActiveFigure } from './ActiveFigure'
import { builderFigure } from './BuilderFigure'

const ACTIVE_FIGURES: readonly ActiveFigure[] = [builderFigure]

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

/** Случайная активная фигура из зарегистрированных. */
export function pickRandomActiveFigureType(): EPieceType {
    const list = ACTIVE_FIGURES
    return list[Math.floor(Math.random() * list.length)].type
}

/** Шанс заменить обычный спавн активной фигурой (в любом режиме). */
export const ACTIVE_FIGURE_SPAWN_CHANCE = 0.03
