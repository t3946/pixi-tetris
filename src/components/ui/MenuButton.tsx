import { useState } from 'react'
import { useTheme } from '@src/ui/ThemeContext'

type TProps = {
    label: string
    onPress: () => void
}

export function MenuButton({ label, onPress }: TProps) {
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
                paddingTop: 14,
                paddingBottom: 14,
                paddingLeft: 40,
                paddingRight: 40,
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
                    fontSize: 22,
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
