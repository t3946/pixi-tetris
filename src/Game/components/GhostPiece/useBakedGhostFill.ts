import { useEffect, useState } from 'react'
import { Graphics, RenderTexture, type Texture } from 'pixi.js'
import { useApplication } from '@pixi/react'
import type { ActivePiece } from '@src/tetris/tetrominoes'
import { drawPerCellGhostFill } from './drawPerCellGhost'
import { drawUnifiedGhostFill } from './drawUnifiedGhost'
import { EGhostRenderMode } from './EGhostRenderMode'

export type BakedGhostFill = {
    texture: Texture
    x: number
    y: number
}

type TArgs = {
    piece: Pick<ActivePiece, 'type' | 'rotation' | 'color'>
    cellSize: number
    renderMode: EGhostRenderMode
    enabled: boolean
}

/**
 * Запекает непрозрачную заливку ghost в текстуру.
 * Иначе Pixi рисует полигон треугольниками и при alpha < 1 швы earcut видны.
 */
export function useBakedGhostFill({
    piece,
    cellSize,
    renderMode,
    enabled,
}: TArgs): BakedGhostFill | null {
    const { app, isInitialised } = useApplication()
    const [baked, setBaked] = useState<BakedGhostFill | null>(null)

    useEffect(() => {
        if (!isInitialised || !enabled || cellSize <= 0) {
            setBaked(null)
            return
        }

        const graphics = new Graphics()
        const style = { color: piece.color }

        if (renderMode === EGhostRenderMode.PerCell) {
            drawPerCellGhostFill(graphics, piece, cellSize, style)
        } else {
            drawUnifiedGhostFill(graphics, piece, cellSize, style)
        }

        const bounds = graphics.getLocalBounds()

        if (bounds.width <= 0 || bounds.height <= 0) {
            graphics.destroy()
            setBaked(null)
            return
        }

        const texture = RenderTexture.create({
            width: Math.ceil(bounds.width),
            height: Math.ceil(bounds.height),
            resolution: app.renderer.resolution,
            antialias: true,
        })

        graphics.position.set(-bounds.x, -bounds.y)
        app.renderer.render({
            container: graphics,
            target: texture,
            clear: true,
        })
        graphics.destroy()

        const next = { texture, x: bounds.x, y: bounds.y }
        setBaked(next)

        return () => {
            next.texture.destroy(true)
        }
    }, [
        app.renderer,
        cellSize,
        enabled,
        isInitialised,
        piece.color,
        piece.rotation,
        piece.type,
        renderMode,
    ])

    return baked
}
