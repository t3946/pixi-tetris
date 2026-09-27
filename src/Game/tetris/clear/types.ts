import type { Board } from '@src/tetris/engine'
import type { MonominoView } from '@src/tetris/clear/monominoViewRegistry'

/** Одна клетка (мономино) на поле. */
export type Monomino = {
    x: number
    y: number
    color: number
}

/**
 * API, который эффект использует, чтобы менять поле / представление во время очистки.
 * Итератор передаёт его в ClearEffect.apply.
 */
export type ClearApi = {
    getBoard: () => Board
    /** Обнулить клетку и отразить изменение в состоянии игры. */
    clearCell: (x: number, y: number) => void
    /** Visual handle спрайта клетки (для анимаций эффекта). */
    getView: (x: number, y: number) => MonominoView | null
}
