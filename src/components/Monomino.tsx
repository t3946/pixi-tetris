import { useEffect, useRef } from 'react'
import { Sprite, Texture } from 'pixi.js'
import {
    registerMonominoView,
    unregisterMonominoView,
} from '@src/tetris/clear/monominoViewRegistry'

const CELL_PADDING = 1

type TProps = {
    col: number
    row: number
    /** Цвет заливки (tint белого спрайта) */
    color: number
    /** Ожидается целое число (см. computeCellSize) */
    cellSize: number
    alpha?: number
}

/** Один квадратик-мономино: белый спрайт с tint. */
export function Monomino({ col, row, color, cellSize, alpha = 1 }: TProps) {
    const spriteRef = useRef<Sprite>(null)
    const step = Math.round(cellSize)
    const x = Math.round(col * step) + CELL_PADDING
    const y = Math.round(row * step) + CELL_PADDING
    const size = Math.max(0, step - CELL_PADDING * 2)

    useEffect(() => {
        const sprite = spriteRef.current
        if (!sprite) {
            return
        }

        registerMonominoView(col, row, {
            setTint: (tint) => {
                sprite.tint = tint
            },
            setAlpha: (nextAlpha) => {
                sprite.alpha = nextAlpha
            },
            getTint: () => sprite.tint,
            getAlpha: () => sprite.alpha,
        })

        return () => {
            unregisterMonominoView(col, row)
        }
    }, [col, row])

    return (
        <pixiSprite
            ref={spriteRef}
            texture={Texture.WHITE}
            x={x}
            y={y}
            width={size}
            height={size}
            tint={color}
            alpha={alpha}
            roundPixels={true}
        />
    )
}
