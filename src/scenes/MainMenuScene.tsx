import { useState } from 'react'
import { useTheme } from '@src/ui/ThemeContext'
import { SceneId, useScene } from '@src/scenes/SceneContext'
import { useAppLayout } from '@src/scenes/useAppLayout'

export function MainMenuScene() {
    const { screenSize, mainSize, ready } = useAppLayout()
    const { setScene } = useScene()
    const theme = useTheme()
    const [hovered, setHovered] = useState(false)

    if (!ready) {
        return null
    }

    return (
        <layoutContainer
            layout={{
                width: screenSize.width,
                height: screenSize.height,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <layoutContainer
                layout={{
                    width: mainSize.width,
                    height: mainSize.height,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 48,
                    backgroundColor: theme.SURFACE_COLOR,
                }}
            >
                <layoutText
                    text="Тетрис"
                    style={{
                        fontSize: 48,
                        fill: theme.TEXT_COLOR,
                        fontWeight: 'bold',
                        align: 'center',
                    }}
                    layout={{
                        objectFit: 'none',
                        objectPosition: 'center',
                    }}
                />

                <layoutContainer
                    eventMode="static"
                    cursor="pointer"
                    onPointerTap={() => setScene(SceneId.Game)}
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
                        text="Играть"
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
            </layoutContainer>
        </layoutContainer>
    )
}
