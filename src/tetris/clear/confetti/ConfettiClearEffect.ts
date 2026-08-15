import { ClearEffect } from '@src/tetris/clear/ClearEffect'
import type { ClearApi, Monomino } from '@src/tetris/clear/types'

/**
 * Мономино взрывается конфетти → clearCell.
 */
export class ConfettiClearEffect extends ClearEffect {
    async apply(monomino: Monomino, api: ClearApi): Promise<void> {
        const view = api.getView(monomino.x, monomino.y)

        if (!view) {
            api.clearCell(monomino.x, monomino.y)
            return
        }

        const burstDone = view.confetti()
        api.clearCell(monomino.x, monomino.y)
        await burstDone
    }
}
