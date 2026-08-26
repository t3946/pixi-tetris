import { useCallback, useMemo } from 'react'
import { Graphics } from 'pixi.js'
import { getShapeLocalCells, type PieceType } from '@src/tetris/tetrominoes'

export type MosaicPiece = {
    type: PieceType
    /** Клетка сетки — левый верх занятого bbox фигуры */
    x: number
    y: number
    rotation?: number
}

type TProps = {
    /** Мультипликатор клетки сетки */
    size: number | string
    cols: number
    rows: number
    pieces: readonly MosaicPiece[]
    /** Сколько первых деталей показать после сортировки */
    progress?: number
}

function sortMosaicPieces(pieces: readonly MosaicPiece[]): MosaicPiece[] {
    return [...pieces].sort((a, b) => {
        if (b.y !== a.y) {
            return b.y - a.y
        }

        return a.x - b.x
    })
}

/**
 * Абстрактный конструктор мозаики: рисует набор тетромино-деталей на сетке.
 */
export function MosaicBase({ size, cols, rows, pieces, progress }: TProps) {
    const unit = typeof size === 'string' ? Number(size) : size
    const width = cols * unit
    const height = rows * unit

    const visiblePieces = useMemo(() => {
        const sorted = sortMosaicPieces(pieces)

        return progress != null ? sorted.slice(0, progress) : sorted
    }, [pieces, progress])

    return (
        <layoutContainer
            layout={{
                width,
                height,
                flexShrink: 0,
            }}
        >
            <pixiContainer>
                {visiblePieces.map((piece, index) => (
                    <MosaicPieceGraphics key={index} piece={piece} unit={unit} />
                ))}
            </pixiContainer>
        </layoutContainer>
    )
}

function MosaicPieceGraphics({ piece, unit }: { piece: MosaicPiece; unit: number }) {
    const cells = getPieceBoardCells(piece)

    const draw = useCallback(
        (graphics: Graphics) => {
            graphics.clear()

            for (const cell of cells) {
                graphics.rect(cell.x * unit, cell.y * unit, unit, unit).fill({ color: 0xffffff })
            }

            const occupied = new Set(cells.map((cell) => `${cell.x},${cell.y}`))

            for (const cell of cells) {
                const x0 = cell.x * unit
                const y0 = cell.y * unit
                const x1 = x0 + unit
                const y1 = y0 + unit

                if (!occupied.has(`${cell.x},${cell.y - 1}`)) {
                    graphics.moveTo(x0, y0).lineTo(x1, y0)
                }
                if (!occupied.has(`${cell.x},${cell.y + 1}`)) {
                    graphics.moveTo(x0, y1).lineTo(x1, y1)
                }
                if (!occupied.has(`${cell.x - 1},${cell.y}`)) {
                    graphics.moveTo(x0, y0).lineTo(x0, y1)
                }
                if (!occupied.has(`${cell.x + 1},${cell.y}`)) {
                    graphics.moveTo(x1, y0).lineTo(x1, y1)
                }
            }

            graphics.stroke({ width: 2, color: 0x000000 })
        },
        [cells, unit],
    )

    return <pixiGraphics draw={draw} />
}

/** Клетки фигуры на доске: (x, y) — левый верх bbox занятых клеток. */
export function getPieceBoardCells(piece: MosaicPiece): { x: number; y: number }[] {
    const local = getShapeLocalCells(piece.type, piece.rotation ?? 0)
    const minX = Math.min(...local.map((cell) => cell.x))
    const minY = Math.min(...local.map((cell) => cell.y))

    return local.map((cell) => ({
        x: piece.x + (cell.x - minX),
        y: piece.y + (cell.y - minY),
    }))
}
