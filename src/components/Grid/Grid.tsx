import { useCallback, useMemo } from 'react'
import { Filter, Graphics, Texture, Ticker } from 'pixi.js'
import { useTick } from '@pixi/react'
import { filterShadingInOut } from '@shaders/linear-black-in-out/filter-shading-in-out'
import { filterBgBlue } from '@shaders/bg-blue/bg-blue.filter.js'
import { GameField } from "@components/GameField.tsx";

const VERTICAL_CELLS = 19
const HORIZONTAL_CELLS = 10
const GRID_ALPHA = 0.5

export function Grid({ width }: {width: number, height: number}) {
    const cellSize = width / HORIZONTAL_CELLS
    const height = cellSize * VERTICAL_CELLS

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

            // 1. Рисуем фон
            graphics.rect(0, 0, width, height).fill({ color: 0x222222, alpha: GRID_ALPHA })

            const halfLineWidth = 0.5

            for (let i = 0; i <= HORIZONTAL_CELLS; i++) {
                let x = i * cellSize

                if (i === 0) x += halfLineWidth
                if (i === HORIZONTAL_CELLS) x -= halfLineWidth

                graphics.moveTo(x, 0).lineTo(x, height)
            }

            for (let j = 0; j <= VERTICAL_CELLS; j++) {
                let y = j * cellSize

                if (j === 0) y += halfLineWidth
                if (j === VERTICAL_CELLS) y -= halfLineWidth

                graphics.moveTo(0, y).lineTo(width, y)
            }

            graphics.stroke({ color: 0x666666, width: 1, alpha: GRID_ALPHA })
        },
        [cellSize, height, width],
    )

    return (
        <pixiContainer
            x={0}
            y={0}
        >
            <pixiSprite
                texture={Texture.WHITE}
                width={width}
                height={height}
                filters={[bgFilter]}
            />

            <pixiGraphics draw={drawGrid} />

            <GameField
                vertica={VERTICAL_CELLS}
                horizontal={HORIZONTAL_CELLS}
                cellSize={cellSize}
            />
        </pixiContainer>
    )
}
