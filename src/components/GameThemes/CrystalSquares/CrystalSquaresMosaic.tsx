import { EBackgroundShaderId } from '@shaders/game-backgrounds/EBackgroundShaderId.ts'
import { getMosaicFillSource } from '@components/Collections/Mosaic/mosaicFill.ts'
import { MosaicBase } from '@components/Collections/Mosaic/MosaicBase.tsx'
import { MosaicPiecesPatterns } from '@components/Collections/Mosaic/MosaicPiecesPatterns.ts'
import type { Color } from '@src/utils/color'

/** Портретное разрешение bake-текстуры шейдера (альбомная мозаика показывает нижний фрагмент). */
const MOSAIC_FILL_BAKE_WIDTH = 500
const MOSAIC_FILL_BAKE_HEIGHT = 800

const FILL = getMosaicFillSource(
    EBackgroundShaderId.CrystalSquares,
    MOSAIC_FILL_BAKE_WIDTH,
    MOSAIC_FILL_BAKE_HEIGHT,
)

export const CRYSTAL_SQUARES_PIECES_TOTAL = MosaicPiecesPatterns.pattern_1.length

type TProps = {
    width: number
    progress?: number
    edgeColor?: Color
    frameColor?: Color
    borderRadius?: number
}

export function CrystalSquaresMosaic({ width, progress, edgeColor, frameColor, borderRadius }: TProps) {
    return (
        <MosaicBase
            width={width}
            borderRadius={borderRadius}
            pieces={MosaicPiecesPatterns.pattern_1}
            progress={progress}
            fill={FILL}
            edgeColor={edgeColor}
            frameColor={frameColor}
        />
    )
}
