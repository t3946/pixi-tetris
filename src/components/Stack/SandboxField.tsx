import type { ReactNode } from 'react'
import { Monomino } from '@components/Monomino'

type Board = number[][]

type TProps = {
    board: Board
    cellSize: number
}

/** Отрисовка статического поля песочницы (без активной фигуры и паузы). */
export function SandboxField({ board, cellSize }: TProps) {
    const monominoes: ReactNode[] = []

    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            const color = board[row][col]

            if (color !== 0) {
                monominoes.push(
                    <Monomino
                        key={`sandbox-${row}-${col}`}
                        col={col}
                        row={row}
                        color={color}
                        cellSize={cellSize}
                    />,
                )
            }
        }
    }

    return <pixiContainer>{monominoes}</pixiContainer>
}
