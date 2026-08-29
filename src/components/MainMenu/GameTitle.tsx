import { useEffect, useMemo } from 'react'
import { BlurFilter, CanvasTextMetrics, FillGradient, TextStyle } from 'pixi.js'
import { useTheme } from '@src/ui/ThemeContext'
import { destroyBlurFilter } from '@src/utils/destroyBlurFilter'

type TProps = {
    fontSize: number
}

const LINES = ['TET', 'BLAST'] as const
const GLOW_PADDING = 40

export function GameTitle({ fontSize }: TProps) {
    const theme = useTheme()
    const lineHeight = Math.round(fontSize * 1.1)
    const letterSpacing = fontSize * 0.08

    const fill = useMemo(
        () =>
            new FillGradient({
                type: 'linear',
                start: { x: 0, y: 0 },
                end: { x: 0, y: 1 },
                colorStops: [
                    { offset: 0, color: theme.MENU.TITLE_LIGHT },
                    { offset: 0.45, color: theme.MENU.TITLE_MID },
                    { offset: 1, color: theme.MENU.TITLE_DARK },
                ],
                textureSpace: 'local',
            }),
        [theme.MENU.TITLE_DARK, theme.MENU.TITLE_LIGHT, theme.MENU.TITLE_MID],
    )

    useEffect(() => () => fill.destroy(), [fill])

    const glowStyle = useMemo(
        () => ({
            fontFamily: theme.MENU.FONT_DISPLAY,
            fontSize,
            fontWeight: '900' as const,
            fill: theme.MENU.TITLE_MID,
            letterSpacing,
            align: 'center' as const,
        }),
        [fontSize, letterSpacing, theme.MENU.FONT_DISPLAY, theme.MENU.TITLE_MID],
    )

    const titleStyle = useMemo(
        () => ({
            fontFamily: theme.MENU.FONT_DISPLAY,
            fontSize,
            fontWeight: '900' as const,
            fill,
            letterSpacing,
            align: 'center' as const,
        }),
        [fill, fontSize, letterSpacing, theme.MENU.FONT_DISPLAY],
    )

    const lineWidth = useMemo(() => {
        const measureStyle = new TextStyle({
            fontFamily: theme.MENU.FONT_DISPLAY,
            fontSize,
            fontWeight: '900',
            letterSpacing,
        })
        const width = Math.ceil(
            Math.max(...LINES.map((line) => CanvasTextMetrics.measureText(line, measureStyle).width)),
        )
        measureStyle.destroy()
        return width
    }, [fontSize, letterSpacing, theme.MENU.FONT_DISPLAY])

    return (
        <layoutContainer
            layout={{
                flexShrink: 0,
                flexDirection: 'column',
                alignItems: 'center',
                overflow: 'visible',
            }}
        >
            {LINES.map((line) => (
                <TitleLine
                    key={line}
                    text={line}
                    width={lineWidth}
                    height={lineHeight}
                    glowStyle={glowStyle}
                    titleStyle={titleStyle}
                />
            ))}
        </layoutContainer>
    )
}

type TitleLineProps = {
    text: string
    width: number
    height: number
    glowStyle: {
        fontFamily: string
        fontSize: number
        fontWeight: '900'
        fill: string
        letterSpacing: number
        align: 'center'
    }
    titleStyle: {
        fontFamily: string
        fontSize: number
        fontWeight: '900'
        fill: FillGradient
        letterSpacing: number
        align: 'center'
    }
}

function TitleLine({ text, width, height, glowStyle, titleStyle }: TitleLineProps) {
    const blur = useMemo(() => {
        const filter = new BlurFilter({
            strength: 14,
            quality: 4,
            padding: GLOW_PADDING,
        })
        filter.padding = GLOW_PADDING
        return filter
    }, [])

    const filters = useMemo(() => [blur], [blur])

    useEffect(() => () => destroyBlurFilter(blur), [blur])

    return (
        <layoutContainer
            layout={{
                width,
                height,
                flexShrink: 0,
                overflow: 'visible',
            }}
        >
            <pixiContainer x={width / 2} y={height / 2} eventMode="none">
                <pixiText
                    text={text}
                    style={glowStyle}
                    anchor={0.5}
                    filters={filters}
                    eventMode="none"
                    alpha={0.45}
                    roundPixels={true}
                />
                <pixiText
                    text={text}
                    style={titleStyle}
                    anchor={0.5}
                    eventMode="none"
                    roundPixels={true}
                />
            </pixiContainer>
        </layoutContainer>
    )
}
