import { useCallback } from 'react'
import { Graphics } from 'pixi.js'
import { useTetrisGameState } from '@src/tetris/TetrisGameContext'
import { getShapeLocalCells } from '@src/tetris/tetrominoes'

const CELL_PADDING = 1
/** Высота панели дашборда (см. GameDashboard) — превью центрируем в этом квадрате */
const PREVIEW_BOX = 80

export const NextTetrominoes = () => {
    const { nextType } = useTetrisGameState()

    const drawPreview = useCallback(
        (graphics: Graphics) => {
            graphics.clear()

            const cells = getShapeLocalCells(nextType)
            if (cells.length === 0) {
                return
            }

            const minX = Math.min(...cells.map((c: any) => c.x))
            const maxX = Math.max(...cells.map((c: any) => c.x))
            const minY = Math.min(...cells.map((c: any) => c.y))
            const maxY = Math.max(...cells.map((c: any) => c.y))

            const shapeWidth = maxX - minX + 1
            const shapeHeight = maxY - minY + 1
            const cellSize = Math.floor(PREVIEW_BOX / Math.max(shapeWidth, shapeHeight, 4))

            const offsetX = (PREVIEW_BOX - shapeWidth * cellSize) / 2
            const offsetY = (PREVIEW_BOX - shapeHeight * cellSize) / 2

            for (const cell of cells) {
                const col = cell.x - minX
                const row = cell.y - minY
                graphics
                    .rect(
                        offsetX + col * cellSize + CELL_PADDING,
                        offsetY + row * cellSize + CELL_PADDING,
                        cellSize - CELL_PADDING * 2,
                        cellSize - CELL_PADDING * 2,
                    )
                    .fill(cell.color)
            }
        },
        [nextType],
    )

    return <pixiGraphics draw={drawPreview} />
}
