import { getMosaicFillSource } from '@components/Collections/Mosaic/mosaicFill.ts'
import { MosaicBase } from '@components/Collections/Mosaic/MosaicBase.tsx'
import { MosaicPiecesPatterns } from '@components/Collections/Mosaic/MosaicPiecesPatterns.ts'
import type { TThemeConfig } from '@components/GameThemes/GameTheme.ts'
import type { Color } from '@src/utils/color'

/** Портретное разрешение bake-текстуры шейдера (альбомная мозаика показывает нижний фрагмент). */
const MOSAIC_FILL_BAKE_WIDTH = 500
const MOSAIC_FILL_BAKE_HEIGHT = 800

export const GAME_THEME_PIECES_TOTAL = MosaicPiecesPatterns.pattern_1.length

function getThemeFill(theme: TThemeConfig) {
    return getMosaicFillSource(
        theme.shader,
        MOSAIC_FILL_BAKE_WIDTH,
        MOSAIC_FILL_BAKE_HEIGHT,
        theme.shadingOptions,
    )
}

type TProps = {
    theme: TThemeConfig
    width: number
    progress?: number
    edgeColor?: Color
    frameColor?: Color
    borderRadius?: number
}

export function GameThemeMosaic({ theme, width, progress, edgeColor, frameColor, borderRadius }: TProps) {
    const fill = getThemeFill(theme)

    return (
        <MosaicBase
            width={width}
            borderRadius={borderRadius}
            pieces={MosaicPiecesPatterns.pattern_1}
            progress={progress}
            fill={fill}
            edgeColor={edgeColor}
            frameColor={frameColor}
        />
    )
}
