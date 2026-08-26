import { useState } from 'react'
import { Color } from 'pixi.js'
import { UiIcon } from '@components/ui/UiIcon'
import { useTheme } from '@src/ui/ThemeContext'

type TProps = {
    scale: number
    onPress: () => void
}

export function CollectionsButton({ scale, onPress }: TProps) {
    const theme = useTheme()
    const [hovered, setHovered] = useState(false)
    const height = Math.round(50 * scale)
    const iconSize = Math.round(20 * scale)

    const [ar, ag, ab] = new Color(theme.MENU.ACCENT).toUint8RgbArray()
    const accent = hovered
        ? `rgb(${Math.round(ar + (255 - ar) * 0.4)}, ${Math.round(ag + (255 - ag) * 0.4)}, ${Math.round(ab + (255 - ab) * 0.4)})`
        : theme.MENU.ACCENT
    const [r, g, b] = hovered ? [ar, ag, ab] : new Color(theme.TEXT_COLOR).toUint8RgbArray()

    return (
        <layoutContainer
            eventMode="static"
            cursor="pointer"
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerTap={onPress}
            layout={{
                width: '100%',
                height,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingLeft: Math.round(20 * scale),
                paddingRight: Math.round(20 * scale),
                borderRadius: Math.round(16 * scale),
                borderWidth: 1,
                borderColor: accent,
                backgroundColor: `rgba(${r}, ${g}, ${b}, ${hovered ? 0.1 : 0.06})`,
                flexShrink: 0,
            }}
        >
            <layoutContainer
                eventMode="none"
                layout={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Math.round(10 * scale),
                }}
            >
                <layoutContainer layout={{
                    position: 'absolute',
                    top: - iconSize / 2,
                    left: 0,
                }}>
                    <UiIcon name="palette" size={iconSize} tint={accent} />
                </layoutContainer>

                <layoutText
                    key={hovered ? 'hover' : 'idle'}
                    text="КОЛЛЕКЦИИ"
                    style={{
                        fontFamily: theme.UI.FONT_FAMILY,
                        fontSize: Math.round(15 * scale),
                        fill: accent,
                        fontWeight: 'bold',
                        letterSpacing: 1.8,
                    }}
                    layout={{ objectFit: 'none' }}
                />
            </layoutContainer>
        </layoutContainer>
    )
}
