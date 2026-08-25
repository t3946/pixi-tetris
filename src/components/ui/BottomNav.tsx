import { useState } from 'react'
import type { IconName } from '@src/assets/icons'
import { UiIcon } from '@components/ui/UiIcon'
import { useTheme } from '@src/ui/ThemeContext'

export type BottomNavTab = 'home' | 'ranking' | 'achievements' | 'settings'

type TProps = {
    active: BottomNavTab
    onChange: (tab: BottomNavTab) => void
}

const NAV_HEIGHT = 72
const BORDER_WIDTH = 1
const ICON_SIZE = 28
const LABEL_SIZE = 11
const ICON_LABEL_GAP = 8
const INACTIVE_ALPHA = 0.4

const TABS: { id: BottomNavTab; icon: IconName; label: string }[] = [
    { id: 'home', icon: 'houseBlank', label: 'Главная' },
    { id: 'ranking', icon: 'rankingStar', label: 'Турниры' },
    { id: 'achievements', icon: 'medal', label: 'Рекорды' },
    { id: 'settings', icon: 'gear', label: 'Настройки' },
]

export function BottomNav({ active, onChange }: TProps) {
    const theme = useTheme()

    return (
        <layoutContainer
            layout={{
                width: '100%',
                height: NAV_HEIGHT,
                flexShrink: 0,
            }}
        >
            <layoutContainer
                eventMode="none"
                layout={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: theme.UI.NAV_BAR,
                }}
            />
            <layoutContainer
                eventMode="none"
                layout={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: BORDER_WIDTH,
                    backgroundColor: theme.UI.NAV_BORDER,
                }}
            />

            <layoutContainer
                layout={{
                    width: '100%',
                    height: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                {TABS.map((tab) => (
                    <NavButton
                        key={tab.id}
                        icon={tab.icon}
                        label={tab.label}
                        active={tab.id === active}
                        onPress={() => onChange(tab.id)}
                    />
                ))}
            </layoutContainer>
        </layoutContainer>
    )
}

function NavButton({
    icon,
    label,
    active,
    onPress,
}: {
    icon: IconName
    label: string
    active: boolean
    onPress: () => void
}) {
    const theme = useTheme()
    const [hovered, setHovered] = useState(false)
    const tint = active ? theme.UI.NAV_ICON_ACTIVE : theme.UI.NAV_ICON
    const alpha = active ? 1 : hovered ? 0.75 : INACTIVE_ALPHA

    return (
        <layoutContainer
            eventMode="static"
            cursor="pointer"
            onPointerTap={onPress}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            layout={{
                flex: 1,
                height: '100%',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: ICON_LABEL_GAP,
            }}
        >
            <layoutContainer layout={{ width: ICON_SIZE, height: ICON_SIZE, flexShrink: 0 }}>
                <UiIcon name={icon} size={ICON_SIZE} tint={tint} alpha={alpha} />
            </layoutContainer>
            <layoutText
                text={label}
                style={{
                    fontFamily: theme.UI.FONT_FAMILY,
                    fontSize: LABEL_SIZE,
                    fill: tint,
                    align: 'center',
                }}
                alpha={alpha}
                layout={{
                    objectFit: 'none',
                    objectPosition: 'center',
                }}
                eventMode="none"
            />
        </layoutContainer>
    )
}
