import { useState, type ReactNode } from 'react'
import { useTheme } from '@src/ui/ThemeContext'
import { useAppLayout } from '@src/scenes/useAppLayout'
import { SceneFrame } from '@src/scenes/SceneFrame'
import { BottomNav, type BottomNavTab } from '@components/ui/BottomNav'
import { MenuAtmosphere } from '@components/MainMenu/MenuAtmosphere'
import { MenuTopBar } from '@components/MainMenu/TopBar/MenuTopBar'
import { HomeTab } from '@components/MainMenu/HomeTab'
import { SettingsTab } from '@components/MainMenu/SettingsTab'
import { SceneId, useScene } from '@src/scenes/SceneContext'

export function MainMenuScene() {
    const { mainSize, ready } = useAppLayout()
    const { setScene } = useScene()
    const theme = useTheme()
    const [tab, setTab] = useState<BottomNavTab>('home')

    if (!ready) {
        return null
    }

    const isHome = tab === 'home'
    const isInnerFrame = tab === 'settings'

    return (
        <SceneFrame
            backgroundColor={theme.MENU.BG_MID}
            letterboxColor={theme.MENU.LETTERBOX}
            layout={isHome ? { overflow: 'visible' } : undefined}
            backdrop={
                isHome ? (
                    <MenuAtmosphere width={mainSize.width} height={mainSize.height} />
                ) : undefined
            }
        >
            {!isInnerFrame && <MenuTopBar width={mainSize.width} />}

            {tab === 'home' && (
                <HomeTab
                    width={mainSize.width}
                    onPlay={() => setScene(SceneId.Game)}
                    onCollections={() => setScene(SceneId.Collections)}
                />
            )}

            {tab === 'ranking' && <MenuPlaceholder title="Рейтинг" />}
            {tab === 'achievements' && <MenuPlaceholder title="Достижения" />}
            {tab === 'settings' && (
                <SettingsTab width={mainSize.width} onBack={() => setTab('home')} />
            )}

            {tab !== 'settings' && <BottomNav active={tab} onChange={setTab} />}
        </SceneFrame>
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
                roundPixels={true}
            />
            {children}
        </layoutContainer>
    )
}
