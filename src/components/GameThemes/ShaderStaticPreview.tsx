import { getMosaicFillSource } from '@components/Collections/Mosaic/mosaicFill.ts'
import { useShaderStaticBakeTexture } from '@components/Collections/Mosaic/useShaderStaticBakeTexture.ts'
import type { TThemeConfig } from '@components/GameThemes/GameTheme.ts'

type TProps = {
    theme: TThemeConfig
    width: number
    height: number
}

export function ShaderStaticPreview({ theme, width, height }: TProps) {
    const fill = getMosaicFillSource(theme.shader, width, height, theme.shadingOptions)
    const texture = useShaderStaticBakeTexture(fill)

    return (
        <layoutContainer
            layout={{
                width,
                height,
                overflow: 'hidden',
            }}
        >
            <pixiSprite
                texture={texture}
                width={width}
                height={height}
                eventMode="none"
            />
        </layoutContainer>
    )
}
