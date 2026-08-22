import { useState, type ReactNode } from 'react'
import { useTheme } from '@src/ui/ThemeContext'
import { SceneId, useScene } from '@src/scenes/SceneContext'
import { useAppLayout } from '@src/scenes/useAppLayout'
import { MenuButton } from '@components/ui/MenuButton'
import { BottomNav, type BottomNavTab } from '@components/ui/BottomNav'
import { MenuAtmosphere } from '@components/MainMenu/MenuAtmosphere'
import { MenuTopBar } from '@components/MainMenu/TopBar/MenuTopBar'
import { HomeTab } from '@components/MainMenu/HomeTab'

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
                    backgroundColor: theme.MENU.BG_MID,
                    overflow: 'hidden',
                }}
            >
                <MenuAtmosphere width={mainSize.width} height={mainSize.height} />
                <MenuTopBar width={mainSize.width} />

                {tab === 'home' && (
                    <HomeTab width={mainSize.width} onPlay={() => setScene(SceneId.Game)} />
                )}

                {tab === 'ranking' && <MenuPlaceholder title="Рейтинг" />}
                {tab === 'achievements' && <MenuPlaceholder title="Достижения" />}
                {tab === 'settings' && (
                    <MenuPlaceholder title="Настройки">
                        <MenuButton label="Разработка" onPress={() => setScene(SceneId.Dev)} />
                    </MenuPlaceholder>
                )}

                <BottomNav active={tab} onChange={setTab} />
            </layoutContainer>
        </layoutContainer>
    )
}

function MenuPlaceholder({ title, children }: { title: string; children?: ReactNode }) {
    const theme = useTheme()

    return (
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
            <layoutText
                text={title}
                style={{
                    fontFamily: theme.UI.FONT_FAMILY,
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
            {children}
        </layoutContainer>
    )
}
