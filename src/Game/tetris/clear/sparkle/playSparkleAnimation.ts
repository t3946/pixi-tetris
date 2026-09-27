import { Sprite, Texture, type Container } from 'pixi.js'
import {
    SPARKLE_COUNT_EXTRA,
    SPARKLE_COUNT_MIN,
    SPARKLE_GRAVITY,
    SPARKLE_LIFT_MAX,
    SPARKLE_LIFT_MIN,
    SPARKLE_PARTICLE_MS,
    SPARKLE_ROTATION_BASE,
    SPARKLE_ROTATION_JITTER,
    SPARKLE_SIZE_FADE_KEEP,
    SPARKLE_SIZE_FADE_RANGE,
    SPARKLE_SIZE_MAX_PX,
    SPARKLE_SIZE_MAX_RATIO,
    SPARKLE_SIZE_MIN_PX,
    SPARKLE_SIZE_MIN_RATIO,
    SPARKLE_SPAWN_OFFSET_RATIO,
    SPARKLE_SPEED_MAX,
    SPARKLE_SPEED_MIN,
    SPARKLE_SPIN_JITTER,
    SPARKLE_TINT,
    SPARKLE_TWINKLE_AMPLITUDE,
    SPARKLE_TWINKLE_MIN,
    SPARKLE_TWINKLE_PHASE_STEP,
    SPARKLE_TWINKLE_SPEED_MAX,
    SPARKLE_TWINKLE_SPEED_MIN,
} from '@src/tetris/clear/sparkle/sparkleSettings'

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
    const count = SPARKLE_COUNT_MIN + Math.floor(Math.random() * SPARKLE_COUNT_EXTRA)
    const sparkles: Sparkle[] = []

    for (let i = 0; i < count; i++) {
        const sprite = new Sprite(Texture.WHITE)
        sprite.anchor.set(0.5)
        sprite.tint = SPARKLE_TINT
        const baseSize = randomRange(
            Math.max(SPARKLE_SIZE_MIN_PX, cellSize * SPARKLE_SIZE_MIN_RATIO),
            Math.max(SPARKLE_SIZE_MAX_PX, cellSize * SPARKLE_SIZE_MAX_RATIO),
        )
        sprite.width = baseSize
        sprite.height = baseSize
        sprite.rotation = SPARKLE_ROTATION_BASE + randomRange(-SPARKLE_ROTATION_JITTER, SPARKLE_ROTATION_JITTER)
        sprite.x = originX + randomRange(-cellSize * SPARKLE_SPAWN_OFFSET_RATIO, cellSize * SPARKLE_SPAWN_OFFSET_RATIO)
        sprite.y = originY + randomRange(-cellSize * SPARKLE_SPAWN_OFFSET_RATIO, cellSize * SPARKLE_SPAWN_OFFSET_RATIO)
        parent.addChild(sprite)

        const angle = randomRange(-Math.PI, Math.PI)
        const speed = randomRange(SPARKLE_SPEED_MIN, SPARKLE_SPEED_MAX)
        sparkles.push({
            sprite,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - randomRange(SPARKLE_LIFT_MIN, SPARKLE_LIFT_MAX),
            vr: randomRange(-SPARKLE_SPIN_JITTER, SPARKLE_SPIN_JITTER),
            baseSize,
            twinklePhase: randomRange(0, Math.PI * 2),
            twinkleSpeed: randomRange(SPARKLE_TWINKLE_SPEED_MIN, SPARKLE_TWINKLE_SPEED_MAX),
        })
    }

    return new Promise((resolve) => {
        const start = performance.now()
        let last = start

        const tick = (now: number) => {
            const elapsed = now - start
            const dt = Math.min(32, now - last) / 16.67
            last = now

            const life = Math.min(1, elapsed / SPARKLE_PARTICLE_MS)
            const fade = 1 - life

            for (const sparkle of sparkles) {
                sparkle.vy += SPARKLE_GRAVITY * dt
                sparkle.sprite.x += sparkle.vx * dt
                sparkle.sprite.y += sparkle.vy * dt
                sparkle.sprite.rotation += sparkle.vr * dt

                sparkle.twinklePhase += sparkle.twinkleSpeed * dt * SPARKLE_TWINKLE_PHASE_STEP
                const twinkle = SPARKLE_TWINKLE_MIN + SPARKLE_TWINKLE_AMPLITUDE * Math.abs(Math.sin(sparkle.twinklePhase))
                const size = sparkle.baseSize * twinkle * (SPARKLE_SIZE_FADE_KEEP + SPARKLE_SIZE_FADE_RANGE * fade)
                sparkle.sprite.width = size
                sparkle.sprite.height = size
                sparkle.sprite.alpha = fade * twinkle
            }

            if (elapsed < SPARKLE_PARTICLE_MS) {
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
