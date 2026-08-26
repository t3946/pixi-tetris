import { EPieceType } from '@src/tetris/blocks/themes'
import { crystalSquaresFill } from '@shaders/mosaicFill'
import { MosaicBase, type MosaicPiece } from '@components/Collections/Mosaic/MosaicBase'

const COLS = 5
const ROWS = 8

/**
 * 10 тетромино, закрывающих сетку 5×8 (см. макет BG-Puzzle).
 * x/y — клетка левого верхнего угла bbox детали.
 */
const PIECES: MosaicPiece[] = [
    { type: EPieceType.O, x: 3, y: 6 },
    { type: EPieceType.T, x: 0, y: 6 },
    { type: EPieceType.Z, x: 2, y: 4, rotation: 1 },
    { type: EPieceType.T, x: 0, y: 4, rotation: 1 },
    { type: EPieceType.O, x: 1, y: 3 },
    { type: EPieceType.I, x: 4, y: 2, rotation: 1 },
    { type: EPieceType.S, x: 2, y: 1, rotation: 1 },
    { type: EPieceType.O, x: 3, y: 0 },
    { type: EPieceType.J, x: 1, y: 0, rotation: 1 },
    { type: EPieceType.I, x: 0, y: 0, rotation: 1 },
]

type TProps = {
    size: number | string
    progress?: number
}

/** Мозaика «Crystal Squares» — bg-blue шейдер под маской тетромино. */
export function CrystalSquaresMosaic({ size, progress }: TProps) {
    return (
        <MosaicBase
            size={size}
            cols={COLS}
            rows={ROWS}
            pieces={PIECES}
            progress={progress}
            fill={crystalSquaresFill}
        />
    )
}
