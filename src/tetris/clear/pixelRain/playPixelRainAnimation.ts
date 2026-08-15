import { Sprite, Texture, type Container } from 'pixi.js'

const GRAVITY = 0.55
const LIFE_MS = 650

type Drop = {
    sprite: Sprite
    vx: number
    vy: number
}

function randomRange(min: number, max: number): number {
    return min + Math.random() * (max - min)
}

/**
 * Распадает клетку на мелкую сетку «пикселей», которые падают вниз
 * с разной скоростью. Исходный спрайт не трогает (clearCell/unmount).
 */
export function playPixelRainAnimation(source: Sprite, cellSize: number): Promise<void> {
    const parent = source.parent as Container | null
    if (!parent) {
        return Promise.resolve()
    }

    const tint = source.tint
    const originX = source.x
    const originY = source.y
    // Сетка 3×3 внутри клетки
    const grid = 3
    const pixelSize = Math.max(2, Math.floor(cellSize / (grid + 1)))
    const span = pixelSize * grid
    const startX = originX - span / 2 + pixelSize / 2
    const startY = originY - span / 2 + pixelSize / 2

    const drops: Drop[] = []

    for (let row = 0; row < grid; row++) {
        for (let col = 0; col < grid; col++) {
            const sprite = new Sprite(Texture.WHITE)
            sprite.anchor.set(0.5)
            sprite.tint = tint
            sprite.width = pixelSize
            sprite.height = pixelSize
            sprite.x = startX + col * pixelSize + randomRange(-1, 1)
            sprite.y = startY + row * pixelSize + randomRange(-1, 1)
            parent.addChild(sprite)

            drops.push({
                sprite,
                // Лёгкий боковой дрейф, основная скорость — вниз, разная у каждого
                vx: randomRange(-0.8, 0.8),
                vy: randomRange(1.2, 4.5),
            })
        }
    }

    return new Promise((resolve) => {
        const start = performance.now()
        let last = start

        const tick = (now: number) => {
            const elapsed = now - start
            const dt = Math.min(32, now - last) / 16.67
            last = now

            const life = Math.min(1, elapsed / LIFE_MS)
            // Держим видимость дольше, fade в конце
            const alpha = life < 0.55 ? 1 : 1 - (life - 0.55) / 0.45

            for (const drop of drops) {
                drop.vy += GRAVITY * dt
                drop.sprite.x += drop.vx * dt
                drop.sprite.y += drop.vy * dt
                drop.sprite.alpha = alpha
            }

            if (elapsed < LIFE_MS) {
                requestAnimationFrame(tick)
                return
            }

            for (const drop of drops) {
                drop.sprite.destroy()
            }
            resolve()
        }

        requestAnimationFrame(tick)
    })
}
