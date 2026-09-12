import crystal from '@src/assets/blocks/crystal.png'
import flatSmooth1 from '@src/assets/blocks/flat-smooth-1.png'
import flatRounded from '@src/assets/blocks/flat-rounded.png'
import flatSolid from '@src/assets/blocks/flat-solid.png'

/** Материал клетки: grayscale-альбедо под tint плоским цветом фигуры. */
export type BlockMaterial = {
    id: string
    label: string
    albedo: string
}

export const BLOCK_MATERIALS = {
    crystal: {
        id: 'crystal',
        label: 'Щит',
        albedo: crystal,
    },
    'flat-smooth-1': {
        id: 'flat-smooth-1',
        label: 'Модерн',
        albedo: flatSmooth1,
    },
    'flat-rounded': {
        id: 'flat-rounded',
        label: 'Плоский',
        albedo: flatRounded,
    },
    'flat-solid': {
        id: 'flat-solid',
        label: 'Классика',
        albedo: flatSolid,
    },
} as const satisfies Record<string, BlockMaterial>

export type BlockSkinId = keyof typeof BLOCK_MATERIALS

export const BLOCK_SKIN_ORDER: BlockSkinId[] = [
    'flat-smooth-1',
    'flat-rounded',
    'flat-solid',
    'crystal',
]

export const DEFAULT_BLOCK_SKIN: BlockSkinId = 'crystal'

export function getBlockMaterial(id: BlockSkinId): BlockMaterial {
    return BLOCK_MATERIALS[id]
}
