import { ClearEffect } from '@src/tetris/clear/ClearEffect'
import type { ClearApi, Monomino } from '@src/tetris/clear/types'
import type { MonominoView } from '@src/tetris/clear/monominoViewRegistry'
import { Easing } from '@src/utils/bezier'
import { Color } from '@src/utils/color'
import {
    SPARKLE_FLASH_MS,
    SPARKLE_WHITE_BLEND,
} from '@src/tetris/clear/sparkle/sparkleSettings'

function animateTint(
    view: MonominoView,
    from: number,
    to: number,
    durationMs: number,
): Promise<void> {
    if (durationMs <= 0) {
        view.setTint(to)
        return Promise.resolve()
    }

    const ease = Easing.easeOut

    return new Promise((resolve) => {
        const start = performance.now()

        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / durationMs)
            view.setTint(Color.lerp(from, to, ease(t)).toNumber())

            if (t < 1) {
                requestAnimationFrame(tick)
            } else {
                resolve()
            }
        }

        requestAnimationFrame(tick)
    })
}

/**
 * Вспышка к белому на 80% → взрыв мелких белых блёсток → clearCell.
 */
export class SparkleClearEffect extends ClearEffect {
    async apply(monomino: Monomino, api: ClearApi): Promise<void> {
        const view = api.getView(monomino.x, monomino.y)

        if (!view) {
            api.clearCell(monomino.x, monomino.y)
            return
        }

        const fromTint = monomino.color
        const flashTint = new Color(fromTint).lighten(SPARKLE_WHITE_BLEND).toNumber()
        await animateTint(view, fromTint, flashTint, SPARKLE_FLASH_MS)

        const sparkleDone = view.sparkle()
        api.clearCell(monomino.x, monomino.y)
        await sparkleDone
    }
}
