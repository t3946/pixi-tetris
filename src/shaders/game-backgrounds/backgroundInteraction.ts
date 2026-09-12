import { Easing } from '@src/utils/bezier'

/** Импульс интерактивного фона при очистке ряда: 0 → 1 → 0 за 1 с. */

export const LINE_CLEAR_PULSE_MS = 1000

let elapsedMs = LINE_CLEAR_PULSE_MS

/** Запустить (или перезапустить) импульс. */
export function triggerBackgroundLineClearPulse(): void {
    elapsedMs = 0
}

/**
 * Продвинуть импульс на `deltaMs` и вернуть коэффициент [0, 1]
 * (треугольник 0→1→0 с ease-in).
 */
export function tickLineClearPulse(deltaMs: number): number {
    if (elapsedMs >= LINE_CLEAR_PULSE_MS) {
        return 0
    }

    elapsedMs = Math.min(LINE_CLEAR_PULSE_MS, elapsedMs + Math.max(0, deltaMs))
    const u = elapsedMs / LINE_CLEAR_PULSE_MS
    const linear = u <= 0.5 ? u * 2 : 2 - u * 2

    return Easing.easeIn(linear)
}
