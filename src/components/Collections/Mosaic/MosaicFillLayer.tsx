import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Container, Graphics } from 'pixi.js'
import type { MosaicFillSource } from '@components/Collections/Mosaic/mosaicFill'
import { getPieceBoardCells, type MosaicPiece } from '@components/Collections/Mosaic/mosaicPieceCells'
import { useShaderBakeTexture } from '@components/Collections/Mosaic/useShaderBakeTexture'

type TProps = {
    fill: MosaicFillSource
    width: number
    height: number
    unit: number
    pieces: readonly MosaicPiece[]
}

export function MosaicFillLayer({ fill, width, height, unit, pieces }: TProps) {
    const bakedTexture = useShaderBakeTexture(fill)
    const maskRef = useRef<Graphics>(null)
    const groupRef = useRef<Container>(null)

    /** Единый scale: портретная bake-текстура по ширине мозаики, без сплющивания */
    const fillScale = width / fill.bakeWidth

    const cells = useMemo(
        () => pieces.flatMap((piece) => getPieceBoardCells(piece)),
        [pieces],
    )

    const drawMask = useCallback(
        (graphics: Graphics) => {
            graphics.clear()

            for (const cell of cells) {
                graphics.rect(cell.x * unit, cell.y * unit, unit, unit).fill({ color: 0xffffff })
            }
        },
        [cells, unit],
    )

    useEffect(() => {
        const group = groupRef.current
        const mask = maskRef.current

        if (!group || !mask) {
            return
        }

        group.mask = mask

        return () => {
            group.mask = null
        }
    }, [])

    return (
        <>
            <pixiGraphics ref={maskRef} draw={drawMask} eventMode="none" />

            <pixiContainer ref={groupRef} eventMode="none">
                <pixiSprite
                    texture={bakedTexture}
                    x={0}
                    y={height}
                    anchor={{ x: 0, y: 1 }}
                    scale={{ x: fillScale, y: fillScale }}
                    eventMode="none"
                />
            </pixiContainer>
        </>
    )
}
