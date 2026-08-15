import { Sprite, Texture, type Container } from 'pixi.js'

const GRAVITY = 0.45
const LIFE_MS = 480

type Shard = {
    sprite: Sprite
    vx: number
    vy: number
    vr: number
}

function randomRange(min: number, max: number): number {
    return min + Math.random() * (max - min)
}

/**
 * Спавнит 4–9 осколков в parent исходного спрайта и анимирует velocity/gravity.
 * Исходный спрайт НЕ трогает — его убирает clearCell/unmount (иначе alpha=0
 * залипает при reuse того же React key row-col после схлопывания ряда).
 */
export function playShatterAnimation(source: Sprite, cellSize: number): Promise<void> {
    const parent = source.parent as Container | null
    if (!parent) {
        return Promise.resolve()
    }

    const tint = source.tint
    const originX = source.x
    const originY = source.y
    const shardSize = Math.max(2, Math.round(cellSize / 3))
    const count = 4 + Math.floor(Math.random() * 6) // 4..9

    const shards: Shard[] = []

    for (let i = 0; i < count; i++) {
        const sprite = new Sprite(Texture.WHITE)
        sprite.anchor.set(0.5)
        sprite.tint = tint
        sprite.width = shardSize
        sprite.height = shardSize
        sprite.x = originX + randomRange(-cellSize * 0.15, cellSize * 0.15)
        sprite.y = originY + randomRange(-cellSize * 0.15, cellSize * 0.15)
        sprite.rotation = randomRange(0, Math.PI * 2)
        parent.addChild(sprite)

        const angle = randomRange(-Math.PI, Math.PI)
        const speed = randomRange(2.2, 5.5)
        shards.push({
            sprite,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - randomRange(1.5, 3.5),
            vr: randomRange(-0.25, 0.25),
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
            const alpha = 1 - life

            for (const shard of shards) {
                shard.vy += GRAVITY * dt
                shard.sprite.x += shard.vx * dt
                shard.sprite.y += shard.vy * dt
                shard.sprite.rotation += shard.vr * dt
                shard.sprite.alpha = alpha
            }

            if (elapsed < LIFE_MS) {
                requestAnimationFrame(tick)
                return
            }

            for (const shard of shards) {
                shard.sprite.destroy()
            }
            resolve()
        }

        requestAnimationFrame(tick)
    })
}
