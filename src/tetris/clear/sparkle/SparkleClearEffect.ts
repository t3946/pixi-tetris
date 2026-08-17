import { ClearEffect } from '@src/tetris/clear/ClearEffect'
import type { ClearApi, Monomino } from '@src/tetris/clear/types'
import type { MonominoView } from '@src/tetris/clear/monominoViewRegistry'
import { Easing } from '@src/utils/bezier'
import {
    SPARKLE_FLASH_MS,
    SPARKLE_WHITE_BLEND,
} from '@src/tetris/clear/sparkle/sparkleSettings'

function blendTowardWhite(color: number, amount: number): number {
    const r = (color >> 16) & 0xff
    const g = (color >> 8) & 0xff
    const b = color & 0xff

    const nr = Math.round(r + (255 - r) * amount)
    const ng = Math.round(g + (255 - g) * amount)
    const nb = Math.round(b + (255 - b) * amount)

    return (nr << 16) | (ng << 8) | nb
}

function channel(color: number, shift: number): number {
    return (color >> shift) & 0xff
}

function lerpColor(from: number, to: number, t: number): number {
    const r = Math.round(channel(from, 16) + (channel(to, 16) - channel(from, 16)) * t)
    const g = Math.round(channel(from, 8) + (channel(to, 8) - channel(from, 8)) * t)
    const b = Math.round(channel(from, 0) + (channel(to, 0) - channel(from, 0)) * t)
    return (r << 16) | (g << 8) | b
}

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
            view.setTint(lerpColor(from, to, ease(t)))

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
        const flashTint = blendTowardWhite(fromTint, SPARKLE_WHITE_BLEND)
        await animateTint(view, fromTint, flashTint, SPARKLE_FLASH_MS)

        const sparkleDone = view.sparkle()
        api.clearCell(monomino.x, monomino.y)
        await sparkleDone
    }
}
