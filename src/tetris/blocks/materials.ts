import crystal from '@src/assets/blocks/crystal.png'
import flatSmooth1 from '@src/assets/blocks/flat-smooth-1.png'

/** Материал клетки: grayscale-альбедо под tint плоским цветом фигуры. */
export type BlockMaterial = {
    id: string
    label: string
    albedo: string
}

export const BLOCK_MATERIALS = {
    crystal: {
        id: 'crystal',
        label: 'Кристалл',
        albedo: crystal,
    },
    'flat-smooth-1': {
        id: 'flat-smooth-1',
        label: 'Плоский',
        albedo: flatSmooth1,
    },
} as const satisfies Record<string, BlockMaterial>

export type BlockSkinId = keyof typeof BLOCK_MATERIALS

export const BLOCK_SKIN_ORDER: BlockSkinId[] = ['crystal', 'flat-smooth-1']

export const DEFAULT_BLOCK_SKIN: BlockSkinId = 'crystal'

export function getBlockMaterial(id: BlockSkinId): BlockMaterial {
    return BLOCK_MATERIALS[id]
}
