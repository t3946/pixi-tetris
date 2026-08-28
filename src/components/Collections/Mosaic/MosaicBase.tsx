import { useCallback, useMemo } from 'react'
import { Graphics } from 'pixi.js'
import type { MosaicFillSource } from '@components/Collections/Mosaic/mosaicFill'
import { MosaicFillLayer } from '@components/Collections/Mosaic/MosaicFillLayer'
import { getPieceBoardCells, type MosaicPiece } from '@components/Collections/Mosaic/mosaicPieceCells'
import { Color } from '@src/utils/color'

export type { MosaicPiece } from '@components/Collections/Mosaic/mosaicPieceCells'
export { getPieceBoardCells } from '@components/Collections/Mosaic/mosaicPieceCells'

const DEFAULT_BORDER_RADIUS = 5
const FRAME_BORDER_WIDTH = 2
const DEFAULT_EDGE_COLOR = new Color(0x000000)
/** Затемнение accent для заливки placeholder-деталей */
const PLACEHOLDER_FILL_DARKEN = 0.20

type StrokeColor = { color: number; alpha: number }

type TProps = {
    /** Общая ширина мозаики в пикселях */
    width: number
    /** Скругление внешней рамки */
    borderRadius?: number
    pieces: readonly MosaicPiece[]
    /** Сколько первых деталей собрано; остальные — тёмный placeholder-слой на базе accent */
    progress?: number
    /** Шейдерная заливка (запекается в текстуру и маскируется по клеткам) */
    fill?: MosaicFillSource
    /** Цвет рёбер деталей (alpha учитывается при отрисовке) */
    edgeColor?: Color
    /** Цвет внешней рамки (по умолчанию edgeColor) */
    frameColor?: Color
}

function sortMosaicPieces(pieces: readonly MosaicPiece[]): MosaicPiece[] {
    return [...pieces].sort((a, b) => {
        if (b.y !== a.y) {
            return b.y - a.y
        }

        return a.x - b.x
    })
}

function resolveStroke(color: Color): StrokeColor {
    return color.toStroke()
}

/**
 * Абстрактный конструктор мозаики: рисует набор тетромино-деталей на сетке.
 */
export function MosaicBase({
    width,
    borderRadius = DEFAULT_BORDER_RADIUS,
    pieces,
    progress,
    fill,
    edgeColor = DEFAULT_EDGE_COLOR,
    frameColor,
}: TProps) {
    const cols = 8
    const rows = 5
    const unit = width / cols
    const height = rows * unit
    const outerFrameColor = frameColor ?? edgeColor

    const edgeStroke = useMemo(() => resolveStroke(edgeColor), [edgeColor.toHexa()])
    const frameStroke = useMemo(() => resolveStroke(outerFrameColor), [outerFrameColor.toHexa()])

    const sortedPieces = useMemo(() => sortMosaicPieces(pieces), [pieces])

    const collectedPieces = useMemo(() => {
        return progress != null ? sortedPieces.slice(0, progress) : sortedPieces
    }, [sortedPieces, progress])

    const placeholderPieces = useMemo(() => {
        return progress != null ? sortedPieces.slice(progress) : []
    }, [sortedPieces, progress])

    const placeholderFillColor = useMemo(
        () => edgeColor.clone().darken(PLACEHOLDER_FILL_DARKEN).toNumber(),
        [edgeColor.toHexa()],
    )

    return (
        <layoutContainer
            layout={{
                width,
                height,
                flexShrink: 0,
                borderRadius,
                overflow: 'hidden',
            }}
        >
            <pixiContainer>
                {placeholderPieces.map((piece, index) => (
                    <MosaicPieceGraphics
                        key={`placeholder-${index}`}
                        piece={piece}
                        unit={unit}
                        fillColor={placeholderFillColor}
                        stroke={edgeStroke}
                    />
                ))}

                {fill != null && (
                    <MosaicFillLayer
                        fill={fill}
                        width={width}
                        height={height}
                        unit={unit}
                        pieces={collectedPieces}
                    />
                )}

                {collectedPieces.map((piece, index) =>
                    fill != null ? (
                        <MosaicPieceEdges key={index} piece={piece} unit={unit} stroke={edgeStroke} />
                    ) : (
                        <MosaicPieceGraphics key={index} piece={piece} unit={unit} stroke={edgeStroke} />
                    ),
                )}

                <MosaicOuterFrame
                    width={width}
                    height={height}
                    borderRadius={borderRadius}
                    stroke={frameStroke}
                />
            </pixiContainer>
        </layoutContainer>
    )
}

function MosaicOuterFrame({
    width,
    height,
    borderRadius,
    stroke,
}: {
    width: number
    height: number
    borderRadius: number
    stroke: StrokeColor
}) {
    const inset = FRAME_BORDER_WIDTH / 2
    const frameRadius = Math.max(0, borderRadius - inset)

    const draw = useCallback(
        (graphics: Graphics) => {
            graphics.clear()

            graphics
                .roundRect(inset, inset, width - FRAME_BORDER_WIDTH, height - FRAME_BORDER_WIDTH, frameRadius)
                .fill({ color: 0xffffff, alpha: 0 })
                .stroke({ width: FRAME_BORDER_WIDTH, color: stroke.color, alpha: stroke.alpha })
        },
        [width, height, frameRadius, stroke.color, stroke.alpha],
    )

    return <pixiGraphics draw={draw} eventMode="none" />
}

function MosaicPieceEdges({
    piece,
    unit,
    stroke,
}: {
    piece: MosaicPiece
    unit: number
    stroke: StrokeColor
}) {
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

            graphics.stroke({ width: 2, color: stroke.color, alpha: stroke.alpha })
        },
        [cells, unit, stroke.color, stroke.alpha],
    )

    return <pixiGraphics draw={draw} />
}

function MosaicPieceGraphics({
    piece,
    unit,
    stroke,
    fillColor = 0xffffff,
}: {
    piece: MosaicPiece
    unit: number
    stroke: StrokeColor
    fillColor?: number
}) {
    const cells = getPieceBoardCells(piece)

    const draw = useCallback(
        (graphics: Graphics) => {
            graphics.clear()

            for (const cell of cells) {
                graphics.rect(cell.x * unit, cell.y * unit, unit, unit).fill({ color: fillColor })
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

            graphics.stroke({ width: 2, color: stroke.color, alpha: stroke.alpha })
        },
        [cells, unit, stroke.color, stroke.alpha, fillColor],
    )

    return <pixiGraphics draw={draw} />
}
