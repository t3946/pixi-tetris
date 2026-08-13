import { useState } from 'react'
import { useTheme } from '@src/ui/ThemeContext'

type TProps = {
    label: string
    onPress: () => void
    /** Компактный вариант (для рядов кнопок 1–4) */
    compact?: boolean
}

export function MenuButton({ label, onPress, compact = false }: TProps) {
    const theme = useTheme()
    const [hovered, setHovered] = useState(false)

    return (
        <layoutContainer
            eventMode="static"
            cursor="pointer"
            onPointerTap={onPress}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            layout={{
                paddingTop: compact ? 10 : 14,
                paddingBottom: compact ? 10 : 14,
                paddingLeft: compact ? 18 : 40,
                paddingRight: compact ? 18 : 40,
                minWidth: compact ? 48 : undefined,
                backgroundColor: hovered
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
                    fill: theme.UI.PANEL_LABEL,
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
