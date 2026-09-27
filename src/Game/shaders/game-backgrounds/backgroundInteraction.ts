import { Easing } from '@src/utils/bezier'

/** Импульс интерактивного фона при очистке ряда: 0 → 1 → 0 (длительность/easing задаются при тике). */

export const LINE_CLEAR_PULSE_MS = 1000

export type LineClearPulseEasing = 'easeIn' | 'easeInOut'

/** Infinity = импульс не активен */
let elapsedMs = Number.POSITIVE_INFINITY

/** Запустить (или перезапустить) импульс. */
export function triggerBackgroundLineClearPulse(): void {
    elapsedMs = 0
}

function resolveEasing(name: LineClearPulseEasing = 'easeIn'): (t: number) => number {
    return name === 'easeInOut' ? Easing.easeInOut : Easing.easeIn
}

/**
 * Продвинуть импульс на `deltaMs` и вернуть коэффициент [0, 1]
 * (треугольник 0→1→0 с выбранным easing).
 */
export function tickLineClearPulse(
    deltaMs: number,
    durationMs: number = LINE_CLEAR_PULSE_MS,
    easingName: LineClearPulseEasing = 'easeIn',
): number {
    const duration = durationMs > 0 ? durationMs : LINE_CLEAR_PULSE_MS

    if (!Number.isFinite(elapsedMs) || elapsedMs >= duration) {
        elapsedMs = Number.POSITIVE_INFINITY
        return 0
    }

    elapsedMs = Math.min(duration, elapsedMs + Math.max(0, deltaMs))
    if (elapsedMs >= duration) {
        elapsedMs = Number.POSITIVE_INFINITY
        return 0
    }

    const u = elapsedMs / duration
    const linear = u <= 0.5 ? u * 2 : 2 - u * 2

    return resolveEasing(easingName)(linear)
}
