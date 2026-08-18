import { Assets, Texture } from 'pixi.js'
import { BLOCK_MATERIALS, type BlockSkinId } from './materials'

const loaded = new Map<BlockSkinId, Promise<Texture>>()

/** Грузит альбедо материала без постобработки. */
export function loadBlockMaterialTexture(id: BlockSkinId): Promise<Texture> {
    const cached = loaded.get(id)
    if (cached) {
        return cached
    }

    const pending = Assets.load<Texture>(BLOCK_MATERIALS[id].albedo)
    loaded.set(id, pending)
    return pending
}
