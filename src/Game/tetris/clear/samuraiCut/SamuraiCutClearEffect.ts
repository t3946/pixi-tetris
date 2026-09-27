import { ClearEffect } from '@src/tetris/clear/ClearEffect'
import type { ClearApi, Monomino } from '@src/tetris/clear/types'

/**
 * Горизонтальный разрез «мечом»: две половинки падают вниз и исчезают → clearCell.
 */
export class SamuraiCutClearEffect extends ClearEffect {
    async apply(monomino: Monomino, api: ClearApi): Promise<void> {
        const view = api.getView(monomino.x, monomino.y)

        if (!view) {
            api.clearCell(monomino.x, monomino.y)
            return
        }

        const cutDone = view.samuraiCut()
        api.clearCell(monomino.x, monomino.y)
        await cutDone
    }
}
