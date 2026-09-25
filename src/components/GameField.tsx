import { GhostPiece } from '@components/GhostPiece'
import { Monomino } from '@components/Monomino'
import { useHardDropAnimation, useTetrisGameState } from '@src/tetris/TetrisGameContext'
import { hardDropOffsetY } from '@src/hooks/useTetrisGame'
import { getPieceCells, type ActivePiece } from '@src/tetris/tetrominoes'
import { useUser } from '@src/user/UserContext'
import { useTick } from '@pixi/react'
import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { Container, Texture } from 'pixi.js'

type TProps = {
    vertica: number
    horizontal: number
    cellSize: number
}

export function GameField({ vertica, horizontal, cellSize }: TProps) {
    const { board, piece, gameOver } = useTetrisGameState()
    const { user } = useUser()

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
                <GhostPiece
                    piece={piece}
                    board={board}
                    cellSize={cellSize}
                    renderMode={user.settings.ghostRenderMode}
                />
            )}
            {piece != null && (
                <DroppingPiece piece={piece} cellSize={cellSize}>
                    {pieceMonominoes}
                </DroppingPiece>
            )}

            {gameOver && (
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

/**
 * Сдвигает активную фигуру вниз на время hard drop, не меняя клетку в состоянии игры.
 * Смещение пишется в y контейнера каждый кадр, чтобы не пересоздавать мономино.
 */
function DroppingPiece({
    piece,
    cellSize,
    children,
}: {
    piece: ActivePiece
    cellSize: number
    children: ReactNode
}) {
    const hardDropAnimationRef = useHardDropAnimation()
    const containerRef = useRef<Container>(null)

    const applyOffset = () => {
        const node = containerRef.current
        if (!node) {
            return
        }

        const anim = hardDropAnimationRef.current
        node.y = anim && anim.piece === piece ? hardDropOffsetY(anim, piece.y, cellSize) : 0
    }

    useLayoutEffect(() => {
        applyOffset()
    })

    useTick(() => {
        applyOffset()
    })

    return <pixiContainer ref={containerRef}>{children}</pixiContainer>
}
