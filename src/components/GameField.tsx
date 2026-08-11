import { useCallback } from 'react'
import { Graphics } from 'pixi.js'
import { useTetrisGameState } from '@src/tetris/TetrisGameContext'
import { getPieceCells } from '@src/tetris/tetrominoes'

type TProps = {
    vertica: number
    horizontal: number
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

export function GameField({ vertica, horizontal, cellSize }: TProps) {
    const { board, piece, gameOver, paused } = useTetrisGameState()

    const drawField = useCallback(
        (graphics: Graphics) => {
            graphics.clear()
            // don't forget disable it during animation
            graphics.roundPixels = true

            for (let row = 0; row < board.length; row++) {
                for (let col = 0; col < board[row].length; col++) {
                    const color = board[row][col]

                    if (color !== 0) {
                        drawCell(graphics, col, row, color, cellSize)
                    }
                }
            }

            if (piece) {
                for (const cell of getPieceCells(piece)) {
                    if (cell.y >= 0) {
                        drawCell(graphics, cell.x, cell.y, cell.color, cellSize)
                    }
                }
            }

            // draw shadow over stack
            if (gameOver || paused) {
                graphics
                    .rect(0, 0, horizontal * cellSize, vertica * cellSize)
                    .fill({ color: 0x000000, alpha: 0.45 })
            }
        },
        [board, cellSize, gameOver, horizontal, paused, piece, vertica],
    )

    return <pixiGraphics draw={drawField} />
}
