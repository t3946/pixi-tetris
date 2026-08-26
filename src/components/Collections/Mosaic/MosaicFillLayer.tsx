import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Container, Graphics } from 'pixi.js'
import type { MosaicFillSource } from '@shaders/mosaicFill'
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
                <pixiSprite texture={bakedTexture} width={width} height={height} eventMode="none" />
            </pixiContainer>
        </>
    )
}
