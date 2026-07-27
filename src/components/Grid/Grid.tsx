import { useCallback, useMemo } from 'react'
import { Filter, Graphics, Texture, Ticker } from 'pixi.js'
import { useTick } from '@pixi/react'
import { filterShadingInOut } from '@shaders/linear-black-in-out/filter-shading-in-out'
import { filterBgBlue } from '@shaders/bg-blue/bg-blue.filter.js'

type GridProps = {
    size: number
}

const VERTICAL_CELLS = 20
const HORIZONTAL_CELLS = 10
const GRID_ALPHA = 0.5

export function Grid({ size }: GridProps) {
    const cellSize = size / 10
    const width = HORIZONTAL_CELLS * cellSize
    const height = VERTICAL_CELLS * cellSize

    const bgFilter = useMemo(() => filterBgBlue(width, height) as Filter, [width, height])

    const onTick = useCallback(
        (ticker: Ticker) => {
            filterShadingInOut.resources.timeUniforms.uniforms.uTime += 0.04 * ticker.deltaTime
            bgFilter.resources.timeUniforms.uniforms.uTime += 0.02 * ticker.deltaTime
        },
        [bgFilter],
    )

    useTick(onTick)

    const drawGrid = useCallback(
        (graphics: Graphics) => {
            graphics.clear()

            graphics.rect(0, 0, width, height).fill({ color: 0x222222, alpha: GRID_ALPHA })

            for (let i = 0; i <= HORIZONTAL_CELLS; i++) {
                const x = i * cellSize
                graphics.moveTo(x, 0).lineTo(x, height)
            }

            for (let j = 0; j <= VERTICAL_CELLS; j++) {
                const y = j * cellSize
                graphics.moveTo(0, y).lineTo(width, y)
            }

            graphics.stroke({ color: 0x666666, width: 1, alpha: GRID_ALPHA })
        },
        [cellSize, height, width],
    )

    return (
        <pixiContainer layout={true}>
            <pixiSprite
                texture={Texture.WHITE}
                width={width}
                height={height}
                filters={[bgFilter]}
            />
            <pixiGraphics draw={drawGrid} />
        </pixiContainer>
    )
}
