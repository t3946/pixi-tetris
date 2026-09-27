import { Texture } from 'pixi.js'

const GLOW_BLUR_PX = 10
const GLOW_PADDING = 22
const GLOW_CORNER = 5

function roundRectPath(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
) {
    const r = Math.min(radius, width / 2, height / 2)
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + width, y, x + width, y + height, r)
    ctx.arcTo(x + width, y + height, x, y + height, r)
    ctx.arcTo(x, y + height, x, y, r)
    ctx.arcTo(x, y, x + width, y, r)
    ctx.closePath()
}

/**
 * Свечение через Canvas 2D blur — не Pixi FilterSystem / TexturePool.
 * Белая картинка, цвет задаётся tint на спрайте.
 */
export function createCanvasGlowTexture(width: number, height: number): Texture {
    const pad = GLOW_PADDING
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.ceil(width + pad * 2))
    canvas.height = Math.max(1, Math.ceil(height + pad * 2))

    const ctx = canvas.getContext('2d')
    if (!ctx) {
        return Texture.WHITE
    }

    ctx.filter = `blur(${GLOW_BLUR_PX}px)`
    roundRectPath(ctx, pad, pad, width, height, GLOW_CORNER)
    ctx.fillStyle = '#ffffff'
    ctx.fill()

    return Texture.from(canvas)
}

export { GLOW_PADDING as CANVAS_GLOW_PADDING }
