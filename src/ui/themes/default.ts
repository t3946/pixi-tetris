/**
 * Семантический конфиг темы (Theme Config).
 * Назначение ролей палитре. Компоненты используют только роли, не raw-цвета.
 */

import { palette } from '../palette'
import { FONT_FAMILY } from '@src/assets/fonts'

export const theme = {
    // Surfaces
    BG_COLOR: palette.blue_400,
    SURFACE_COLOR: palette.gray_800,
    SURFACE_ELEVATED: palette.slate_600,

    // Borders / strokes
    BORDER_COLOR: palette.white,
    // Индиго/сланец — ближе к фиолетовым панелям и синему фону, чем нейтральный серый
    GRID_LINE_COLOR: palette.slate_400,
    GRID_FILL_COLOR: palette.purple_950,

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
        FONT_FAMILY,
        BUTTON_PRIMARY: palette.purple_300,
        BUTTON_PRIMARY_HOVER: palette.purple_400,
        BUTTON_SECONDARY: palette.purple_900,
        BUTTON_SECONDARY_HOVER: palette.purple_800,
        BUTTON_DANGER_TEXT: palette.coral_400,
        BUTTON_DANGER_TEXT_HOVER: palette.coral_300,
    }
} as const

export type Theme = typeof theme
export type ThemeRole = keyof Theme
