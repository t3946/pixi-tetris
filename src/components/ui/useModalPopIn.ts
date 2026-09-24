import { useEffect, useState } from 'react'

/** Как .animate-pop-in в notes/RewardModalForGame-main */
const POP_IN_MS = 550
const BACKDROP_FADE_MS = 300
export const MODAL_BACKDROP_ALPHA = 0.55

type PanelPose = {
    y: number
    scale: number
    opacity: number
}

type Keyframe = {
    at: number
    y: number
    scale: number
    opacity: number
}

/** @keyframes pop-in: снизу + scale bounce */
const POP_IN: readonly Keyframe[] = [
    { at: 0, y: 40, scale: 0.5, opacity: 0 },
    { at: 0.7, y: -4, scale: 1.06, opacity: 1 },
    { at: 1, y: 0, scale: 1, opacity: 1 },
]

function lerp(from: number, to: number, t: number) {
    return from + (to - from) * t
}

function samplePanel(progress: number): PanelPose {
    const t = Math.min(1, Math.max(0, progress))
    if (t <= POP_IN[0].at) {
        return { y: POP_IN[0].y, scale: POP_IN[0].scale, opacity: POP_IN[0].opacity }
    }
    if (t >= POP_IN[POP_IN.length - 1].at) {
        const last = POP_IN[POP_IN.length - 1]
        return { y: last.y, scale: last.scale, opacity: last.opacity }
    }

    let index = 0
    while (index < POP_IN.length - 1 && POP_IN[index + 1].at < t) {
        index += 1
    }
    const from = POP_IN[index]
    const to = POP_IN[index + 1]
    const local = (t - from.at) / (to.at - from.at)

    return {
        y: lerp(from.y, to.y, local),
        scale: lerp(from.scale, to.scale, local),
        opacity: lerp(from.opacity, to.opacity, local),
    }
}

export type ModalPopIn = {
    panel: PanelPose
    backdropAlpha: number
}

/**
 * Появление модалки: панель всплывает снизу (pop-in), подложка плавно затемняется.
 */
export function useModalPopIn(): ModalPopIn {
    const [panel, setPanel] = useState<PanelPose>(() => samplePanel(0))
    const [backdropAlpha, setBackdropAlpha] = useState(0)

    useEffect(() => {
        let raf = 0
        const startedAt = performance.now()
        setPanel(samplePanel(0))
        setBackdropAlpha(0)

        const tick = (now: number) => {
            const elapsed = now - startedAt
            const panelProgress = Math.min(1, elapsed / POP_IN_MS)
            const backdropProgress = Math.min(1, elapsed / BACKDROP_FADE_MS)

            setPanel(samplePanel(panelProgress))
            setBackdropAlpha(MODAL_BACKDROP_ALPHA * backdropProgress)

            if (panelProgress < 1 || backdropProgress < 1) {
                raf = requestAnimationFrame(tick)
            }
        }

        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [])

    return { panel, backdropAlpha }
}
