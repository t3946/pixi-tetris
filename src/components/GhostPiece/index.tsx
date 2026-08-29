import { useCallback, useMemo } from 'react'
import { Graphics } from 'pixi.js'
import { getGhostPiece, type Board } from '@src/tetris/engine'
import { type ActivePiece } from '@src/tetris/tetrominoes'
import { drawPerCellGhostStroke } from './drawPerCellGhost'
import { drawUnifiedGhostStroke } from './drawUnifiedGhost'
import { DEFAULT_GHOST_RENDER_MODE, EGhostRenderMode } from './EGhostRenderMode'
import { GHOST_FILL_ALPHA } from './ghostStyle'
import { useBakedGhostFill } from './useBakedGhostFill'

export { EGhostRenderMode, DEFAULT_GHOST_RENDER_MODE } from './EGhostRenderMode'
export { drawPerCellGhost, drawPerCellGhostFill, drawPerCellGhostStroke } from './drawPerCellGhost'
export { drawUnifiedGhost, drawUnifiedGhostFill, drawUnifiedGhostStroke } from './drawUnifiedGhost'

type TProps = {
    piece: ActivePiece
    board: Board
    cellSize: number
    /** Переопределение режима; по умолчанию — DEFAULT_GHOST_RENDER_MODE. */
    renderMode?: EGhostRenderMode
}

/**
 * Полупрозрачный силуэт активной фигуры в месте приземления.
 * Форма и поворот совпадают с текущим тетромино.
 */
export function GhostPiece({
    piece,
    board,
    cellSize,
    renderMode = DEFAULT_GHOST_RENDER_MODE,
}: TProps) {
    const ghost = useMemo(() => getGhostPiece(piece, board), [board, piece])
    const color = piece.color
    const landed = ghost.y === piece.y
    const style = useMemo(() => ({ color }), [color])
    const fill = useBakedGhostFill({
        piece,
        cellSize,
        renderMode,
        enabled: !landed,
    })

    const drawStroke = useCallback(
        (graphics: Graphics) => {
            graphics.clear()

            if (cellSize <= 0 || landed) {
                return
            }

            if (renderMode === EGhostRenderMode.PerCell) {
                drawPerCellGhostStroke(graphics, piece, cellSize, style)
            } else {
                drawUnifiedGhostStroke(graphics, piece, cellSize, style)
            }
        },
        [cellSize, landed, piece, renderMode, style],
    )

    if (landed) {
        return null
    }

    const x = Math.round(ghost.x * cellSize)
    const y = Math.round(ghost.y * cellSize)

    return (
        <pixiContainer x={x} y={y}>
            {fill != null && (
                <pixiSprite
                    texture={fill.texture}
                    x={fill.x}
                    y={fill.y}
                    alpha={GHOST_FILL_ALPHA}
                    eventMode="none"
                    roundPixels={true}
                />
            )}
            <pixiGraphics draw={drawStroke} eventMode="none" roundPixels={true} />
        </pixiContainer>
    )
}
