import { ClearEffect } from '@src/tetris/clear/ClearEffect'
import type { ClearApi, Monomino } from '@src/tetris/clear/types'

/**
 * Мономино распадается на 4–9 осколков с velocity/gravity → clearCell.
 * clearCell сразу после спавна осколков — чтобы не оставлять alpha=0 на reuseable спрайте.
 */
export class ShatterClearEffect extends ClearEffect {
    async apply(monomino: Monomino, api: ClearApi): Promise<void> {
        const view = api.getView(monomino.x, monomino.y)

        if (!view) {
            api.clearCell(monomino.x, monomino.y)
            return
        }

        // Сначала спавн осколков (координаты/tint читаются из живого спрайта),
        // затем сразу убираем клетку из board — unmount исходного Monomino.
        const shatterDone = view.shatter()
        api.clearCell(monomino.x, monomino.y)
        await shatterDone
    }
}
