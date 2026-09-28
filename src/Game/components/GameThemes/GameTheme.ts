import { EGameTheme } from '@components/GameThemes/EGameTheme.ts'
import { Color } from '@src/utils/color.ts'
import { EBackgroundShaderId } from '@shaders/game-backgrounds/EBackgroundShaderId.ts'
import { wadingWaterCausticPresets } from '@shaders/game-backgrounds/wading-water-caustic/wading-water-caustic.filter'
import { EPieceType } from '@src/tetris/blocks/themes'

/** Если задан — обязан содержать цвет для каждого тетромино; иначе используются цвета Block Theme. */
export type TTetrominoesColors = Record<EPieceType, Color>

export type TThemeConfig = {
    id: EGameTheme
    accent: Color
    title: string
    shader: EBackgroundShaderId
    shadingOptions?: Record<string, unknown>
    tetrominoesColors?: TTetrominoesColors
}

export const GameThemes: Record<EGameTheme, TThemeConfig> = {
    [EGameTheme.CrystalSquares]: {
        id: EGameTheme.CrystalSquares,
        accent: new Color('#4fb1ff'),
        title: 'Кристальные плитки',
        shader: EBackgroundShaderId.CrystalSquares,
        tetrominoesColors: {
            [EPieceType.I]: new Color('#8be9fd'),
            [EPieceType.O]: new Color('#f8fafc'),
            [EPieceType.T]: new Color('#10b981'),
            [EPieceType.S]: new Color('#c4b5fd'),
            [EPieceType.Z]: new Color('#00b3ff'),
            [EPieceType.J]: new Color('#3d64ff'),
            [EPieceType.L]: new Color('#ab52ff'),
            [EPieceType.X]: new Color('#f472b6'),
            [EPieceType.V]: new Color('#67e8f9'),
            [EPieceType.W]: new Color('#fb923c'),
            [EPieceType.Builder]: new Color('#39ff14'),
        },
    },
    [EGameTheme.WadingCausticBlue]: {
        id: EGameTheme.WadingCausticBlue,
        accent: new Color('#508dd3'),
        title: 'Каустик синий',
        shader: EBackgroundShaderId.WadingWaterCaustic,
        shadingOptions: { preset: wadingWaterCausticPresets.deepBlue, introFadeDuration: 1 },
    },
    [EGameTheme.WadingCausticRed]: {
        id: EGameTheme.WadingCausticRed,
        accent: new Color('#ff4800'),
        title: 'Каустик красный',
        shader: EBackgroundShaderId.WadingWaterCaustic,
        shadingOptions: { preset: wadingWaterCausticPresets.ember, introFadeDuration: 1 },
    },
    [EGameTheme.NeonwaveSunrise]: {
        id: EGameTheme.NeonwaveSunrise,
        accent: new Color('#bc6bff'),
        title: 'Неоновый Горизонт',
        shader: EBackgroundShaderId.NeonwaveSunrise,
        shadingOptions: { lineClearPulseMs: 2500, lineClearPulseEasing: 'easeInOut' },
        tetrominoesColors: {
            [EPieceType.I]: new Color('#fde047'),
            [EPieceType.O]: new Color('#fff7ed'),
            [EPieceType.T]: new Color('#4ade80'),
            [EPieceType.S]: new Color('#f0abfc'),
            [EPieceType.Z]: new Color('#d946ef'),
            [EPieceType.J]: new Color('#fb7185'),
            [EPieceType.L]: new Color('#f97316'),
            [EPieceType.X]: new Color('#f472b6'),
            [EPieceType.V]: new Color('#22d3ee'),
            [EPieceType.W]: new Color('#c084fc'),
            [EPieceType.Builder]: new Color('#39ff14'),
        },
    },
    [EGameTheme.OceanUnder]: {
        id: EGameTheme.OceanUnder,
        accent: new Color('#1a8fbf'),
        title: 'Океанская бездна',
        shader: EBackgroundShaderId.OceanUnder,
        tetrominoesColors: {
            [EPieceType.I]: new Color('#fde047'),
            [EPieceType.O]: new Color('#a78bfa'),
            [EPieceType.T]: new Color('#a3e635'),
            [EPieceType.S]: new Color('#f9a8d4'),
            [EPieceType.Z]: new Color('#d946ef'),
            [EPieceType.J]: new Color('#fb923c'),
            [EPieceType.L]: new Color('#ef4444'),
            [EPieceType.X]: new Color('#f472b6'),
            [EPieceType.V]: new Color('#67e8f9'),
            [EPieceType.W]: new Color('#fdba74'),
            [EPieceType.Builder]: new Color('#39ff14'),
        },
    },
    [EGameTheme.Shine]: {
        id: EGameTheme.Shine,
        accent: new Color('#7b3897'),
        title: 'Сияние',
        shader: EBackgroundShaderId.Shine,
        shadingOptions: { introFadeDuration: 1, mosaicFillAlign: 'center' },
        tetrominoesColors: {
            [EPieceType.I]: new Color('#00f000'),
            [EPieceType.O]: new Color('#f00000'),
            [EPieceType.T]: new Color('#a000f0'),
            [EPieceType.S]: new Color('#f0f000'),
            [EPieceType.Z]: new Color('#00f0f0'),
            [EPieceType.J]: new Color('#2828ff'),
            [EPieceType.L]: new Color('#ffaa00'),
            [EPieceType.X]: new Color('#ff55cc'),
            [EPieceType.V]: new Color('#55ccff'),
            [EPieceType.W]: new Color('#cc7744'),
            [EPieceType.Builder]: new Color('#39ff14'),
        }
    },
}

/** Темы в порядке отображения в коллекциях */
export const GameThemesList: TThemeConfig[] = [
    GameThemes[EGameTheme.CrystalSquares],
    GameThemes[EGameTheme.WadingCausticBlue],
    GameThemes[EGameTheme.WadingCausticRed],
    GameThemes[EGameTheme.NeonwaveSunrise],
    GameThemes[EGameTheme.OceanUnder],
    GameThemes[EGameTheme.Shine],
]

const DEFAULT_GAME_THEME = EGameTheme.CrystalSquares

let activeGameThemeId: EGameTheme = DEFAULT_GAME_THEME

export function getActiveGameTheme(): TThemeConfig {
    return GameThemes[activeGameThemeId]
}

export function getActiveGameThemeId(): EGameTheme {
    return activeGameThemeId
}

export function setActiveGameTheme(id: EGameTheme) {
    activeGameThemeId = id
}

/** Цвет тетромино из игровой темы, если `tetrominoesColors` задан. */
export function getGameThemeTetrominoColor(type: EPieceType): number | null {
    const colors = getActiveGameTheme().tetrominoesColors
    if (!colors) {
        return null
    }

    return colors[type].toNumber()
}

/** Цвета UI-хрома (рамка стакана, панели дашборда) из accent темы. */
export function getAccentUiChrome(accent: Color) {
    return {
        /** Рамка, бордер и шапка панелей */
        chrome: accent.scale(0.55).toHex(),
        /** Фон тела панели */
        panelFill: accent.scale(0.15).toHex(),
    }
}
