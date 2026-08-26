import { EBackgroundShaderId } from '@shaders/game-backgrounds/EBackgroundShaderId.ts'
import { getMosaicFillSource } from '@components/Collections/Mosaic/mosaicFill.ts'
import { MosaicBase } from '@components/Collections/Mosaic/MosaicBase.tsx'
import { MosaicPiecesPatterns } from "@components/Collections/Mosaic/MosaicPiecesPatterns.ts";

const FILL = getMosaicFillSource(EBackgroundShaderId.CrystalSquares)

type TProps = {
    size: number | string
    progress?: number
}

export function CrystalSquaresMosaic({ size, progress }: TProps) {
    return (
        <MosaicBase
            size={size}
            pieces={MosaicPiecesPatterns.pattern_1}
            progress={progress}
            fill={FILL}
        />
    )
}
