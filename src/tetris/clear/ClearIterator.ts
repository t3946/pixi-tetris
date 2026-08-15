import type { Board } from '@src/tetris/engine'
import type { ClearEffect } from '@src/tetris/clear/ClearEffect'
import type { ClearApi } from '@src/tetris/clear/types'

/**
 * Абстрактный итератор очистки ряда.
 * Наследники задают порядок и тайминг обхода мономино и применяют к ним ClearEffect.
 */
export abstract class ClearIterator {
    abstract iterate(
        line: number,
        board: Board,
        effect: ClearEffect,
        api: ClearApi,
    ): void | Promise<void>
}
