import { Graphics, Sprite, Texture, type Container } from 'pixi.js'
import { Easing } from '@src/utils/bezier'

const GRAVITY = 0.28
const LIFE_MS = 560
const SLASH_MS = 70

type Half = {
    sprite: Sprite
    vx: number
    vy: number
    vr: number
}

/**
 * Горизонтальный «удар меча»: две половинки клетки плавно падают и исчезают.
 * Исходный спрайт не трогает — его убирает clearCell/unmount.
 */
export function playSamuraiCutAnimation(source: Sprite, cellSize: number): Promise<void> {
    const parent = source.parent as Container | null
    if (!parent) {
        return Promise.resolve()
    }

    const tint = source.tint
    const originX = source.x
    const originY = source.y
    const width = Math.max(2, source.width || cellSize * 0.9)
    const height = Math.max(2, source.height || cellSize * 0.9)
    const halfH = height / 2

    // Вспышка линии разреза
    const slash = new Graphics()
    slash
        .rect(-width * 0.55, -1, width * 1.1, 2)
        .fill({ color: 0xffffff, alpha: 1 })
    slash.x = originX
    slash.y = originY
    parent.addChild(slash)

    const top = new Sprite(Texture.WHITE)
    top.anchor.set(0.5)
    top.tint = tint
    top.width = width
    top.height = halfH
    top.x = originX
    top.y = originY - halfH / 2
    parent.addChild(top)

    const bottom = new Sprite(Texture.WHITE)
    bottom.anchor.set(0.5)
    bottom.tint = tint
    bottom.width = width
    bottom.height = halfH
    bottom.x = originX
    bottom.y = originY + halfH / 2
    parent.addChild(bottom)

    const halves: Half[] = [
        { sprite: top, vx: -0.35, vy: -0.6, vr: -0.025 },
        { sprite: bottom, vx: 0.35, vy: 0.4, vr: 0.025 },
    ]

    const easeFade = Easing.easeIn

    return new Promise((resolve) => {
        const start = performance.now()
        let last = start

        const tick = (now: number) => {
            const elapsed = now - start
            const dt = Math.min(32, now - last) / 16.67
            last = now

            // Линия меча быстро гаснет
            if (elapsed < SLASH_MS) {
                slash.alpha = 1 - elapsed / SLASH_MS
            } else if (slash.parent) {
                slash.destroy()
            }

            const life = Math.min(1, elapsed / LIFE_MS)
            const alpha = 1 - easeFade(life)

            for (const half of halves) {
                half.vy += GRAVITY * dt
                half.sprite.x += half.vx * dt
                half.sprite.y += half.vy * dt
                half.sprite.rotation += half.vr * dt
                half.sprite.alpha = alpha
            }

            if (elapsed < LIFE_MS) {
                requestAnimationFrame(tick)
                return
            }

            if (slash.parent) {
                slash.destroy()
            }
            for (const half of halves) {
                half.sprite.destroy()
            }
            resolve()
        }

        requestAnimationFrame(tick)
    })
}
