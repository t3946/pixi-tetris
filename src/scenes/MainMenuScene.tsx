import { useState } from 'react'
import { useTheme } from '@src/ui/ThemeContext'
import { SceneId, useScene } from '@src/scenes/SceneContext'
import { useAppLayout } from '@src/scenes/useAppLayout'
import { MenuButton } from '@components/ui/MenuButton'
import { BottomNav, type BottomNavTab } from '@components/ui/BottomNav'

export function MainMenuScene() {
    const { screenSize, mainSize, ready } = useAppLayout()
    const { setScene } = useScene()
    const theme = useTheme()
    const [tab, setTab] = useState<BottomNavTab>('home')

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
                    backgroundColor: theme.SURFACE_COLOR,
                }}
            >
                <layoutContainer
                    layout={{
                        width: '100%',
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 24,
                    }}
                >
                    {tab === 'home' && (
                        <>
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
                                    marginBottom: 24,
                                }}
                            />
                            <MenuButton label="Играть" onPress={() => setScene(SceneId.Game)} />
                        </>
                    )}

                    {tab === 'ranking' && (
                        <layoutText
                            text="Рейтинг"
                            style={{
                                fontSize: 36,
                                fill: theme.TEXT_COLOR,
                                fontWeight: 'bold',
                                align: 'center',
                            }}
                            layout={{
                                objectFit: 'none',
                                objectPosition: 'center',
                            }}
                        />
                    )}

                    {tab === 'achievements' && (
                        <layoutText
                            text="Достижения"
                            style={{
                                fontSize: 36,
                                fill: theme.TEXT_COLOR,
                                fontWeight: 'bold',
                                align: 'center',
                            }}
                            layout={{
                                objectFit: 'none',
                                objectPosition: 'center',
                            }}
                        />
                    )}

                    {tab === 'settings' && (
                        <>
                            <layoutText
                                text="Настройки"
                                style={{
                                    fontSize: 36,
                                    fill: theme.TEXT_COLOR,
                                    fontWeight: 'bold',
                                    align: 'center',
                                }}
                                layout={{
                                    objectFit: 'none',
                                    objectPosition: 'center',
                                    marginBottom: 24,
                                }}
                            />
                            <MenuButton label="Разработка" onPress={() => setScene(SceneId.Dev)} />
                        </>
                    )}
                </layoutContainer>

                <BottomNav active={tab} onChange={setTab} />
            </layoutContainer>
        </layoutContainer>
    )
}
