import { EBlockTheme } from './EBlockTheme'
import { BlockThemes } from './BlockThemes'
import { CrystalTheme } from './crystal/CrystalTheme'
import { FlatSmoothTheme } from './flat/FlatSmoothTheme'

const THEMES: Record<EBlockTheme, BlockThemes> = {
    [EBlockTheme.Crystal]: new CrystalTheme(),
    [EBlockTheme.FlatSmooth]: new FlatSmoothTheme(),
}

export const BLOCK_THEME_ORDER: EBlockTheme[] = [EBlockTheme.Crystal, EBlockTheme.FlatSmooth]

export const DEFAULT_BLOCK_THEME = EBlockTheme.Crystal

let activeThemeId: EBlockTheme = DEFAULT_BLOCK_THEME

export function getBlockTheme(id: EBlockTheme): BlockThemes {
    return THEMES[id]
}

export function getActiveBlockTheme(): BlockThemes {
    return THEMES[activeThemeId]
}

export function getActiveBlockThemeId(): EBlockTheme {
    return activeThemeId
}

export function setActiveBlockTheme(id: EBlockTheme) {
    activeThemeId = id
}
