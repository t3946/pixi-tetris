import { Sprite, Texture, type Container } from 'pixi.js'

const GRAVITY = 0.08
const LIFE_MS = 480

type Sparkle = {
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
 * Мелкие белые блёстки — разлёт как у confetti, но только white и меньше.
 * Исходный спрайт не трогает — его убирает clearCell/unmount.
 */
export function playSparkleAnimation(source: Sprite, cellSize: number): Promise<void> {
    const parent = source.parent as Container | null
    if (!parent) {
        return Promise.resolve()
    }

    const originX = source.x
    const originY = source.y
    const count = 16 + Math.floor(Math.random() * 8) // 16..23
    const sparkles: Sparkle[] = []

    for (let i = 0; i < count; i++) {
        const sprite = new Sprite(Texture.WHITE)
        sprite.anchor.set(0.5)
        sprite.tint = 0xffffff
        // Размер искр +20%
        const baseSize = randomRange(
            Math.max(0.96, cellSize * 0.024),
            Math.max(1.44, cellSize * 0.066),
        )
        sprite.width = baseSize
        sprite.height = baseSize
        sprite.rotation = Math.PI / 4 + randomRange(-0.4, 0.4)
        sprite.x = originX + randomRange(-cellSize * 0.048, cellSize * 0.048)
        sprite.y = originY + randomRange(-cellSize * 0.048, cellSize * 0.048)
        parent.addChild(sprite)

        const angle = randomRange(-Math.PI, Math.PI)
        // Радиус взрыва +20%
        const speed = randomRange(1.2, 3.36)
        sparkles.push({
            sprite,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - randomRange(0.24, 1.2),
            vr: randomRange(-0.4, 0.4),
            baseSize,
            twinklePhase: randomRange(0, Math.PI * 2),
            twinkleSpeed: randomRange(14, 24),
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

            for (const sparkle of sparkles) {
                sparkle.vy += GRAVITY * dt
                sparkle.sprite.x += sparkle.vx * dt
                sparkle.sprite.y += sparkle.vy * dt
                sparkle.sprite.rotation += sparkle.vr * dt

                sparkle.twinklePhase += sparkle.twinkleSpeed * dt * 0.05
                const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(sparkle.twinklePhase))
                const size = sparkle.baseSize * twinkle * (0.8 + 0.2 * fade)
                sparkle.sprite.width = size
                sparkle.sprite.height = size
                sparkle.sprite.alpha = fade * twinkle
            }

            if (elapsed < LIFE_MS) {
                requestAnimationFrame(tick)
                return
            }

            for (const sparkle of sparkles) {
                sparkle.sprite.destroy()
            }
            resolve()
        }

        requestAnimationFrame(tick)
    })
}
