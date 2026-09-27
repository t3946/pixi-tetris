import { useEffect, useState } from 'react'

/** Базовый отступ, если устройство без выреза / status bar inset = 0 */
export const SAFE_AREA_TOP_BASE_PX = 16

const PROBE_STYLE = [
    'position: fixed',
    'visibility: hidden',
    'pointer-events: none',
    `padding-top: calc(${SAFE_AREA_TOP_BASE_PX}px + env(safe-area-inset-top, 0px))`,
].join(';')

/**
 * Высота верхнего отступа: 16px + env(safe-area-inset-top).
 * В CSS-пикселях — совместимо с Pixi autoDensity layout.
 */
export function useSafeAreaTop(): number {
    const [top, setTop] = useState(SAFE_AREA_TOP_BASE_PX)

    useEffect(() => {
        const probe = document.createElement('div')
        probe.setAttribute('aria-hidden', 'true')
        probe.style.cssText = PROBE_STYLE
        document.body.appendChild(probe)

        const measure = () => {
            const value = parseFloat(getComputedStyle(probe).paddingTop)
            setTop(Number.isFinite(value) ? value : SAFE_AREA_TOP_BASE_PX)
        }

        measure()
        window.addEventListener('resize', measure)
        window.visualViewport?.addEventListener('resize', measure)

        return () => {
            window.removeEventListener('resize', measure)
            window.visualViewport?.removeEventListener('resize', measure)
            probe.remove()
        }
    }, [])

    return top
}
