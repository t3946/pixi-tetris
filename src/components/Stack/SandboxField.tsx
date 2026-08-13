import { useCallback } from 'react'
import { Graphics } from 'pixi.js'

type Board = number[][]

type TProps = {
    board: Board
    cellSize: number
}

const CELL_PADDING = 1

function drawCell(graphics: Graphics, col: number, row: number, color: number, cellSize: number) {
    graphics
        .rect(
            col * cellSize + CELL_PADDING,
            row * cellSize + CELL_PADDING,
            cellSize - CELL_PADDING * 2,
            cellSize - CELL_PADDING * 2,
        )
        .fill(color)
}

/** Отрисовка статического поля песочницы (без активной фигуры и паузы). */
export function SandboxField({ board, cellSize }: TProps) {
    const drawField = useCallback(
        (graphics: Graphics) => {
            graphics.clear()
            graphics.roundPixels = true

            for (let row = 0; row < board.length; row++) {
                for (let col = 0; col < board[row].length; col++) {
                    const color = board[row][col]

                    if (color !== 0) {
                        drawCell(graphics, col, row, color, cellSize)
                    }
                }
            }
        },
        [board, cellSize],
    )

    return <pixiGraphics draw={drawField} />
}
