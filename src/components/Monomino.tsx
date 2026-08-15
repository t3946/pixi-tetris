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
    const size = Math.max(0, step - CELL_PADDING * 2)
    // Центр клетки (anchor 0.5) — чтобы shrink шёл к середине, а не в угол.
    const centerX = Math.round(col * step) + CELL_PADDING + size / 2
    const centerY = Math.round(row * step) + CELL_PADDING + size / 2

    useEffect(() => {
        const sprite = spriteRef.current
        if (!sprite) {
            return
        }

        const baseScaleX = sprite.scale.x
        const baseScaleY = sprite.scale.y

        registerMonominoView(col, row, {
            setTint: (tint) => {
                sprite.tint = tint
            },
            setAlpha: (nextAlpha) => {
                sprite.alpha = nextAlpha
            },
            getTint: () => sprite.tint,
            getAlpha: () => sprite.alpha,
            setScale: (scale) => {
                sprite.scale.set(baseScaleX * scale, baseScaleY * scale)
            },
            getScale: () => {
                if (baseScaleX === 0) {
                    return 0
                }
                return sprite.scale.x / baseScaleX
            },
        })

        return () => {
            unregisterMonominoView(col, row)
        }
    }, [col, row])

    return (
        <pixiSprite
            ref={spriteRef}
            texture={Texture.WHITE}
            anchor={0.5}
            x={centerX}
            y={centerY}
            width={size}
            height={size}
            tint={color}
            alpha={alpha}
            roundPixels={true}
        />
    )
}
