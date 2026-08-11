import { useEffect, useRef, useState } from 'react'
import { animateNumber } from '@src/utils/animateNumber'
import { Easing } from '@src/utils/bezier'

type DurationOption = number | ((from: number, to: number) => number)

type Options = {
    /** Длительность анимации в мс или функция от текущего и целевого значения */
    duration?: DurationOption
    /** Easing по прогрессу [0, 1] → [0, 1] */
    easing?: (t: number) => number
    /** Округлять до целого (для счётчиков) */
    round?: boolean
}

function resolveDuration(duration: DurationOption, from: number, to: number): number {
    return typeof duration === 'function' ? duration(from, to) : duration
}

/**
 * Плавно дотягивает отображаемое число до `target` по кривой easing.
 */
export function useAnimatedNumber(target: number, options: Options = {}): number {
    const { duration = 500, easing = Easing.easeOut, round = true } = options

    const [value, setValue] = useState(target)
    const valueRef = useRef(target)
    const fromRef = useRef(target)
    const toRef = useRef(target)
    const durationMsRef = useRef(500)
    const startTimeRef = useRef<number | null>(null)
    const rafRef = useRef(0)

    const durationRef = useRef(duration)
    const easingRef = useRef(easing)
    const roundRef = useRef(round)
    durationRef.current = duration
    easingRef.current = easing
    roundRef.current = round

    useEffect(() => {
        if (target === toRef.current && startTimeRef.current === null) {
            return
        }

        fromRef.current = valueRef.current
        toRef.current = target
        durationMsRef.current = resolveDuration(durationRef.current, fromRef.current, target)
        startTimeRef.current = null

        const tick = (now: number) => {
            if (startTimeRef.current === null) {
                startTimeRef.current = now
            }

            const durationMs = durationMsRef.current
            const elapsed = now - startTimeRef.current
            const progress = durationMs <= 0 ? 1 : elapsed / durationMs
            const next = animateNumber(fromRef.current, toRef.current, progress, easingRef.current)
            const display = roundRef.current ? Math.round(next) : next

            valueRef.current = display
            setValue(display)

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(tick)
            } else {
                startTimeRef.current = null
                valueRef.current = toRef.current
                setValue(toRef.current)
            }
        }

        cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(tick)

        return () => cancelAnimationFrame(rafRef.current)
    }, [target])

    return value
}
