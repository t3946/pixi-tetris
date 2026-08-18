import { GhostPiece } from '@components/GhostPiece'
import { Monomino } from '@components/Monomino'
import { useTetrisGameState } from '@src/tetris/TetrisGameContext'
import { getPieceCells } from '@src/tetris/tetrominoes'
import type { ReactNode } from 'react'
import { Texture } from 'pixi.js'

type TProps = {
    vertica: number
    horizontal: number
    cellSize: number
}

export function GameField({ vertica, horizontal, cellSize }: TProps) {
    const { board, piece, gameOver, paused } = useTetrisGameState()

    const boardMonominoes: ReactNode[] = []

    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            const color = board[row][col]

            if (color !== 0) {
                boardMonominoes.push(
                    <Monomino
                        key={`board-${row}-${col}-${color}`}
                        col={col}
                        row={row}
                        color={color}
                        cellSize={cellSize}
                    />,
                )
            }
        }
    }

    const pieceMonominoes =
        piece == null
            ? []
            : getPieceCells(piece)
                  .filter((cell) => cell.y >= 0)
                  .map((cell, index) => (
                      <Monomino
                          key={`piece-${index}-${cell.x}-${cell.y}`}
                          col={cell.x}
                          row={cell.y}
                          color={cell.color}
                          cellSize={cellSize}
                          pieceType={piece.type}
                      />
                  ))

    return (
        <pixiContainer>
            {boardMonominoes}
            {piece != null && (
                <GhostPiece piece={piece} board={board} cellSize={cellSize} />
            )}
            {pieceMonominoes}

            {(gameOver || paused) && (
                <pixiSprite
                    texture={Texture.WHITE}
                    width={horizontal * cellSize}
                    height={vertica * cellSize}
                    tint={0x000000}
                    alpha={0.45}
                />
            )}
        </pixiContainer>
    )
}
