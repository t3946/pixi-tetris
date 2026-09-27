type Point = { x: number; y: number }

function cellKey(x: number, y: number): string {
    return `${x},${y}`
}

/** Внешний контур полиомино (обход по часовой, клетки в сетке). */
export function buildPolyominoOutline(cells: readonly Point[]): Point[] {
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

function offsetEdge(p1: Point, p2: Point, offset: number): { a: Point; b: Point } {
    const dx = p2.x - p1.x
    const dy = p2.y - p1.y
    const len = Math.hypot(dx, dy)

    if (len < 1e-6) {
        return { a: p1, b: p2 }
    }

    const ox = (-dy / len) * offset
    const oy = (dx / len) * offset

    return {
        a: { x: p1.x + ox, y: p1.y + oy },
        b: { x: p2.x + ox, y: p2.y + oy },
    }
}

function intersectOffsetEdges(
    a1: Point,
    a2: Point,
    b1: Point,
    b2: Point,
): Point | null {
    const d1x = a2.x - a1.x
    const d1y = a2.y - a1.y
    const d2x = b2.x - b1.x
    const d2y = b2.y - b1.y
    const cross = d1x * d2y - d1y * d2x

    if (Math.abs(cross) < 1e-6) {
        return null
    }

    const t = ((b1.x - a1.x) * d2y - (b1.y - a1.y) * d2x) / cross

    return {
        x: a1.x + t * d1x,
        y: a1.y + t * d1y,
    }
}

/**
 * Смещает осевой полигон внутрь. Корректно обрабатывает вогнутые углы T/L/S/Z.
 * Обход по часовой, y вниз (Pixi).
 */
export function offsetOrthogonalPolygon(points: Point[], offset: number): Point[] {
    const count = points.length

    if (count < 3 || offset === 0) {
        return points.map((point) => ({ ...point }))
    }

    const result: Point[] = []

    for (let i = 0; i < count; i++) {
        const prev = points[(i - 1 + count) % count]
        const curr = points[i]
        const next = points[(i + 1) % count]
        const edgeIn = offsetEdge(prev, curr, offset)
        const edgeOut = offsetEdge(curr, next, offset)
        const vertex = intersectOffsetEdges(edgeIn.a, edgeIn.b, edgeOut.a, edgeOut.b)

        if (vertex) {
            result.push(vertex)
        }
    }

    return result
}
