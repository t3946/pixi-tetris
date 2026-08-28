import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { FillGradient, Graphics, type ColorSource, type FederatedPointerEvent } from 'pixi.js'
import type { LayoutStyles } from '@pixi/layout'
import type { LayoutContainer as LayoutContainerInstance } from '@pixi/layout/components'
import type { LayoutText as LayoutTextInstance } from '@pixi/layout/components'
import { useTheme } from '@src/ui/ThemeContext'
import { useAnimatedNumber } from '@src/hooks/useAnimatedNumber'
import { Color, type ColorInput } from '@src/utils/color'

type TBaseButtonCommon = {
    label: string
    onPress?: () => void
    disabled?: boolean
    textFill?: ColorSource
    textFillHover?: ColorSource
    /** Прозрачность кнопки в disabled-состоянии */
    disabledAlpha?: number
    appearance: LayoutStyles
    fontSize?: number
    layout?: LayoutStyles
}

export type TBaseButtonProps = TBaseButtonCommon &
    (
        | { accent: ColorInput; fill?: never; fillHover?: never }
        | { accent?: undefined; fill: ColorSource; fillHover: ColorSource }
    )

function getAccentGradientColors(accent: Color) {
    return {
        from: accent.clone().lighten(0.2),
        to: accent.clone().darken(0.7),
    }
}

function setRoundPixels(node: LayoutContainerInstance | LayoutTextInstance | null) {
    if (node && 'roundPixels' in node) {
        ;(node as { roundPixels: boolean }).roundPixels = true
    }
}

function resolveGraphicSize(value: LayoutStyles['width'] | LayoutStyles['height']): number {
    return typeof value === 'number' ? value : 0
}

/** Общая логика кнопок: клик, hover, disabled и подпись. Фон — плоский или градиент по accent. */
export function BaseButton({
    label,
    onPress,
    disabled = false,
    fill,
    fillHover,
    accent,
    textFill,
    textFillHover,
    disabledAlpha = 0.6,
    appearance,
    fontSize = 22,
    layout = {},
}: TBaseButtonProps) {
    const theme = useTheme()
    const [hovered, setHovered] = useState(false)
    const rootRef = useRef<LayoutContainerInstance>(null)
    const labelWrapRef = useRef<LayoutContainerInstance>(null)
    const labelRef = useRef<LayoutTextInstance>(null)
    const canPress = !disabled && onPress != null
    const targetAlpha = disabled ? disabledAlpha : 1
    const alpha = useAnimatedNumber(targetAlpha, { duration: 300, round: false })
    const useGradient = accent != null
    const labelFill = disabled
        ? (textFill ?? theme.TEXT_MUTED)
        : hovered
            ? (textFillHover ?? textFill ?? theme.UI.PANEL_LABEL)
            : (textFill ?? theme.UI.PANEL_LABEL)

    const accentHex = accent instanceof Color ? accent.toHex() : accent != null ? new Color(accent).toHex() : ''
    const accentColor = useMemo(
        () => (accent != null ? new Color(accent) : null),
        [accentHex],
    )

    const graphicWidth = resolveGraphicSize(appearance.width)
    const graphicHeight = resolveGraphicSize(appearance.height)
    const borderRadius = resolveGraphicSize(appearance.borderRadius)

    const gradient = useMemo(() => {
        if (!accentColor) {
            return null
        }

        const { from, to } = getAccentGradientColors(accentColor)

        return new FillGradient({
            type: 'linear',
            start: { x: 0, y: 0 },
            end: { x: 1, y: 1 },
            colorStops: [
                { offset: 0, color: from.rgb() },
                { offset: 1, color: to.rgb() },
            ],
            textureSpace: 'local',
        })
    }, [accentColor?.toHex()])

    useEffect(() => () => gradient?.destroy(), [gradient])

    useEffect(() => {
        setHovered(false)
    }, [label, disabled, onPress])

    useLayoutEffect(() => {
        if (!useGradient) {
            return
        }

        setRoundPixels(rootRef.current)
        setRoundPixels(labelWrapRef.current)
        setRoundPixels(labelRef.current)
    }, [useGradient, label, labelFill, fontSize])

    const handlePress = (event: FederatedPointerEvent) => {
        event.stopPropagation()
        onPress?.()
    }

    const drawFill = useCallback(
        (graphics: Graphics) => {
            if (!gradient) {
                return
            }

            graphics.clear()
            graphics.roundPixels = true
            graphics.roundRect(0, 0, graphicWidth, graphicHeight, borderRadius).fill(gradient)

            if (hovered && !disabled) {
                graphics
                    .roundRect(0, 0, graphicWidth, graphicHeight, borderRadius)
                    .fill({ color: 0xffffff, alpha: 0.08 })
            }
        },
        [borderRadius, disabled, gradient, graphicHeight, graphicWidth, hovered],
    )

    const labelNode = (
        <layoutText
            ref={labelRef}
            key={`${label}:${String(labelFill)}`}
            text={label}
            style={{
                fontFamily: theme.UI.FONT_FAMILY,
                fontSize: useGradient ? Math.round(fontSize) : fontSize,
                fill: labelFill,
                fontWeight: 'bold',
                align: 'center',
            }}
            layout={{
                objectFit: 'none',
                objectPosition: 'center',
            }}
            eventMode="none"
        />
    )

    return (
        <layoutContainer
            ref={rootRef}
            eventMode={disabled ? 'none' : 'static'}
            cursor={canPress ? 'pointer' : 'default'}
            alpha={alpha}
            onPointerTap={canPress ? handlePress : undefined}
            onPointerOver={() => {
                if (!disabled) {
                    setHovered(true)
                }
            }}
            onPointerOut={() => setHovered(false)}
            layout={{
                justifyContent: 'center',
                alignItems: 'center',
                overflow: useGradient ? 'hidden' : undefined,
                ...appearance,
                ...(useGradient
                    ? {}
                    : { backgroundColor: hovered && !disabled ? fillHover : fill }),
                ...layout,
            }}
        >
            {useGradient && <pixiGraphics draw={drawFill} eventMode="none" roundPixels={true} />}

            {useGradient ? (
                <layoutContainer
                    ref={labelWrapRef}
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
                    {labelNode}
                </layoutContainer>
            ) : (
                labelNode
            )}
        </layoutContainer>
    )
}
