import '@pixi/layout'
import '@pixi/layout/react'
import { Application, extend } from '@pixi/react'
import { Container, Graphics, Sprite, Text } from 'pixi.js'
import { LayoutContainer, LayoutText } from '@pixi/layout/components'
import { ThemeProvider } from '@src/ui/ThemeContext'
import { UserProvider } from '@src/user/UserContext'
import { SceneId, SceneProvider, useScene } from '@src/scenes/SceneContext'
import { MainMenuScene } from '@src/scenes/MainMenuScene'
import { GameScene } from '@src/scenes/GameScene'
import { DevScene } from '@src/scenes/DevScene'
import { RowEffectScene } from '@src/scenes/RowEffectScene'
import { BlockSkinScene } from '@src/scenes/BlockSkinScene'

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
        case SceneId.Dev:
            return <DevScene />
        case SceneId.RowEffect:
            return <RowEffectScene />
        case SceneId.BlockSkin:
            return <BlockSkinScene />
    }
}

export function App() {
    return (
        <ThemeProvider>
            <UserProvider>
                <SceneProvider>
                    <Application
                        resizeTo={window}
                        backgroundColor={0x1099bb}
                        antialias={true}
                        resolution={window.devicePixelRatio}
                        autoDensity={true}
                    >
                        <Scenes />
                    </Application>
                </SceneProvider>
            </UserProvider>
        </ThemeProvider>
    )
}
