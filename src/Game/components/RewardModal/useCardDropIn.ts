import { useEffect, useState } from 'react'
import { CARD_DROP_MS } from './constants'

export type CardDropPose = {
    y: number
    scale: number
    opacity: number
    /** Радианы */
    rotation: number
}

type Keyframe = {
    at: number
    y: number
    scale: number
    opacity: number
    rotateDeg: number
}

/** Как @keyframes coin-drop в notes/RewardModalForGame-main/src/index.css */
const COIN_DROP: readonly Keyframe[] = [
    { at: 0, y: -60, scale: 0.4, opacity: 0, rotateDeg: 0 },
    { at: 0.6, y: 6, scale: 1.1, opacity: 1, rotateDeg: 0 },
    { at: 0.8, y: -3, scale: 0.97, opacity: 1, rotateDeg: 0 },
    { at: 1, y: 0, scale: 1, opacity: 1, rotateDeg: 0 },
]

/** Как @keyframes gem-drop — то же + покачивание rotate */
const GEM_DROP: readonly Keyframe[] = [
    { at: 0, y: -60, scale: 0.4, opacity: 0, rotateDeg: -20 },
    { at: 0.6, y: 6, scale: 1.1, opacity: 1, rotateDeg: 5 },
    { at: 0.8, y: -3, scale: 0.97, opacity: 1, rotateDeg: -2 },
    { at: 1, y: 0, scale: 1, opacity: 1, rotateDeg: 0 },
]

function lerp(from: number, to: number, t: number) {
    return from + (to - from) * t
}

function poseFromKeyframe(frame: Keyframe): CardDropPose {
    return {
        y: frame.y,
        scale: frame.scale,
        opacity: frame.opacity,
        rotation: (frame.rotateDeg * Math.PI) / 180,
    }
}

function sampleKeyframes(frames: readonly Keyframe[], progress: number): CardDropPose {
    const t = Math.min(1, Math.max(0, progress))
    if (t <= frames[0].at) {
        return poseFromKeyframe(frames[0])
    }
    if (t >= frames[frames.length - 1].at) {
        return poseFromKeyframe(frames[frames.length - 1])
    }

    let index = 0
    while (index < frames.length - 1 && frames[index + 1].at < t) {
        index += 1
    }

    const from = frames[index]
    const to = frames[index + 1]
    const local = (t - from.at) / (to.at - from.at)

    return {
        y: lerp(from.y, to.y, local),
        scale: lerp(from.scale, to.scale, local),
        opacity: lerp(from.opacity, to.opacity, local),
        rotation: (lerp(from.rotateDeg, to.rotateDeg, local) * Math.PI) / 180,
    }
}

/**
 * Одноразовый drop-in карточки: до delay — поза 0% (прозрачная), затем 0→1 за durationMs.
 * fill-mode: both, как в CSS-референсе.
 */
export function useCardDropIn(variant: 'coin' | 'gem', delayMs: number): CardDropPose {
    const frames = variant === 'gem' ? GEM_DROP : COIN_DROP
    const [pose, setPose] = useState(() => poseFromKeyframe(frames[0]))

    useEffect(() => {
        const keys = variant === 'gem' ? GEM_DROP : COIN_DROP
        let raf = 0
        const startedAt = performance.now()
        const initial = poseFromKeyframe(keys[0])
        setPose(initial)

        const tick = (now: number) => {
            const elapsed = now - startedAt - delayMs
            if (elapsed < 0) {
                setPose(initial)
                raf = requestAnimationFrame(tick)
                return
            }

            const progress = Math.min(1, elapsed / CARD_DROP_MS)
            setPose(sampleKeyframes(keys, progress))
            if (progress < 1) {
                raf = requestAnimationFrame(tick)
            }
        }

        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [variant, delayMs])

    return pose
}
