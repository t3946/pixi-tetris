import { ClearEffect } from '@src/tetris/clear/ClearEffect'
import type { ClearApi, Monomino } from '@src/tetris/clear/types'

/** Мгновенное исчезновение клетки — как прежнее поведение очистки ряда. */
export class BaseClearEffect extends ClearEffect {
    apply(monomino: Monomino, api: ClearApi): void {
        api.clearCell(monomino.x, monomino.y)
    }
}
