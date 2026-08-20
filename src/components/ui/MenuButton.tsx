import { useState } from 'react'
import { useTheme } from '@src/ui/ThemeContext'

type TProps = {
    label: string
    onPress?: () => void
    /** Компактный вариант (для рядов кнопок 1–4) */
    compact?: boolean
    disabled?: boolean
}

export function MenuButton({ label, onPress, compact = false, disabled = false }: TProps) {
    const theme = useTheme()
    const [hovered, setHovered] = useState(false)
    const interactive = !disabled && onPress != null

    return (
        <layoutContainer
            eventMode={interactive ? 'static' : 'none'}
            cursor={interactive ? 'pointer' : 'default'}
            alpha={disabled ? 0.4 : 1}
            onPointerTap={interactive ? onPress : undefined}
            onPointerOver={() => {
                if (interactive) {
                    setHovered(true)
                }
            }}
            onPointerOut={() => setHovered(false)}
            layout={{
                paddingTop: compact ? 10 : 14,
                paddingBottom: compact ? 10 : 14,
                paddingLeft: compact ? 18 : 40,
                paddingRight: compact ? 18 : 40,
                minWidth: compact ? 48 : undefined,
                backgroundColor: hovered && interactive
                    ? theme.UI.BUTTON_FILL_TOP
                    : theme.UI.BUTTON_FILL_BOTTOM,
                borderColor: theme.UI.ACCENT,
                borderWidth: 2,
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <layoutText
                text={label}
                style={{
                    fontSize: compact ? 18 : 22,
                    fill: disabled ? theme.TEXT_MUTED : theme.UI.PANEL_LABEL,
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
