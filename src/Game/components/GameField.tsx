import { GhostPiece } from '@components/GhostPiece'
import { Monomino } from '@components/Monomino'
import { useHardDropAnimation, useTetrisGameState } from '@src/tetris/TetrisGameContext'
import { hardDropOffsetY } from '@src/hooks/useTetrisGame'
import { getPieceCells, type ActivePiece } from '@src/tetris/tetrominoes'
import { useUser } from '@src/user/UserContext'
import { useTick } from '@pixi/react'
import { GhostEffect } from 'custom-pixi-particles'
import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { Container, Sprite, Texture } from 'pixi.js'

/** Частота отпечатков GhostEffect во время hard drop (секунды) */
const TRAIL_SPAWN_INTERVAL_S = 0.02
/** Сколько живёт один отпечаток */
const TRAIL_GHOST_LIFETIME_S = 0.14
const TRAIL_START_ALPHA = 0.55
const TRAIL_MAX_GHOSTS = 14

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
 * Сдвигает активную фигуру вниз на время hard drop и оставляет шлейф через GhostEffect.
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
    const rootRef = useRef<Container>(null)
    const trailRef = useRef<Container>(null)
    const pieceRef = useRef<Container>(null)
    const effectsRef = useRef<GhostEffect[]>([])
    const wasDroppingRef = useRef(false)

    const clearTrail = () => {
        for (const effect of effectsRef.current) {
            effect.stop()
        }
        effectsRef.current = []
    }

    const startTrail = () => {
        const trailLayer = trailRef.current
        const pieceNode = pieceRef.current
        if (!trailLayer || !pieceNode) {
            return
        }

        clearTrail()

        const effects: GhostEffect[] = []
        for (const child of pieceNode.children) {
            if (!(child instanceof Sprite) || !child.texture) {
                continue
            }

            const effect = new GhostEffect(child, {
                spawnInterval: TRAIL_SPAWN_INTERVAL_S,
                ghostLifetime: TRAIL_GHOST_LIFETIME_S,
                startAlpha: TRAIL_START_ALPHA,
                endAlpha: 0,
                startTint: Number(child.tint),
                endTint: 0xffffff,
                blendMode: 'add',
                maxGhosts: TRAIL_MAX_GHOSTS,
            })
            trailLayer.addChild(effect)
            effect.start()
            effects.push(effect)
        }

        effectsRef.current = effects
    }

    const applyOffset = () => {
        const node = pieceRef.current
        if (!node) {
            return
        }

        const anim = hardDropAnimationRef.current
        const dropping = anim != null && anim.piece === piece
        node.y = dropping ? hardDropOffsetY(anim, piece.y, cellSize) : 0

        if (dropping && !wasDroppingRef.current) {
            startTrail()
        } else if (!dropping && wasDroppingRef.current) {
            clearTrail()
        }
        wasDroppingRef.current = dropping
    }

    useLayoutEffect(() => {
        applyOffset()
    })

    useTick(() => {
        applyOffset()
    })

    useEffect(() => {
        return () => {
            clearTrail()
            wasDroppingRef.current = false
        }
    }, [])

    return (
        <pixiContainer ref={rootRef}>
            <pixiContainer ref={trailRef} eventMode="none" />
            <pixiContainer ref={pieceRef}>{children}</pixiContainer>
        </pixiContainer>
    )
}
