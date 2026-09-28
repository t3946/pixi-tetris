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
    [EPieceType.X]: { '#f050c8': 1 },
    [EPieceType.V]: { '#80d0ff': 1 },
    [EPieceType.W]: { '#d07040': 1 },
    [EPieceType.Builder]: { '#39ff14': 1 },
    [EPieceType.Destroyer]: { '#ff1439': 1 },
}
