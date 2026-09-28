import { GhostPiece } from '@components/GhostPiece'
import { Monomino } from '@components/Monomino'
import {
    TRAIL_GHOST_LIFETIME_S,
    TRAIL_MAX_GHOSTS,
    TRAIL_SPAWN_INTERVAL_S,
    TRAIL_START_ALPHA,
} from '@components/trailEffect'
import { useHardDropAnimation, useTetrisGameState } from '@src/tetris/TetrisGameContext'
import { hardDropOffsetY } from '@src/hooks/useTetrisGame'
import { getActiveFigure, isActiveFigureType } from '@src/tetris/activeFigures'
import { getShellAlpha, type FallingProjectile } from '@src/tetris/projectiles'
import { getPieceCells, type ActivePiece } from '@src/tetris/tetrominoes'
import { useUser } from '@src/user/UserContext'
import { useTick } from '@pixi/react'
import { GhostEffect } from 'custom-pixi-particles'
import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { Container, Sprite, Texture } from 'pixi.js'

type TProps = {
    vertica: number
    horizontal: number
    cellSize: number
}

export function GameField({ vertica, horizontal, cellSize }: TProps) {
    const { board, piece, gameOver, projectiles } = useTetrisGameState()
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
            {piece != null && !isActiveFigureType(piece.type) && (
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
            {projectiles.map((shell) => (
                <ShellProjectile key={shell.id} shell={shell} cellSize={cellSize} />
            ))}

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

/** Снаряд Строителя: 1×1, мерцание, шлейф как у hard drop. */
function ShellProjectile({ shell, cellSize }: { shell: FallingProjectile; cellSize: number }) {
    const rootRef = useRef<Container>(null)
    const trailRef = useRef<Container>(null)
    const bodyRef = useRef<Container>(null)
    const effectsRef = useRef<GhostEffect[]>([])
    const flickerElapsedRef = useRef(0)
    const shellRef = useRef(shell)
    shellRef.current = shell
    const step = Math.round(cellSize)

    const ensureTrail = () => {
        if (effectsRef.current.length > 0) {
            return
        }

        const trailLayer = trailRef.current
        const body = bodyRef.current
        if (!trailLayer || !body) {
            return
        }

        const effects: GhostEffect[] = []
        for (const child of body.children) {
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

    useTick((ticker) => {
        const body = bodyRef.current
        if (!body) {
            return
        }

        ensureTrail()
        body.y = shellRef.current.y * step
        flickerElapsedRef.current += ticker.deltaMS
        body.alpha = getShellAlpha(flickerElapsedRef.current)
    })

    useLayoutEffect(() => {
        const body = bodyRef.current
        if (!body) {
            return
        }

        body.y = shell.y * step
        body.alpha = getShellAlpha(flickerElapsedRef.current)
        ensureTrail()
    })

    useEffect(() => {
        return () => {
            for (const effect of effectsRef.current) {
                effect.stop()
                effect.removeFromParent?.()
                // Убираем остатки шлейфа сразу, без доигрывания lifetime
                if ('destroy' in effect && typeof effect.destroy === 'function') {
                    effect.destroy({ children: true })
                }
            }
            effectsRef.current = []
            trailRef.current?.removeChildren()
        }
    }, [shell.id])

    return (
        <pixiContainer ref={rootRef}>
            <pixiContainer ref={trailRef} eventMode="none" />
            <pixiContainer ref={bodyRef} y={shell.y * step}>
                <Monomino col={shell.x} row={0} color={shell.color} cellSize={cellSize} />
            </pixiContainer>
        </pixiContainer>
    )
}

/**
 * Сдвигает активную фигуру вниз на время hard drop и оставляет шлейф через GhostEffect.
 * Для ActiveFigure — мерцание прозрачности.
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
    const flickerElapsedRef = useRef(0)
    const activeFigure = getActiveFigure(piece.type)

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

    useLayoutEffect(() => {
        flickerElapsedRef.current = 0
        const node = pieceRef.current
        if (node) {
            node.alpha = activeFigure ? activeFigure.getAlpha(0) : 1
        }
    }, [piece.type, activeFigure])

    useTick((ticker) => {
        applyOffset()

        const node = pieceRef.current
        if (!node) {
            return
        }

        if (!activeFigure) {
            node.alpha = 1
            return
        }

        flickerElapsedRef.current += ticker.deltaMS
        node.alpha = activeFigure.getAlpha(flickerElapsedRef.current)
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
