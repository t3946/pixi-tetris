/** Как у Monomino: контур на 1px внутри клетки. */
export const GHOST_CELL_PADDING = 1
export const GHOST_STROKE_WIDTH = 2
export const GHOST_CORNER_RADIUS = 4
export const GHOST_FILL_ALPHA = 0.22
export const GHOST_STROKE_ALPHA = 0.7

export type GhostDrawStyle = {
    color: number
    fillAlpha?: number
    strokeAlpha?: number
    strokeWidth?: number
    cornerRadius?: number
    cellPadding?: number
}
