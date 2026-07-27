import '@pixi/layout'
import { Application } from 'pixi.js'
import { Game } from './Game.ts'

async function init() {
    const app = new Application()
    await app.init({
        resizeTo: window,
        backgroundColor: 0x1099bb,
    })
    document.body.appendChild(app.canvas)

    new Game(app)
}

init().catch(console.error)
