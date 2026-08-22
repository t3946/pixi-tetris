import { useCallback, useEffect, useMemo, useState } from 'react'
import { FillGradient, Graphics, Texture } from 'pixi.js'
import type { IconName } from '@src/assets/icons'
import { loadIconTexture } from '@src/hooks/useIconTexture'
import { useTheme } from '@src/ui/ThemeContext'

type TProps = {
    icon: IconName
    size: number
    x?: number
    y?: number
    /** Прозрачность в обычном состоянии */
    alpha?: number
    /** Прозрачность при наведении (если не задана — остаётся alpha) */
    hoverAlpha?: number
    onPress?: () => void
}

export function ButtonCircle({
    icon,
    size,
    x = 0,
    y = 0,
    alpha = 1,
    hoverAlpha,
    onPress,
}: TProps) {
    const theme = useTheme()
    const iconSize = size * 0.6
    const radius = size / 2
    const [iconTexture, setIconTexture] = useState<Texture | null>(null)
    const [hovered, setHovered] = useState(false)

    const currentAlpha = hovered ? (hoverAlpha ?? alpha) : alpha

    const gradient = useMemo(
        () =>
            new FillGradient({
                type: 'linear',
                start: { x: 0, y: 0 },
                end: { x: 0, y: 1 },
                colorStops: [
                    { offset: 0, color: theme.UI.BUTTON_FILL_TOP },
                    { offset: 1, color: theme.UI.BUTTON_FILL_BOTTOM },
                ],
                textureSpace: 'local',
            }),
        [theme.UI.BUTTON_FILL_BOTTOM, theme.UI.BUTTON_FILL_TOP],
    )

    useEffect(() => () => gradient.destroy(), [gradient])

    useEffect(() => {
        let cancelled = false

        loadIconTexture(icon).then((texture) => {
            if (!cancelled) {
                setIconTexture(texture)
            }
        })

        return () => {
            cancelled = true
        }
    }, [icon])

    const drawButton = useCallback(
        (graphics: Graphics) => {
            graphics.clear()
            graphics
                .circle(radius, radius, radius - 1)
                .fill(gradient)
                .stroke({ width: 2, color: theme.UI.ACCENT, alpha: 0.9 })
        },
        [gradient, radius, theme.UI.ACCENT],
    )

    const iconLayout = useMemo(() => {
        if (!iconTexture) {
            return null
        }

        const frame = iconTexture.frame
        const aspect = frame.width / frame.height
        const width = aspect >= 1 ? iconSize : iconSize * aspect
        const height = aspect >= 1 ? iconSize / aspect : iconSize

        return {
            width,
            height,
            x: (size - width) / 2,
            y: (size - height) / 2,
        }
    }, [iconSize, iconTexture, size])

    return (
        <pixiContainer
            x={x}
            y={y}
            alpha={currentAlpha}
            eventMode="static"
            cursor="pointer"
            onPointerTap={onPress}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            roundPixels={true}
        >
            <pixiGraphics draw={drawButton} />
            {iconTexture && iconLayout && (
                <pixiSprite
                    texture={iconTexture}
                    width={iconLayout.width}
                    height={iconLayout.height}
                    x={iconLayout.x}
                    y={iconLayout.y}
                    tint={theme.UI.ICON}
                    eventMode="none"
                />
            )}
        </pixiContainer>
    )
}
