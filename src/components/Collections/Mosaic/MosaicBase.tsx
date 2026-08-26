import { useCallback, useMemo } from 'react'
import { Graphics } from 'pixi.js'
import type { MosaicFillSource } from '@components/Collections/Mosaic/mosaicFill'
import { MosaicFillLayer } from '@components/Collections/Mosaic/MosaicFillLayer'
import { getPieceBoardCells, type MosaicPiece } from '@components/Collections/Mosaic/mosaicPieceCells'

export type { MosaicPiece } from '@components/Collections/Mosaic/mosaicPieceCells'
export { getPieceBoardCells } from '@components/Collections/Mosaic/mosaicPieceCells'

type TProps = {
    /** Мультипликатор клетки сетки */
    size: number | string
    pieces: readonly MosaicPiece[]
    /** Сколько первых деталей показать после сортировки */
    progress?: number
    /** Шейдерная заливка (запекается в текстуру и маскируется по клеткам) */
    fill?: MosaicFillSource
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
export function MosaicBase({ size, pieces, progress, fill }: TProps) {
    const cols = 5
    const rows = 8
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
                {fill != null && (
                    <MosaicFillLayer
                        fill={fill}
                        width={width}
                        height={height}
                        unit={unit}
                        pieces={visiblePieces}
                    />
                )}

                {visiblePieces.map((piece, index) =>
                    fill != null ? (
                        <MosaicPieceEdges key={index} piece={piece} unit={unit} />
                    ) : (
                        <MosaicPieceGraphics key={index} piece={piece} unit={unit} />
                    ),
                )}
            </pixiContainer>
        </layoutContainer>
    )
}

function MosaicPieceEdges({ piece, unit }: { piece: MosaicPiece; unit: number }) {
    const cells = getPieceBoardCells(piece)

    const draw = useCallback(
        (graphics: Graphics) => {
            graphics.clear()

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
