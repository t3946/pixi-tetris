import { useState } from 'react'
import { UiIcon } from '@components/ui/UiIcon'
import { useTheme } from '@src/ui/ThemeContext'
import { MENU_DESIGN_WIDTH } from './gameModes'
import { GameTitle } from './GameTitle'
import { ModeCarousel } from './ModeCarousel'

type TProps = {
    width: number
    onPlay: () => void
}

export function HomeTab({ width, onPlay }: TProps) {
    const u = width / MENU_DESIGN_WIDTH
    const pad = Math.round(24 * u)
    const titleSize = Math.round(Math.min(56, Math.max(40, width * 0.13)))

    return (
        <layoutContainer
            layout={{
                width: '100%',
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: pad,
                paddingRight: pad,
                // gap: Math.round(20 * u),
                overflow: 'visible',
            }}
        >
            <layoutContainer layout={{marginBottom: 37}}>
                <GameTitle fontSize={titleSize} />
            </layoutContainer>

            <layoutContainer layout={{marginBottom: 37}}>
                <ModeCarousel width={width} />
            </layoutContainer>

            <layoutContainer layout={{marginBottom: 20}}>
                <PlayButton scale={u} onPress={onPlay} />
            </layoutContainer>

            <CollectionsButton scale={u} />
        </layoutContainer>
    )
}

function PlayButton({
    scale,
    onPress,
}: {
    scale: number
    onPress: () => void
}) {
    const theme = useTheme()
    const [hovered, setHovered] = useState(false)
    const height = Math.round(56 * scale)

    return (
        <layoutContainer
            eventMode="static"
            cursor="pointer"
            onPointerTap={onPress}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            layout={{
                width: '100%',
                height,
                borderRadius: Math.round(18 * scale),
                backgroundColor: hovered ? theme.MENU.PLAY_HOVER : theme.MENU.PLAY,
                justifyContent: 'center',
                alignItems: 'center',
                flexShrink: 0,
            }}
        >
            <layoutText
                text="НАЧАТЬ"
                style={{
                    fontFamily: theme.UI.FONT_FAMILY,
                    fontSize: Math.round(20 * scale),
                    fill: theme.TEXT_COLOR,
                    fontWeight: 'bold',
                    letterSpacing: 2,
                    align: 'center',
                }}
                layout={{ objectFit: 'none' }}
                eventMode="none"
            />
        </layoutContainer>
    )
}

function CollectionsButton({ scale }: { scale: number }) {
    const theme = useTheme()
    const [hovered, setHovered] = useState(false)
    const height = Math.round(50 * scale)

    return (
        <layoutContainer
            eventMode="static"
            cursor="pointer"
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            layout={{
                width: '100%',
                height,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingLeft: Math.round(20 * scale),
                paddingRight: Math.round(20 * scale),
                borderRadius: Math.round(16 * scale),
                borderWidth: 2,
                borderColor: theme.MENU.ACCENT,
                flexShrink: 0,
                overflow: 'hidden',
            }}
        >
            <layoutContainer
                eventMode="none"
                alpha={hovered ? 0.1 : 0.06}
                layout={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: hovered ? theme.MENU.ACCENT : theme.TEXT_COLOR,
                    borderRadius: Math.round(16 * scale),
                }}
            />
            <layoutContainer
                eventMode="none"
                layout={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Math.round(10 * scale),
                }}
            >
                <UiIcon name="palette" size={Math.round(16 * scale)} tint={theme.MENU.ACCENT} />
                <layoutText
                    text="КОЛЛЕКЦИИ"
                    style={{
                        fontFamily: theme.UI.FONT_FAMILY,
                        fontSize: Math.round(15 * scale),
                        fill: theme.MENU.ACCENT,
                        fontWeight: 'bold',
                        letterSpacing: 1.8,
                    }}
                    layout={{ objectFit: 'none' }}
                />
            </layoutContainer>
            <layoutContainer
                eventMode="none"
                layout={{
                    width: Math.round(24 * scale),
                    height: Math.round(24 * scale),
                    borderRadius: Math.round(12 * scale),
                    backgroundColor: theme.MENU.PLAY,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <layoutText
                    text="3"
                    style={{
                        fontFamily: theme.UI.FONT_FAMILY,
                        fontSize: Math.round(12 * scale),
                        fill: theme.TEXT_COLOR,
                        fontWeight: 'bold',
                        align: 'center',
                    }}
                    layout={{ objectFit: 'none' }}
                />
            </layoutContainer>
        </layoutContainer>
    )
}
