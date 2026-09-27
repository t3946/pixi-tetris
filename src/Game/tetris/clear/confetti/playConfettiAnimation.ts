import { Sprite, Texture, type Container } from 'pixi.js'
import { Color } from '@src/utils/color'

const GRAVITY = 0.12
const LIFE_MS = 520

type Confetti = {
    sprite: Sprite
    vx: number
    vy: number
    vr: number
    baseSize: number
    twinklePhase: number
    twinkleSpeed: number
}

function randomRange(min: number, max: number): number {
    return min + Math.random() * (max - min)
}

/**
 * Взрыв конфетти из центра клетки.
 * Исходный спрайт не трогает — его убирает clearCell/unmount.
 */
export function playConfettiAnimation(source: Sprite, cellSize: number): Promise<void> {
    const parent = source.parent as Container | null
    if (!parent) {
        return Promise.resolve()
    }

    const cellTint = source.tint
    const originX = source.x
    const originY = source.y
    const count = 14 + Math.floor(Math.random() * 8) // 14..21
    const pieces: Confetti[] = []

    const palette = [0xffffff, cellTint, new Color(cellTint).lightenBy(80).toNumber(), 0xfff4a3]

    for (let i = 0; i < count; i++) {
        const sprite = new Sprite(Texture.WHITE)
        sprite.anchor.set(0.5)
        sprite.tint = palette[i % palette.length]
        // Размер частиц ×0.5 относительно прежнего «sparkle»
        const baseSize = randomRange(
            Math.max(1, cellSize * 0.04),
            Math.max(1.25, cellSize * 0.11),
        )
        sprite.width = baseSize
        sprite.height = baseSize
        sprite.rotation = Math.PI / 4 + randomRange(-0.3, 0.3)
        sprite.x = originX + randomRange(-cellSize * 0.05, cellSize * 0.05)
        sprite.y = originY + randomRange(-cellSize * 0.05, cellSize * 0.05)
        parent.addChild(sprite)

        const angle = randomRange(-Math.PI, Math.PI)
        // Радиус/скорость разлёта ×0.5
        const speed = randomRange(1.25, 3.25)
        pieces.push({
            sprite,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - randomRange(0.25, 1.1),
            vr: randomRange(-0.35, 0.35),
            baseSize,
            twinklePhase: randomRange(0, Math.PI * 2),
            twinkleSpeed: randomRange(10, 18),
        })
    }

    return new Promise((resolve) => {
        const start = performance.now()
        let last = start

        const tick = (now: number) => {
            const elapsed = now - start
            const dt = Math.min(32, now - last) / 16.67
            last = now

            const life = Math.min(1, elapsed / LIFE_MS)
            const fade = 1 - life

            for (const piece of pieces) {
                piece.vy += GRAVITY * dt
                piece.sprite.x += piece.vx * dt
                piece.sprite.y += piece.vy * dt
                piece.sprite.rotation += piece.vr * dt

                piece.twinklePhase += piece.twinkleSpeed * dt * 0.05
                const twinkle = 0.55 + 0.45 * Math.abs(Math.sin(piece.twinklePhase))
                const size = piece.baseSize * twinkle * (0.85 + 0.15 * fade)
                piece.sprite.width = size
                piece.sprite.height = size
                piece.sprite.alpha = fade * twinkle
            }

            if (elapsed < LIFE_MS) {
                requestAnimationFrame(tick)
                return
            }

            for (const piece of pieces) {
                piece.sprite.destroy()
            }
            resolve()
        }

        requestAnimationFrame(tick)
    })
}
