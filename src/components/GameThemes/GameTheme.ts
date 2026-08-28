import { EGameTheme } from "@components/GameThemes/EGameTheme.ts";
import { Color } from "@src/utils/color.ts";
import { wadingWaterCausticPresets } from "@shaders/game-backgrounds/wading-water-caustic/wading-water-caustic.filter";

type TThemeConfig = {
    id: EGameTheme,
    accent: Color,
    shadingOptions?: Record<any, any>,
}

const GameThemes: Record<EGameTheme, TThemeConfig> = {
    [EGameTheme.CrystalSquares]: {
        id: EGameTheme.CrystalSquares,
        accent: new Color('#4fb1ff')
    },
    [EGameTheme.WadingCausticBlue]: {
        id: EGameTheme.WadingCausticBlue,
        accent: new Color('#508dd3'),
        shadingOptions: {preset: wadingWaterCausticPresets.deepBlue}
    },
    [EGameTheme.WadingCausticRed]: {
        id: EGameTheme.WadingCausticRed,
        accent: new Color('#ff4800'),
        shadingOptions: {preset: wadingWaterCausticPresets.ember}
    },
}