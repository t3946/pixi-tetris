import { useState } from 'react'
import { useTheme } from '@src/ui/ThemeContext'
import { SceneId, useScene } from '@src/scenes/SceneContext'
import { useAppLayout } from '@src/scenes/useAppLayout'
import { UiIcon } from '@components/ui/UiIcon'
import { MENU_DESIGN_WIDTH } from '@components/MainMenu/gameModes'

export function CollectionsScene() {
    const { screenSize, mainSize, ready } = useAppLayout()
    const { setScene } = useScene()
    const theme = useTheme()

    if (!ready) {
        return null
    }

    const scale = mainSize.width / MENU_DESIGN_WIDTH
    const pad = Math.round(20 * scale)
    const buttonSize = Math.round(44 * scale)
    const iconSize = Math.round(18 * scale)
    const titleSize = Math.round(22 * scale)
    const headerGap = Math.round(14 * scale)

    return (
        <layoutContainer
            layout={{
                width: screenSize.width,
                height: screenSize.height,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.MENU.LETTERBOX,
            }}
        >
            <layoutContainer
                layout={{
                    width: mainSize.width,
                    height: mainSize.height,
                    flexDirection: 'column',
                    backgroundColor: theme.MENU.BG_MID,
                }}
            >
                <layoutContainer
                    layout={{
                        flexShrink: 0,
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: headerGap,
                        paddingTop: pad,
                        paddingBottom: pad,
                        paddingLeft: pad,
                        paddingRight: pad,
                    }}
                >
                    <BackButton
                        size={buttonSize}
                        iconSize={iconSize}
                        onPress={() => setScene(SceneId.MainMenu)}
                    />

                    <layoutText
                        text="Коллекции"
                        style={{
                            fontFamily: theme.UI.FONT_FAMILY,
                            fontSize: titleSize,
                            fill: theme.TEXT_COLOR,
                            fontWeight: 'bold',
                        }}
                        layout={{ objectFit: 'none' }}
                    />
                </layoutContainer>

                <layoutContainer
                    layout={{
                        width: '100%',
                        height: 1,
                        flexShrink: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    }}
                />

                <layoutContainer
                    layout={{
                        width: '100%',
                        flex: 1,
                    }}
                />
            </layoutContainer>
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
