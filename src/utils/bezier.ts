/** Контрольные точки CSS-style cubic-bezier(x1, y1, x2, y2). */
export type BezierPoints = readonly [x1: number, y1: number, x2: number, y2: number]

function sampleCurve(a: number, b: number, t: number): number {
    // B(t) = 3(1-t)²t·a + 3(1-t)t²·b + t³
    return 3 * (1 - t) * (1 - t) * t * a + 3 * (1 - t) * t * t * b + t * t * t
}

function sampleCurveDerivative(a: number, b: number, t: number): number {
    return 3 * (1 - t) * (1 - t) * a + 6 * (1 - t) * t * (b - a) + 3 * t * t * (1 - b)
}

/**
 * Возвращает easing-функцию по кривой Безье (как CSS `cubic-bezier`).
 * Вход/выход в диапазоне [0, 1].
 */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
    return (t: number) => {
        if (t <= 0) return 0
        if (t >= 1) return 1

        let guess = t

        for (let i = 0; i < 8; i++) {
            const x = sampleCurve(x1, x2, guess) - t
            const dx = sampleCurveDerivative(x1, x2, guess)
            if (Math.abs(x) < 1e-6 || Math.abs(dx) < 1e-6) break
            guess -= x / dx
        }

        return sampleCurve(y1, y2, guess)
    }
}

/** Готовые кривые в стиле CSS. */
export const Easing = {
    linear: (t: number) => t,
    ease: cubicBezier(0.25, 0.1, 0.25, 1),
    easeIn: cubicBezier(0.42, 0, 1, 1),
    easeOut: cubicBezier(0, 0, 0.58, 1),
    easeInOut: cubicBezier(0.42, 0, 0.58, 1),
} as const
