import { useCallback, useEffect, useMemo } from 'react'
import { Color, FillGradient, Graphics } from 'pixi.js'
import { useTheme } from '@src/ui/ThemeContext'
import { FallingTetrominoes } from './FallingTetrominoes'

type TProps = {
    width: number
    height: number
}

export function MenuAtmosphere({ width, height }: TProps) {
    const theme = useTheme()

    const bgGradient = useMemo(
        () =>
            new FillGradient({
                type: 'linear',
                start: { x: 0.35, y: 0 },
                end: { x: 0.65, y: 1 },
                colorStops: [
                    { offset: 0, color: theme.MENU.BG_TOP },
                    { offset: 0.4, color: theme.MENU.BG_MID },
                    { offset: 1, color: theme.MENU.BG_BOTTOM },
                ],
                textureSpace: 'local',
            }),
        [theme.MENU.BG_BOTTOM, theme.MENU.BG_MID, theme.MENU.BG_TOP],
    )

    const glowGradient = useMemo(() => {
        const rgb = new Color(theme.MENU.GLOW).toUint8RgbArray()
        const [r, g, b] = rgb

        return new FillGradient({
            type: 'radial',
            center: { x: 0.5, y: 0.5 },
            innerRadius: 0,
            outerCenter: { x: 0.5, y: 0.5 },
            outerRadius: 0.5,
            colorStops: [
                { offset: 0, color: `rgba(${r}, ${g}, ${b}, 0.22)` },
                { offset: 1, color: `rgba(${r}, ${g}, ${b}, 0)` },
            ],
            textureSpace: 'local',
        })
    }, [theme.MENU.GLOW])

    useEffect(() => () => bgGradient.destroy(), [bgGradient])
    useEffect(() => () => glowGradient.destroy(), [glowGradient])

    const drawBackground = useCallback(
        (graphics: Graphics) => {
            graphics.clear()
            graphics.rect(0, 0, width, height).fill(bgGradient)
        },
        [bgGradient, height, width],
    )

    const drawGlow = useCallback(
        (graphics: Graphics) => {
            graphics.clear()
            const radius = Math.min(width, height) * 0.42
            graphics.circle(width / 2, height * 0.3, radius).fill(glowGradient)
        },
        [glowGradient, height, width],
    )

    return (
        <pixiContainer eventMode="none">
            <pixiGraphics draw={drawBackground} />
            <pixiGraphics draw={drawGlow} />
            <FallingTetrominoes width={width} height={height} />
        </pixiContainer>
    )
}
