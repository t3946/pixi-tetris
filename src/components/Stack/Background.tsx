import { useCallback, useMemo } from 'react'
import { Filter, Texture, Ticker } from 'pixi.js'
import { useTick } from '@pixi/react'
import { filterShadingInOut } from '@shaders/linear-black-in-out/filter-shading-in-out'
import { filterBgBlue } from '@shaders/bg-blue/bg-blue.filter.js'
import { useGameTimeScale } from '@src/tetris/TetrisGameContext'

export function Background({width, height}: {width: number, height: number}) {
    const bgFilter = useMemo(() => filterBgBlue(width, height) as Filter, [width, height])
    const timeScaleRef = useGameTimeScale()

    const onTick = useCallback(
        (ticker: Ticker) => {
            const dt = ticker.deltaTime * timeScaleRef.current

            filterShadingInOut.resources.timeUniforms.uniforms.uTime += 0.04 * dt
            bgFilter.resources.timeUniforms.uniforms.uTime += 0.015 * dt
        },
        [bgFilter, timeScaleRef],
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
