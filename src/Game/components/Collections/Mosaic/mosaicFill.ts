import { EBackgroundShaderId } from '@shaders/game-backgrounds/EBackgroundShaderId'

export type MosaicFillAlign = 'bottom' | 'center'

export type MosaicFillSource = {
    shader: EBackgroundShaderId
    bakeWidth: number
    bakeHeight: number
    shadingOptions?: Record<string, unknown>
    /** Какой фрагмент портретной bake-текстуры виден в альбомной мозаике */
    align?: MosaicFillAlign
}

const DEFAULT_BAKE_WIDTH = 500
const DEFAULT_BAKE_HEIGHT = 800

export function getMosaicFillSource(
    shader: EBackgroundShaderId,
    bakeWidth = DEFAULT_BAKE_WIDTH,
    bakeHeight = DEFAULT_BAKE_HEIGHT,
    shadingOptions?: Record<string, unknown>,
): MosaicFillSource {
    const align: MosaicFillAlign =
        shadingOptions?.mosaicFillAlign === 'center' ? 'center' : 'bottom'

    return { shader, bakeWidth, bakeHeight, shadingOptions, align }
}
