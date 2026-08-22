import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Container, Graphics, Ticker } from 'pixi.js'
import { useTick } from '@pixi/react'
import { FALLING_TETROMINOES } from './gameModes'

type FallingPiece = {
    id: number
    cells: [number, number][]
    color: number
    x: number
    y: number
    speed: number
    scale: number
    rotation: number
    spin: number
    cell: number
    gap: number
    width: number
    height: number
}

function createPieces(width: number, height: number): FallingPiece[] {
    return Array.from({ length: 18 }, (_, i) => {
        const tetro = FALLING_TETROMINOES[i % FALLING_TETROMINOES.length]
        const duration = 8 + ((i * 1.7) % 9)
        const delay = (i * 1.4) % 12
        const cell = 14
        const gap = 2
        const maxX = Math.max(...tetro.cells.map((c) => c[0]))
        const maxY = Math.max(...tetro.cells.map((c) => c[1]))
        const pieceW = (maxX + 1) * (cell + gap) - gap
        const pieceH = (maxY + 1) * (cell + gap) - gap
        const travel = height + 160

        return {
            id: i,
            cells: tetro.cells,
            color: tetro.color,
            x: width * ((5 + ((i * 97) / 18) % 92) / 100),
            y: -80 - (delay / duration) * travel,
            speed: travel / duration,
            scale: 0.4 + (i % 3) * 0.15,
            rotation: ((i * 47) % 360) * (Math.PI / 180),
            spin: ((i % 2 === 0 ? 1 : -1) * Math.PI * 2) / duration,
            cell,
            gap,
            width: pieceW,
            height: pieceH,
        }
    })
}

type TProps = {
    width: number
    height: number
}

export function FallingTetrominoes({ width, height }: TProps) {
    const pieces = useMemo(() => createPieces(width, height), [width, height])
    const nodes = useRef<(Container | null)[]>([])
    const motion = useRef(pieces.map((piece) => ({ y: piece.y, rotation: piece.rotation })))

    useEffect(() => {
        motion.current = pieces.map((piece, index) => motion.current[index] ?? { y: piece.y, rotation: piece.rotation })

        for (let i = 0; i < pieces.length; i++) {
            const node = nodes.current[i]
            if (node) {
                node.x = pieces[i].x
            }
        }
    }, [pieces])

    const onTick = useCallback(
        (ticker: Ticker) => {
            const dt = ticker.deltaMS / 1000
            const resetAt = height + 80

            for (let i = 0; i < pieces.length; i++) {
                const piece = pieces[i]
                const state = motion.current[i]
                if (!state) {
                    continue
                }

                state.y += piece.speed * dt
                state.rotation += piece.spin * dt

                if (state.y > resetAt) {
                    state.y = -80
                }

                const node = nodes.current[i]
                if (node) {
                    node.y = state.y
                    node.rotation = state.rotation
                }
            }
        },
        [height, pieces],
    )

    useTick(onTick)

    return (
        <pixiContainer eventMode="none">
            {pieces.map((piece, index) => (
                <FallingPieceView
                    key={piece.id}
                    piece={piece}
                    containerRef={(node) => {
                        nodes.current[index] = node
                    }}
                />
            ))}
        </pixiContainer>
    )
}

function FallingPieceView({
    piece,
    containerRef,
}: {
    piece: FallingPiece
    containerRef: (node: Container | null) => void
}) {
    const placed = useRef(false)
    const draw = useCallback(
        (graphics: Graphics) => {
            graphics.clear()
            const step = piece.cell + piece.gap

            for (const [cx, cy] of piece.cells) {
                graphics
                    .roundRect(cx * step, cy * step, piece.cell, piece.cell, 3)
                    .fill({ color: piece.color, alpha: 0.7 })
            }
        },
        [piece],
    )

    return (
        <pixiContainer
            ref={(node) => {
                if (node && !placed.current) {
                    node.y = piece.y
                    node.rotation = piece.rotation
                    placed.current = true
                }
                containerRef(node)
            }}
            x={piece.x}
            scale={piece.scale}
            alpha={0.18}
            pivot={{ x: piece.width / 2, y: piece.height / 2 }}
            eventMode="none"
        >
            <pixiGraphics draw={draw} />
        </pixiContainer>
    )
}
