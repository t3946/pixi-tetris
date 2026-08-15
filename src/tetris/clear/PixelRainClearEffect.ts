import { ClearEffect } from '@src/tetris/clear/ClearEffect'
import type { ClearApi, Monomino } from '@src/tetris/clear/types'

/**
 * Клетка рассыпается пикселями, падающими вниз с разной скоростью → clearCell.
 */
export class PixelRainClearEffect extends ClearEffect {
    async apply(monomino: Monomino, api: ClearApi): Promise<void> {
        const view = api.getView(monomino.x, monomino.y)

        if (!view) {
            api.clearCell(monomino.x, monomino.y)
            return
        }

        const rainDone = view.pixelRain()
        api.clearCell(monomino.x, monomino.y)
        await rainDone
    }
}
