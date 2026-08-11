/**
 * Семантический конфиг темы (Theme Config).
 * Назначение ролей палитре. Компоненты используют только роли, не raw-цвета.
 */

import { palette } from '../palette'

export const theme = {
    // Surfaces
    BG_COLOR: palette.blue_400,
    SURFACE_COLOR: palette.gray_800,
    SURFACE_ELEVATED: palette.slate_600,

    // Borders / strokes
    BORDER_COLOR: palette.white,
    GRID_LINE_COLOR: palette.gray_500,
    GRID_FILL_COLOR: palette.gray_800,

    // Text / icons
    TEXT_COLOR: palette.white,
    TEXT_MUTED: palette.gray_400,

    // Game
    GHOST_FILL: palette.black,

    UI: {
        BUTTON_FILL_TOP: palette.purple_700,
        BUTTON_FILL_BOTTOM: palette.purple_950,
        ACCENT: palette.purple_300,
        ICON: palette.purple_100,
        PANEL_FILL: palette.purple_950,
        PANEL_LABEL: palette.white,
    }
} as const

export type Theme = typeof theme
export type ThemeRole = keyof Theme
