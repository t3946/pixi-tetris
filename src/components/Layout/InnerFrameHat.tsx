import { useState } from 'react'
import { useTheme } from '@src/ui/ThemeContext'
import { UiIcon } from '@components/ui/UiIcon'
import { MENU_DESIGN_WIDTH } from '@components/MainMenu/gameModes'

type TProps = {
    title: string
    width: number
    onBack: () => void
}

export function InnerFrameHat({ title, width, onBack }: TProps) {
    const theme = useTheme()
    const scale = width / MENU_DESIGN_WIDTH
    const pad = Math.round(20 * scale)
    const buttonSize = Math.round(44 * scale)
    const iconSize = Math.round(18 * scale)
    const titleSize = Math.round(22 * scale)
    const headerGap = Math.round(14 * scale)
    const hatHeight = '80'

    return (
        <layoutContainer
            layout={{
                flexShrink: 0,
                width: '100%',
                height: hatHeight,
                flexDirection: 'row',
                alignItems: 'center',
                gap: headerGap,
                paddingTop: pad,
                paddingBottom: pad,
                paddingLeft: pad,
                paddingRight: pad,
            }}
        >
            <layoutContainer
                layout={{
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                    left: pad,
                    height: hatHeight,
                }}
            >
                <BackButton size={buttonSize} iconSize={iconSize} onPress={onBack} />
            </layoutContainer>

            <layoutText
                text={title}
                style={{
                    fontFamily: theme.UI.FONT_FAMILY,
                    fontSize: titleSize,
                    fill: theme.TEXT_COLOR,
                    fontWeight: 'bold',
                }}
                layout={{ objectFit: 'none' }}
            />
        </layoutContainer>
    )
}

function BackButton({
    size,
    iconSize,
    onPress,
}: {
    size: number
    iconSize: number
    onPress: () => void
}) {
    const theme = useTheme()
    const [hovered, setHovered] = useState(false)
    const radius = Math.round(size * 0.2)

    return (
        <layoutContainer
            eventMode="static"
            cursor="pointer"
            onPointerTap={onPress}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            layout={{
                width: size,
                height: size,
                flexShrink: 0,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: radius,
                backgroundColor: hovered ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                borderColor: hovered ? 'rgba(255, 255, 255, 0.28)' : 'rgba(255, 255, 255, 0.18)',
            }}
        >
            <UiIcon name="chevronLeft" size={iconSize} tint={theme.TEXT_COLOR} />
        </layoutContainer>
    )
}
