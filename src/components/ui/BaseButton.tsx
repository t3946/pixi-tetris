import { useState } from 'react'
import type { ColorSource } from 'pixi.js'
import type { LayoutStyles } from '@pixi/layout'
import { useTheme } from '@src/ui/ThemeContext'

export type TBaseButtonProps = {
    label: string
    onPress?: () => void
    disabled?: boolean
    fill: ColorSource
    fillHover: ColorSource
    textFill?: ColorSource
    textFillHover?: ColorSource
    appearance: LayoutStyles
    fontSize?: number
    layout?: LayoutStyles
}

/** Общая логика кнопок: клик, hover, disabled и подпись. Внешний вид задают наследники. */
export function BaseButton({
    label,
    onPress,
    disabled = false,
    fill,
    fillHover,
    textFill,
    textFillHover,
    appearance,
    fontSize = 22,
    layout = {},
}: TBaseButtonProps) {
    const theme = useTheme()
    const [hovered, setHovered] = useState(false)
    const canPress = !disabled && onPress != null
    const labelFill = disabled
        ? theme.TEXT_MUTED
        : hovered && !disabled
            ? (textFillHover ?? textFill ?? theme.UI.PANEL_LABEL)
            : (textFill ?? theme.UI.PANEL_LABEL)

    return (
        <layoutContainer
            eventMode={disabled ? 'none' : 'static'}
            cursor={canPress ? 'pointer' : 'default'}
            alpha={disabled ? 0.4 : 1}
            onPointerTap={canPress ? onPress : undefined}
            onPointerOver={() => {
                if (!disabled) {
                    setHovered(true)
                }
            }}
            onPointerOut={() => setHovered(false)}
            layout={{
                justifyContent: 'center',
                alignItems: 'center',
                ...appearance,
                backgroundColor: hovered && !disabled ? fillHover : fill,
                ...layout,
            }}
        >
            <layoutText
                text={label}
                style={{
                    fontFamily: theme.UI.FONT_FAMILY,
                    fontSize,
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
        </layoutContainer>
    )
}
