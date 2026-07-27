import { Sprite, Texture } from 'pixi.js'

export class FlatBackground extends Sprite {
    constructor() {
        super(Texture.WHITE)
    }

    resize(width: number, height: number) {
        this.width = width
        this.height = height
    }
}
