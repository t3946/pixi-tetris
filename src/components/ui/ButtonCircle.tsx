import { useCallback, useEffect, useMemo, useState } from 'react'
import { Assets, FillGradient, Graphics, Texture } from 'pixi.js'
import { icons, type IconName } from '@src/assets/icons'

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

const BORDER_COLOR = 0xffffff

export function ButtonCircle({
    icon,
    size,
    x = 0,
    y = 0,
    alpha = 1,
    hoverAlpha,
    onPress,
}: TProps) {
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
                    { offset: 0, color: 0x6b7c8d },
                    { offset: 1, color: 0x2c3642 },
                ],
                textureSpace: 'local',
            }),
        [],
    )

    useEffect(() => () => gradient.destroy(), [gradient])

    useEffect(() => {
        let cancelled = false

        Assets.load<Texture>(icons[icon]).then((texture) => {
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
                .stroke({ width: 2, color: BORDER_COLOR, alpha: 0.9  })
        },
        [gradient, radius],
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
        >
            <pixiGraphics draw={drawButton} />
            {iconTexture && iconLayout && (
                <pixiSprite
                    texture={iconTexture}
                    width={iconLayout.width}
                    height={iconLayout.height}
                    x={iconLayout.x}
                    y={iconLayout.y}
                    eventMode="none"
                />
            )}
        </pixiContainer>
    )
}
