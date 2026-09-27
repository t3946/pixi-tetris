/**
 * Интерполяция числа от `from` к `to` по прогрессу [0, 1] и easing-кривой.
 */
export function animateNumber(
    from: number,
    to: number,
    progress: number,
    easing: (t: number) => number = (t) => t,
): number {
    const t = Math.min(1, Math.max(0, progress))
    return from + (to - from) * easing(t)
}
