import { EPieceType } from './EPieceType'
import type { ThemeColors } from './BlockThemes'

/** Классическая палитра тетриса: один цвет на фигуру. */
export const CLASSIC_THEME_COLORS: ThemeColors = {
    [EPieceType.I]: { '#00f0f0': 1 },
    [EPieceType.O]: { '#f0f000': 1 },
    [EPieceType.T]: { '#a000f0': 1 },
    [EPieceType.S]: { '#00f000': 1 },
    [EPieceType.Z]: { '#f00000': 1 },
    [EPieceType.J]: { '#0000f0': 1 },
    [EPieceType.L]: { '#f0a000': 1 },
}
