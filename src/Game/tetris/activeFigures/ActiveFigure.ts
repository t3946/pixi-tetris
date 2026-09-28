import type { EPieceType } from '@src/tetris/blocks/themes'

/**
 * Особый класс падающих фигур:
 * — не оставляют мономино на поле (доходят до низа и исчезают);
 * — не поворачиваются;
 * — вместо поворота могут выполнять активное действие.
 */
export abstract class ActiveFigure {
    abstract readonly type: EPieceType
    /** Фиксированный цвет (не зависит от Block / Game Theme). */
    abstract readonly color: number
    /** Единственная ориентация матрицы 0/1. */
    abstract readonly shape: number[][]
    /** Шанс появления вместо обычной фигуры (0…1), независимый вес в общем ролле. */
    abstract readonly spawnChance: number

    readonly leavesMonominoes = false

    /** Вместо rotate. По умолчанию — no-op. */
    activate<TState>(state: TState, _cols: number): TState {
        return state
    }

    /** Прозрачность клетки (1 = без анимации). */
    getAlpha(_elapsedMs: number): number {
        return 1
    }

    toTetrominoDefinition(): { color: number; shapes: number[][][] } {
        return {
            color: this.color,
            shapes: [this.shape],
        }
    }
}
