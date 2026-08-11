import '@pixi/layout'
import '@pixi/layout/react'
import { Application, extend } from '@pixi/react'
import { Container, Graphics, Sprite, Text } from 'pixi.js'
import { LayoutContainer, LayoutText } from '@pixi/layout/components'
import { Game } from './Game'
import { ThemeProvider } from '@src/ui/ThemeContext'

extend({
    Container,
    Graphics,
    Sprite,
    Text,
    LayoutContainer,
    LayoutText,
})

export function App() {
    return (
        <ThemeProvider>
            <Application
                resizeTo={window}
                backgroundColor={0x1099bb}
                antialias={true}
                resolution={window.devicePixelRatio}
                autoDensity={true}
            >
                <Game />
            </Application>
        </ThemeProvider>
    )
}
