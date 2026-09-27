import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTick } from '@pixi/react'
import { CanvasTextMetrics, FillGradient, TextStyle, type Ticker } from 'pixi.js'
import { useTheme } from '@src/ui/ThemeContext'
import { TITLE_SHIMMER_COLORS, TITLE_SHIMMER_PERIOD_MS, TITLE_SHIMMER_SPAN } from './constants'

const TITLE = 'Уровень пройден!'
const FONT_SIZE = 28

export function RewardHeader() {
    const theme = useTheme()
    const phaseRef = useRef(0)
    const [shimmerKey, setShimmerKey] = useState(0)

    const fill = useMemo(
        () =>
            new FillGradient({
                type: 'linear',
                start: { x: 0, y: 0 },
                end: { x: TITLE_SHIMMER_SPAN, y: 0 },
                colorStops: TITLE_SHIMMER_COLORS.map((color, index) => ({
                    offset: index / (TITLE_SHIMMER_COLORS.length - 1),
                    color,
                })),
                textureSpace: 'local',
            }),
        [],
    )

    useEffect(() => () => fill.destroy(), [fill])

    useTick(
        useCallback(
            (ticker: Ticker) => {
                phaseRef.current = (phaseRef.current + ticker.deltaMS / TITLE_SHIMMER_PERIOD_MS) % 1
                // Одна волна проходит через заголовок за период
                const startX = -TITLE_SHIMMER_SPAN + phaseRef.current * (TITLE_SHIMMER_SPAN * 2)
                fill.start.x = startX
                fill.start.y = 0
                fill.end.x = startX + TITLE_SHIMMER_SPAN
                fill.end.y = 0
                fill._tick++
                setShimmerKey(fill._tick)
            },
            [fill],
        ),
    )

    const metrics = useMemo(() => {
        const measureStyle = new TextStyle({
            fontFamily: theme.UI.FONT_FAMILY,
            fontSize: FONT_SIZE,
            fontWeight: '800',
        })
        const measured = CanvasTextMetrics.measureText(TITLE, measureStyle)
        measureStyle.destroy()
        return {
            width: Math.ceil(measured.width),
            height: Math.ceil(measured.height),
        }
    }, [theme.UI.FONT_FAMILY])

    return (
        <layoutContainer
            layout={{
                width: metrics.width,
                height: metrics.height,
                flexShrink: 0,
                marginBottom: 23,
            }}
        >
            <pixiText
                key={shimmerKey}
                text={TITLE}
                style={{
                    fontFamily: theme.UI.FONT_FAMILY,
                    fontSize: FONT_SIZE,
                    fontWeight: '800',
                    fill,
                    align: 'center',
                }}
                anchor={0.5}
                x={metrics.width / 2}
                y={metrics.height / 2}
                eventMode="none"
                roundPixels={true}
            />
        </layoutContainer>
    )
}
