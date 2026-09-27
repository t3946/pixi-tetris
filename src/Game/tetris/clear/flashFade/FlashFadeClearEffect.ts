import { ClearEffect } from '@src/tetris/clear/ClearEffect'
import type { ClearApi, Monomino } from '@src/tetris/clear/types'
import type { MonominoView } from '@src/tetris/clear/monominoViewRegistry'
import { Easing } from '@src/utils/bezier'

const FLASH_MS = 70
const FADE_MS = 180
const FLASH_TINT = 0xffffff

function wait(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

function animateAlpha(view: MonominoView, from: number, to: number, durationMs: number): Promise<void> {
    if (durationMs <= 0) {
        view.setAlpha(to)
        return Promise.resolve()
    }

    const ease = Easing.easeOut

    return new Promise((resolve) => {
        const start = performance.now()

        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / durationMs)
            view.setAlpha(from + (to - from) * ease(t))

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
 * Вспышка белым → плавное затухание alpha → clearCell.
 * Если спрайта нет (view == null) — мгновенно чистит клетку.
 */
export class FlashFadeClearEffect extends ClearEffect {
    async apply(monomino: Monomino, api: ClearApi): Promise<void> {
        const view = api.getView(monomino.x, monomino.y)

        if (!view) {
            api.clearCell(monomino.x, monomino.y)
            return
        }

        view.setTint(FLASH_TINT)
        await wait(FLASH_MS)
        await animateAlpha(view, view.getAlpha(), 0, FADE_MS)
        api.clearCell(monomino.x, monomino.y)
    }
}
