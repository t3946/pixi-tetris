import { ClearEffect } from '@src/tetris/clear/ClearEffect'
import type { ClearApi, Monomino } from '@src/tetris/clear/types'
import type { MonominoView } from '@src/tetris/clear/monominoViewRegistry'
import { Easing } from '@src/utils/bezier'

const SHRINK_MS = 200

function animateScale(
    view: MonominoView,
    from: number,
    to: number,
    durationMs: number,
): Promise<void> {
    if (durationMs <= 0) {
        view.setScale(to)
        return Promise.resolve()
    }

    const ease = Easing.easeIn

    return new Promise((resolve) => {
        const start = performance.now()

        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / durationMs)
            const value = from + (to - from) * ease(t)
            view.setScale(value)
            // Лёгкий fade вместе со shrink — читаемее на быстрых итерациях.
            view.setAlpha(value)

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
 * Схлопывание к центру (scale 1 → 0) → clearCell.
 * Если спрайта нет — мгновенно чистит клетку.
 */
export class ShrinkClearEffect extends ClearEffect {
    async apply(monomino: Monomino, api: ClearApi): Promise<void> {
        const view = api.getView(monomino.x, monomino.y)

        if (!view) {
            api.clearCell(monomino.x, monomino.y)
            return
        }

        await animateScale(view, view.getScale(), 0, SHRINK_MS)
        api.clearCell(monomino.x, monomino.y)
    }
}
