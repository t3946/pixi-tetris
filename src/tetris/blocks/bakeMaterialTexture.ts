import { Assets, Texture } from 'pixi.js'
import { BLOCK_MATERIALS, type BlockMaterial, type BlockSkinId } from './materials'

const baked = new Map<string, Promise<Texture>>()

function asImageSource(resource: unknown): CanvasImageSource {
    if (
        resource instanceof HTMLImageElement ||
        resource instanceof HTMLCanvasElement ||
        resource instanceof ImageBitmap ||
        (typeof OffscreenCanvas !== 'undefined' && resource instanceof OffscreenCanvas)
    ) {
        return resource
    }

    throw new Error('Block material albedo is not a drawable image')
}

/**
 * Поднимает середину тона, не сжимая блики в потолок:
 * 1) gamma-lift: 1.0 остаётся 1.0, mid поднимается
 * 2) contrast вокруг нового среднего, чтобы фаска/блик снова разошлись
 */
function bakeAlbedo(base: Texture, material: BlockMaterial): Texture {
    if (material.brightness === 1 && material.contrast === 1) {
        return base
    }

    const source = asImageSource(base.source.resource)
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(base.width))
    canvas.height = Math.max(1, Math.round(base.height))

    const context = canvas.getContext('2d')
    if (!context) {
        return base
    }

    context.drawImage(source, 0, 0, canvas.width, canvas.height)
    const image = context.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = image.data
    const { brightness, contrast } = material
    const gamma = 1 / brightness

    let toneSum = 0
    let toneCount = 0

    for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] === 0) {
            continue
        }

        toneSum += (pixels[i] / 255) ** gamma
        toneCount += 1
    }

    const mean = toneCount > 0 ? toneSum / toneCount : 0.5

    for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] === 0) {
            continue
        }

        const lifted = (pixels[i] / 255) ** gamma
        const next = Math.min(1, Math.max(0, mean + (lifted - mean) * contrast))
        const byte = Math.round(next * 255)
        pixels[i] = byte
        pixels[i + 1] = byte
        pixels[i + 2] = byte
    }

    context.putImageData(image, 0, 0)
    return Texture.from(canvas)
}

/** Грузит альбедо и один раз пропекает brightness/contrast материала. */
export function loadBlockMaterialTexture(id: BlockSkinId): Promise<Texture> {
    const material = BLOCK_MATERIALS[id]
    const cacheKey = `${id}:${material.brightness}:${material.contrast}`
    const cached = baked.get(cacheKey)
    if (cached) {
        return cached
    }

    const pending = Assets.load<Texture>(material.albedo).then((base) => bakeAlbedo(base, material))
    baked.set(cacheKey, pending)
    return pending
}
