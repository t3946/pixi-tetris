import { useCallback, useMemo } from 'react'
import { Filter, Texture, Ticker } from 'pixi.js'
import { useTick } from '@pixi/react'
import { filterShadingInOut } from '@shaders/linear-black-in-out/filter-shading-in-out'
import { createBackgroundFilter, tickBackgroundFilter } from '@shaders/game-backgrounds/backgroundFilter'
import { tickLineClearPulse } from '@shaders/game-backgrounds/backgroundInteraction'
import { GameThemes } from '@components/GameThemes/GameTheme.ts'
import { useUser } from '@src/user/UserContext'
import { useGameTimeScale } from '@src/tetris/TetrisGameContext'

export function Background({width, height}: {width: number, height: number}) {
    const { user } = useUser()
    const theme = GameThemes[user.gameTheme]
    const { shaderQuality } = user.settings
    const bgFilter = useMemo(
        () =>
            createBackgroundFilter(theme.shader, width, height, {
                ...theme.shadingOptions,
                introFade: true,
                quality: shaderQuality,
            }) as Filter,
        [theme.shader, theme.shadingOptions, width, height, shaderQuality],
    )
    const timeScaleRef = useGameTimeScale()

    const onTick = useCallback(
        (ticker: Ticker) => {
            const scale = timeScaleRef.current
            const dt = ticker.deltaTime * scale

            filterShadingInOut.resources.timeUniforms.uniforms.uTime += 0.04 * dt
            tickBackgroundFilter(theme.shader, bgFilter, dt, theme.shadingOptions)

            const uniforms = bgFilter.resources.timeUniforms?.uniforms as
                | { uPulse?: number }
                | undefined
            if (uniforms && 'uPulse' in uniforms) {
                uniforms.uPulse = tickLineClearPulse(ticker.deltaMS * scale)
            }
        },
        [bgFilter, theme.shader, theme.shadingOptions, timeScaleRef],
    )

    useTick(onTick)

    return (
        <pixiSprite
            texture={Texture.WHITE}
            width={width}
            height={height}
            filters={[bgFilter]}
        />
    )
}
