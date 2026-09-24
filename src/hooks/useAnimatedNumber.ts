import { useEffect, useRef, useState } from 'react'
import { animateNumber } from '@src/utils/animateNumber'
import { Easing } from '@src/utils/bezier'

type DurationOption = number | ((from: number, to: number) => number)

type Options = {
    /** Длительность анимации в мс или функция от текущего и целевого значения */
    duration?: DurationOption
    /** Пауза перед стартом анимации, мс */
    delay?: number
    /** Easing по прогрессу [0, 1] → [0, 1] */
    easing?: (t: number) => number
    /** Округлять до целого (для счётчиков) */
    round?: boolean
    /** Сразу установить target без анимации (прерывание) */
    immediate?: boolean
}

function resolveDuration(duration: DurationOption, from: number, to: number): number {
    return typeof duration === 'function' ? duration(from, to) : duration
}

/**
 * Плавно дотягивает отображаемое число до `target` по кривой easing.
 */
export function useAnimatedNumber(target: number, options: Options = {}): number {
    const {
        duration = 500,
        delay = 0,
        easing = Easing.easeOut,
        round = true,
        immediate = false,
    } = options

    const [value, setValue] = useState(target)
    const valueRef = useRef(target)
    const fromRef = useRef(target)
    const toRef = useRef(target)
    const durationMsRef = useRef(500)
    const startTimeRef = useRef<number | null>(null)
    const rafRef = useRef(0)
    const delayTimerRef = useRef(0)

    const durationRef = useRef(duration)
    const delayRef = useRef(delay)
    const easingRef = useRef(easing)
    const roundRef = useRef(round)
    durationRef.current = duration
    delayRef.current = delay
    easingRef.current = easing
    roundRef.current = round

    useEffect(() => {
        const stopChase = () => {
            cancelAnimationFrame(rafRef.current)
            window.clearTimeout(delayTimerRef.current)
            delayTimerRef.current = 0
            startTimeRef.current = null
        }

        if (immediate) {
            stopChase()
            fromRef.current = target
            toRef.current = target
            valueRef.current = target
            setValue(target)
            return
        }

        if (target === toRef.current && startTimeRef.current === null && delayTimerRef.current === 0) {
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

        stopChase()

        const startChase = () => {
            delayTimerRef.current = 0
            rafRef.current = requestAnimationFrame(tick)
        }

        if (delayRef.current > 0) {
            delayTimerRef.current = window.setTimeout(startChase, delayRef.current)
        } else {
            startChase()
        }

        return () => {
            stopChase()
        }
    }, [target, immediate])

    return value
}
