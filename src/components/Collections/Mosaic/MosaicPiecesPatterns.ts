import type { MosaicPiece } from "@components/Collections/Mosaic/mosaicPieceCells.ts";
import { EPieceType } from "@src/tetris/blocks";

/** Альбомная сетка 8×5 (поворот портретного паттерна на 90° по часовой). */
export const MosaicPiecesPatterns: Record<string, MosaicPiece[]> = {
    pattern_1: [
        { type: EPieceType.T, x: 0, y: 0, rotation: 1 },
        { type: EPieceType.T, x: 1, y: 0, rotation: 2 },
        { type: EPieceType.I, x: 4, y: 0, rotation: 0 },
        { type: EPieceType.O, x: 3, y: 1 },
        { type: EPieceType.J, x: 5, y: 1, rotation: 2 },
        { type: EPieceType.Z, x: 1, y: 2, rotation: 0 },
        { type: EPieceType.S, x: 4, y: 2, rotation: 0 },
        { type: EPieceType.O, x: 0, y: 3 },
        { type: EPieceType.O, x: 6, y: 3 },
        { type: EPieceType.I, x: 2, y: 4, rotation: 0 },
    ]
}
