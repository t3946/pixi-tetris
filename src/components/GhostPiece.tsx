import { useCallback, useMemo } from 'react'
import { Graphics } from 'pixi.js'
import { getGhostPiece, type Board } from '@src/tetris/engine'
import { getShapeLocalCells, type ActivePiece } from '@src/tetris/tetrominoes'

/** Как у Monomino: контур на 1px внутри клетки. */
const INSET = 1
const STROKE_WIDTH = 2
const CORNER_RADIUS = 4
const FILL_ALPHA = 0.22
const STROKE_ALPHA = 0.7

type Point = { x: number; y: number }

type TProps = {
    piece: ActivePiece
    board: Board
    cellSize: number
}

function cellKey(x: number, y: number): string {
    return `${x},${y}`
}

/** Внешний контур полиомино (обход по часовой, клетки в сетке). */
function buildOutline(cells: readonly Point[]): Point[] {
    const occupied = new Set(cells.map((cell) => cellKey(cell.x, cell.y)))
    const has = (x: number, y: number) => occupied.has(cellKey(x, y))

    type Edge = { x1: number; y1: number; x2: number; y2: number }
    const edges: Edge[] = []

    for (const { x, y } of cells) {
        if (!has(x, y - 1)) {
            edges.push({ x1: x, y1: y, x2: x + 1, y2: y })
        }
        if (!has(x + 1, y)) {
            edges.push({ x1: x + 1, y1: y, x2: x + 1, y2: y + 1 })
        }
        if (!has(x, y + 1)) {
            edges.push({ x1: x + 1, y1: y + 1, x2: x, y2: y + 1 })
        }
        if (!has(x - 1, y)) {
            edges.push({ x1: x, y1: y + 1, x2: x, y2: y })
        }
    }

    if (edges.length === 0) {
        return []
    }

    const remaining = [...edges]
    let current = remaining.shift()!
    const polygon: Point[] = [{ x: current.x1, y: current.y1 }]

    while (remaining.length > 0) {
        const index = remaining.findIndex((edge) => edge.x1 === current.x2 && edge.y1 === current.y2)
        if (index === -1) {
            break
        }

        current = remaining.splice(index, 1)[0]
        polygon.push({ x: current.x1, y: current.y1 })
    }

    return simplifyCollinear(polygon)
}

function simplifyCollinear(points: Point[]): Point[] {
    const count = points.length
    if (count < 3) {
        return points
    }

    const result: Point[] = []

    for (let i = 0; i < count; i++) {
        const prev = points[(i - 1 + count) % count]
        const curr = points[i]
        const next = points[(i + 1) % count]
        const cross =
            (curr.x - prev.x) * (next.y - curr.y) - (curr.y - prev.y) * (next.x - curr.x)

        if (cross !== 0) {
            result.push(curr)
        }
    }

    return result
}

/** Сжимает осевой полигон внутрь. Обход по часовой, y вниз. */
function insetPolygon(points: Point[], inset: number): Point[] {
    const count = points.length

    return points.map((curr, i) => {
        const prev = points[(i - 1 + count) % count]
        const next = points[(i + 1) % count]
        const inDx = Math.sign(curr.x - prev.x)
        const inDy = Math.sign(curr.y - prev.y)
        const outDx = Math.sign(next.x - curr.x)
        const outDy = Math.sign(next.y - curr.y)

        return {
            x: curr.x + (-inDy - outDy) * inset,
            y: curr.y + (inDx + outDx) * inset,
        }
    })
}

/**
 * Полупрозрачный силуэт активной фигуры в месте приземления.
 * Форма и поворот совпадают с текущим тетромино.
 */
export function GhostPiece({ piece, board, cellSize }: TProps) {
    const ghost = useMemo(() => getGhostPiece(piece, board), [board, piece])
    const color = piece.color
    const landed = ghost.y === piece.y

    const drawGhost = useCallback(
        (graphics: Graphics) => {
            graphics.clear()

            if (cellSize <= 0 || landed) {
                return
            }

            const cells = getShapeLocalCells(piece.type, piece.rotation)
            const outline = buildOutline(cells)
            if (outline.length < 3) {
                return
            }

            const scaled = outline.map((point) => ({
                x: point.x * cellSize,
                y: point.y * cellSize,
            }))
            const path = insetPolygon(scaled, INSET)
            const cornerRadius = Math.min(CORNER_RADIUS, Math.max(0, cellSize / 5))

            graphics
                .roundShape(path, cornerRadius)
                .fill({ color, alpha: FILL_ALPHA })
                .stroke({
                    width: STROKE_WIDTH,
                    color,
                    alpha: STROKE_ALPHA,
                    alignment: 1,
                    join: 'round',
                })
        },
        [cellSize, color, landed, piece.rotation, piece.type],
    )

    if (landed) {
        return null
    }

    return (
        <pixiGraphics
            draw={drawGhost}
            x={Math.round(ghost.x * cellSize)}
            y={Math.round(ghost.y * cellSize)}
            eventMode="none"
            roundPixels={true}
        />
    )
}
