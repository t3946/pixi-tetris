import candy from '@src/assets/blocks/candy.png'
import bevel from '@src/assets/blocks/bevel.png'
import jelly from '@src/assets/blocks/jelly.png'
import crystal from '@src/assets/blocks/crystal.png'
import metal from '@src/assets/blocks/metal.png'
import flatSmooth1 from '@src/assets/blocks/flat-smooth-1.png'

/**
 * Материал клетки: grayscale-альбедо + настройки под tint.
 *
 * brightness — gamma-lift середины (блик 1.0 не трогает).
 * contrast — разнос света/тени вокруг нового среднего, иначе тиснение схлопывается.
 */
export type BlockMaterial = {
    id: string
    label: string
    albedo: string
    /** 1 = как в файле, >1 ярче заливка, блики остаются белыми. */
    brightness: number
    /** 1 = как после lift, >1 сильнее фаска и блик. */
    contrast: number
}

export const BLOCK_MATERIALS = {
    candy: {
        id: 'candy',
        label: 'Леденец',
        albedo: candy,
        brightness: 1.7,
        contrast: 1.48,
    },
    bevel: {
        id: 'bevel',
        label: 'Фаска',
        albedo: bevel,
        brightness: 1.55,
        contrast: 1.55,
    },
    jelly: {
        id: 'jelly',
        label: 'Желе',
        albedo: jelly,
        brightness: 1.65,
        contrast: 1.38,
    },
    crystal: {
        id: 'crystal',
        label: 'Кристалл',
        albedo: crystal,
        brightness: 1.8,
        contrast: 1.52,
    },
    metal: {
        id: 'metal',
        label: 'Металл',
        albedo: metal,
        brightness: 1.72,
        contrast: 1.45,
    },
    'flat-smooth-1': {
        id: 'flat-smooth-1',
        label: 'Плоский',
        albedo: flatSmooth1,
        brightness: 1,
        contrast: 1,
    },
} as const satisfies Record<string, BlockMaterial>

export type BlockSkinId = keyof typeof BLOCK_MATERIALS

export const BLOCK_SKIN_ORDER: BlockSkinId[] = [
    'candy',
    'bevel',
    'jelly',
    'crystal',
    'metal',
    'flat-smooth-1',
]

export const DEFAULT_BLOCK_SKIN: BlockSkinId = 'candy'

export function getBlockMaterial(id: BlockSkinId): BlockMaterial {
    return BLOCK_MATERIALS[id]
}
