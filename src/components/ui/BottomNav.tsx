import { useEffect, useState } from 'react'
import { Assets, Texture } from 'pixi.js'
import { icons, type IconName } from '@src/assets/icons'
import { useTheme } from '@src/ui/ThemeContext'

export type BottomNavTab = 'home' | 'ranking' | 'achievements' | 'settings'

type TProps = {
    active: BottomNavTab
    onChange: (tab: BottomNavTab) => void
}

const NAV_HEIGHT = 64
const CORNER_RADIUS = 8
const ICON_SIZE = 28
const INACTIVE_ALPHA = 0.4

const TABS: { id: BottomNavTab; icon: IconName }[] = [
    { id: 'home', icon: 'houseBlank' },
    { id: 'ranking', icon: 'rankingStar' },
    { id: 'achievements', icon: 'medal' },
    { id: 'settings', icon: 'gear' },
]

export function BottomNav({ active, onChange }: TProps) {
    const theme = useTheme()

    return (
        <layoutContainer
            layout={{
                width: '100%',
                height: NAV_HEIGHT,
                flexShrink: 0,
                overflow: 'hidden',
            }}
        >
            {/* Лишняя высота обрезается — скругление остаётся только у верхних углов */}
            <layoutContainer
                eventMode="none"
                layout={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: NAV_HEIGHT + CORNER_RADIUS,
                    backgroundColor: theme.UI.NAV_BAR,
                    borderRadius: CORNER_RADIUS,
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
    active,
    onPress,
}: {
    icon: IconName
    active: boolean
    onPress: () => void
}) {
    const theme = useTheme()
    const [hovered, setHovered] = useState(false)
    const texture = useIconTexture(icon)
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
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {texture && (
                <pixiSprite
                    texture={texture}
                    tint={theme.UI.NAV_ICON}
                    alpha={alpha}
                    layout={{
                        width: ICON_SIZE,
                        height: ICON_SIZE,
                        objectFit: 'contain',
                    }}
                />
            )}
        </layoutContainer>
    )
}

function useIconTexture(name: IconName) {
    const [texture, setTexture] = useState<Texture | null>(null)

    useEffect(() => {
        let cancelled = false

        Assets.load<Texture>(icons[name]).then((loaded) => {
            if (!cancelled) {
                setTexture(loaded)
            }
        })

        return () => {
            cancelled = true
        }
    }, [name])

    return texture
}
