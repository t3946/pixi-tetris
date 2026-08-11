import '@pixi/layout'
import '@pixi/layout/react'
import { Application, extend } from '@pixi/react'
import { Container, Graphics, Sprite } from 'pixi.js'
import { LayoutContainer } from '@pixi/layout/components'
import { Game } from './Game'

extend({
    Container,
    Graphics,
    Sprite,
    LayoutContainer,
})

export function App() {
    return (
        <Application
            resizeTo={window}
            backgroundColor={0x1099bb}
            antialias={true}
            resolution={window.devicePixelRatio}
            autoDensity={true}
        >
            <Game />
        </Application>
    )
}
