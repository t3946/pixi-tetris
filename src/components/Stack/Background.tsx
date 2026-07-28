import { useCallback, useMemo } from 'react'
import { Filter, Texture, Ticker } from 'pixi.js'
import { useTick } from '@pixi/react'
import { filterShadingInOut } from '@shaders/linear-black-in-out/filter-shading-in-out'
import { filterBgBlue } from '@shaders/bg-blue/bg-blue.filter.js'

export function Background({width, height}: {width: number, height: number}) {
    const bgFilter = useMemo(() => filterBgBlue(width, height) as Filter, [width, height])

    const onTick = useCallback(
        (ticker: Ticker) => {
            filterShadingInOut.resources.timeUniforms.uniforms.uTime += 0.04 * ticker.deltaTime
            bgFilter.resources.timeUniforms.uniforms.uTime += 0.02 * ticker.deltaTime
        },
        [bgFilter],
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
