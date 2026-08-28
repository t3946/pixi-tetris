import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTick } from '@pixi/react'
import { BlurFilter, Container, FillGradient, Graphics, type Ticker } from 'pixi.js'
import { useTheme } from '@src/ui/ThemeContext'

type TProps = {
    width: number
    scale: number
    onPress: () => void
    label?: string
}

const GRADIENT_FROM = 'rgb(124, 58, 237)'
const GRADIENT_TO = 'rgb(157, 58, 232)'
const GLOW_COLOR = 'rgb(157, 58, 232)'
const GLOW_PADDING = 28
/** Полный цикл пульсации свечения, сек */
const GLOW_PULSE_PERIOD = 1.8
const GLOW_ALPHA_MIN = 0.28
const GLOW_ALPHA_MAX = 0.62

export function PlayButton({ width, scale, onPress, label = 'НАЧАТЬ' }: TProps) {
    const theme = useTheme()
    const [hovered, setHovered] = useState(false)
    const glowRef = useRef<Container>(null)
    const pulseTimeRef = useRef(0)

    const height = Math.round(56 * scale)
    const radius = Math.round(18 * scale)

    const gradient = useMemo(
        () =>
            new FillGradient({
                type: 'linear',
                // 135deg: сверху-слева → снизу-справа
                start: { x: 0, y: 0 },
                end: { x: 1, y: 1 },
                colorStops: [
                    { offset: 0, color: GRADIENT_FROM },
                    { offset: 1, color: GRADIENT_TO },
                ],
                textureSpace: 'local',
            }),
        [],
    )

    const blur = useMemo(() => {
        const filter = new BlurFilter({
            strength: 10,
            quality: 4,
            padding: GLOW_PADDING,
        })
        filter.padding = GLOW_PADDING
        return filter
    }, [])

    useEffect(
        () => () => {
            gradient.destroy()
            blur.destroy()
        },
        [blur, gradient],
    )

    useTick(
        useCallback(
            (ticker: Ticker) => {
                pulseTimeRef.current += ticker.deltaMS / 1000
                const t = (Math.sin((pulseTimeRef.current * Math.PI * 2) / GLOW_PULSE_PERIOD) + 1) / 2
                const base = GLOW_ALPHA_MIN + t * (GLOW_ALPHA_MAX - GLOW_ALPHA_MIN)
                if (glowRef.current) {
                    glowRef.current.alpha = hovered ? Math.min(1, base + 0.12) : base
                }
            },
            [hovered],
        ),
    )

    const drawGlow = useCallback(
        (graphics: Graphics) => {
            graphics.clear()
            graphics.roundRect(0, 0, width, height, radius).fill({ color: GLOW_COLOR })
        },
        [height, radius, width],
    )

    const drawFill = useCallback(
        (graphics: Graphics) => {
            graphics.clear()
            graphics.roundRect(0, 0, width, height, radius).fill(gradient)
            if (hovered) {
                graphics.roundRect(0, 0, width, height, radius).fill({ color: 0xffffff, alpha: 0.08 })
            }
        },
        [gradient, height, hovered, radius, width],
    )

    return (
        <layoutContainer
            eventMode="static"
            cursor="pointer"
            onPointerTap={onPress}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            layout={{
                width,
                height,
                flexShrink: 0,
                overflow: 'visible',
            }}
        >
            {/* Пульсирующее свечение */}
            <pixiContainer ref={glowRef} filters={[blur]} alpha={GLOW_ALPHA_MIN} eventMode="none">
                <pixiGraphics draw={drawGlow} />
            </pixiContainer>

            {/* Градиентная заливка */}
            <pixiGraphics draw={drawFill} eventMode="none" />

            {/* Подпись */}
            <layoutContainer
                eventMode="none"
                layout={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <layoutText
                    text={label}
                    style={{
                        fontFamily: theme.UI.FONT_FAMILY,
                        fontSize: Math.round(20 * scale),
                        fill: theme.TEXT_COLOR,
                        fontWeight: 'bold',
                        letterSpacing: 2,
                        align: 'center',
                    }}
                    layout={{ objectFit: 'none' }}
                    eventMode="none"
                    roundPixels={true}
                />
            </layoutContainer>
        </layoutContainer>
    )
}
