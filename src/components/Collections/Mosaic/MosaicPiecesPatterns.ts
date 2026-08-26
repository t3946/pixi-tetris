import type { MosaicPiece } from "@components/Collections/Mosaic/mosaicPieceCells.ts";
import { EPieceType } from "@src/tetris/blocks";

export const MosaicPiecesPatterns: Record<string, MosaicPiece[]> = {
    pattern_1: [
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
}