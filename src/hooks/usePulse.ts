import { useEffect, useState } from 'react'

/**
 * Одноразовый «пульс» 0→1→0 по `generation` (увеличивай счётчик, чтобы запустить).
 * Пик в середине по sin(πt).
 */
export function usePulse(generation: number, durationMs: number): number {
    const [strength, setStrength] = useState(0)

    useEffect(() => {
        if (generation <= 0) {
            return
        }

        let raf = 0
        const start = performance.now()

        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / durationMs)
            setStrength(Math.sin(t * Math.PI))
            if (t < 1) {
                raf = requestAnimationFrame(tick)
            } else {
                setStrength(0)
            }
        }

        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [generation, durationMs])

    return strength
}
