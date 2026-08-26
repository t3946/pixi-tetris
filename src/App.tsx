import '@pixi/layout'
import '@pixi/layout/react'
import { Application, extend } from '@pixi/react'
import { Color, Container, Graphics, Sprite, Text } from 'pixi.js'
import { LayoutContainer, LayoutText } from '@pixi/layout/components'
import { ThemeProvider, useTheme } from '@src/ui/ThemeContext'
import { UserProvider } from '@src/user/UserContext'
import { SceneId, SceneProvider, useScene } from '@src/scenes/SceneContext'
import { MainMenuScene } from '@src/scenes/MainMenuScene'
import { GameScene } from '@src/scenes/GameScene'
import { DevScene } from '@src/scenes/DevScene'
import { RowEffectScene } from '@src/scenes/RowEffectScene'
import { BlockSkinScene } from '@src/scenes/BlockSkinScene'
import { CollectionsScene } from '@src/scenes/CollectionsScene'
import type { ReactNode } from 'react'

extend({
    Container,
    Graphics,
    Sprite,
    Text,
    LayoutContainer,
    LayoutText,
})

function Scenes() {
    const { scene } = useScene()

    switch (scene) {
        case SceneId.MainMenu:
            return <MainMenuScene />
        case SceneId.Game:
            return <GameScene />
        case SceneId.Collections:
            return <CollectionsScene />
        case SceneId.Dev:
            return <DevScene />
        case SceneId.RowEffect:
            return <RowEffectScene />
        case SceneId.BlockSkin:
            return <BlockSkinScene />
    }
}

function ThemedApplication({ children }: { children: ReactNode }) {
    const theme = useTheme()

    return (
        <Application
            resizeTo={window}
            backgroundColor={new Color(theme.MENU.LETTERBOX).toNumber()}
            antialias={true}
            resolution={window.devicePixelRatio}
            autoDensity={true}
        >
            {children}
        </Application>
    )
}

export function App() {
    return (
        <ThemeProvider>
            <UserProvider>
                <SceneProvider>
                    <ThemedApplication>
                        <Scenes />
                    </ThemedApplication>
                </SceneProvider>
            </UserProvider>
        </ThemeProvider>
    )
}
