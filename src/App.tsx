import '@pixi/layout'
import '@pixi/layout/react'
import { Application, extend } from '@pixi/react'
import { Container, Graphics, Sprite, Text } from 'pixi.js'
import { LayoutContainer, LayoutText } from '@pixi/layout/components'
import { ThemeProvider } from '@src/ui/ThemeContext'
import { SceneId, SceneProvider, useScene } from '@src/scenes/SceneContext'
import { MainMenuScene } from '@src/scenes/MainMenuScene'
import { GameScene } from '@src/scenes/GameScene'

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
    }
}

export function App() {
    return (
        <ThemeProvider>
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
        </ThemeProvider>
    )
}
