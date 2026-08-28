import { useCallback, useMemo } from 'react'
import { Filter, Texture, Ticker } from 'pixi.js'
import { useTick } from '@pixi/react'
import { filterShadingInOut } from '@shaders/linear-black-in-out/filter-shading-in-out'
import { createBackgroundFilter, tickBackgroundFilter } from '@shaders/game-backgrounds/backgroundFilter'
import { GameThemes } from '@components/GameThemes/GameTheme.ts'
import { useUser } from '@src/user/UserContext'
import { useGameTimeScale } from '@src/tetris/TetrisGameContext'

export function Background({width, height}: {width: number, height: number}) {
    const { user } = useUser()
    const theme = GameThemes[user.gameTheme]
    const bgFilter = useMemo(
        () => createBackgroundFilter(theme.shader, width, height, theme.shadingOptions) as Filter,
        [theme.shader, theme.shadingOptions, width, height],
    )
    const timeScaleRef = useGameTimeScale()

    const onTick = useCallback(
        (ticker: Ticker) => {
            const dt = ticker.deltaTime * timeScaleRef.current

            filterShadingInOut.resources.timeUniforms.uniforms.uTime += 0.04 * dt
            tickBackgroundFilter(theme.shader, bgFilter, dt, theme.shadingOptions)
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
