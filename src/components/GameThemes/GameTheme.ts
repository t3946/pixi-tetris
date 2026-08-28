import { EGameTheme } from '@components/GameThemes/EGameTheme.ts'
import { Color } from '@src/utils/color.ts'
import { EBackgroundShaderId } from '@shaders/game-backgrounds/EBackgroundShaderId.ts'
import { wadingWaterCausticPresets } from '@shaders/game-backgrounds/wading-water-caustic/wading-water-caustic.filter'

export type TThemeConfig = {
    id: EGameTheme
    accent: Color
    title: string
    shader: EBackgroundShaderId
    shadingOptions?: Record<string, unknown>
}

export const GameThemes: Record<EGameTheme, TThemeConfig> = {
    [EGameTheme.CrystalSquares]: {
        id: EGameTheme.CrystalSquares,
        accent: new Color('#4fb1ff'),
        title: 'Кристальные плитки',
        shader: EBackgroundShaderId.CrystalSquares,
    },
    [EGameTheme.WadingCausticBlue]: {
        id: EGameTheme.WadingCausticBlue,
        accent: new Color('#508dd3'),
        title: 'Каустик синий',
        shader: EBackgroundShaderId.WadingWaterCaustic,
        shadingOptions: { preset: wadingWaterCausticPresets.deepBlue },
    },
    [EGameTheme.WadingCausticRed]: {
        id: EGameTheme.WadingCausticRed,
        accent: new Color('#ff4800'),
        title: 'Каустик красный',
        shader: EBackgroundShaderId.WadingWaterCaustic,
        shadingOptions: { preset: wadingWaterCausticPresets.ember },
    },
}

/** Темы в порядке отображения в коллекциях */
export const GameThemesList: TThemeConfig[] = [
    GameThemes[EGameTheme.CrystalSquares],
    GameThemes[EGameTheme.WadingCausticBlue],
    GameThemes[EGameTheme.WadingCausticRed],
]
