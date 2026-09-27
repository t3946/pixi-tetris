import { useEffect, useRef } from 'react'
import { Sprite } from 'pixi.js'
import {
    registerMonominoView,
    unregisterMonominoView,
} from '@src/tetris/clear/monominoViewRegistry'
import { playShatterAnimation } from '@src/tetris/clear/shatter/playShatterAnimation'
import { playPixelRainAnimation } from '@src/tetris/clear/pixelRain/playPixelRainAnimation'
import { playConfettiAnimation } from '@src/tetris/clear/confetti/playConfettiAnimation'
import { playSparkleAnimation } from '@src/tetris/clear/sparkle/playSparkleAnimation'
import { playSamuraiCutAnimation } from '@src/tetris/clear/samuraiCut/playSamuraiCutAnimation'
import { useBlockTheme } from '@src/hooks/useBlockTheme'
import { EPieceType } from '@src/tetris/blocks/themes'

const CELL_PADDING = 1

type TProps = {
    col: number
    row: number
    /** Цвет заливки (tint белого спрайта) */
    color: number
    /** Ожидается целое число (см. computeCellSize) */
    cellSize: number
    alpha?: number
    pieceType?: EPieceType
}

/** Один квадратик-мономино: материал темы + tint цвета фигуры. */
export function Monomino({ col, row, color, cellSize, alpha = 1, pieceType = EPieceType.I }: TProps) {
    const theme = useBlockTheme()
    const material = theme.getMaterial(pieceType)
    const texture = material.texture
    const spriteRef = useRef<Sprite>(null)
    const step = Math.round(cellSize)
    const size = Math.max(0, step - CELL_PADDING * 2)
    // Центр клетки (anchor 0.5) — чтобы shrink/pop/shatter шли из середины.
    const centerX = Math.round(col * step) + CELL_PADDING + size / 2
    const centerY = Math.round(row * step) + CELL_PADDING + size / 2

    useEffect(() => {
        const sprite = spriteRef.current
        if (!sprite) {
            return
        }

        // После схлопывания ряда React/Pixi может переиспользовать инстанс с тем же key
        // row-col — сбрасываем визуал, иначе залипает alpha=0 от shatter.
        sprite.visible = true
        sprite.alpha = alpha
        sprite.tint = color
        sprite.texture = texture
        sprite.width = size
        sprite.height = size

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
            shatter: () => playShatterAnimation(sprite, step),
            pixelRain: () => playPixelRainAnimation(sprite, step),
            confetti: () => playConfettiAnimation(sprite, step),
            sparkle: () => playSparkleAnimation(sprite, step),
            samuraiCut: () => playSamuraiCutAnimation(sprite, step),
        })

        return () => {
            unregisterMonominoView(col, row)
        }
    }, [alpha, col, color, row, size, step, texture])

    return (
        <pixiSprite
            ref={spriteRef}
            texture={texture}
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
