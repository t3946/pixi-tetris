import { useCallback, useMemo } from 'react'
import { Filter, Graphics, Texture, Ticker } from 'pixi.js'
import { useTick } from '@pixi/react'
import { filterShadingInOut } from '@shaders/linear-black-in-out/filter-shading-in-out'
import { filterBgBlue } from '@shaders/bg-blue/bg-blue.filter.js'
import { GameField } from "@components/GameField.tsx";
import { BOARD_COLS, BOARD_ROWS } from '@src/tetris/constants'

const GRID_ALPHA = 0.5

export function Grid({ width }: {width: number, height: number}) {
    const cellSize = width / BOARD_COLS
    const height = cellSize * BOARD_ROWS

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

            for (let i = 0; i <= BOARD_COLS; i++) {
                let x = i * cellSize

                if (i === 0) x += halfLineWidth
                if (i === BOARD_COLS) x -= halfLineWidth

                graphics.moveTo(x, 0).lineTo(x, height)
            }

            for (let j = 0; j <= BOARD_ROWS; j++) {
                let y = j * cellSize

                if (j === 0) y += halfLineWidth
                if (j === BOARD_ROWS) y -= halfLineWidth

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
                vertica={BOARD_ROWS}
                horizontal={BOARD_COLS}
                cellSize={cellSize}
            />
        </pixiContainer>
    )
}
