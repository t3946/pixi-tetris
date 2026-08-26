import type { ColorSource } from 'pixi.js'
import { useIconTexture } from '@src/hooks/useIconTexture'
import type { IconName } from '@src/assets/icons'

type TProps = {
    name: IconName
    /** Размер наибольшей стороны; вторая сторона считается по aspect ratio */
    size: number
    tint: ColorSource
    alpha?: number
    rotation?: number
}

export function UiIcon({ name, size, tint, alpha = 1, rotation = 0 }: TProps) {
    const texture = useIconTexture(name)

    if (!texture) {
        return null
    }

    const aspect = texture.frame.width / texture.frame.height
    const width = aspect >= 1 ? size : size * aspect
    const height = aspect >= 1 ? size / aspect : size

    return (
        <layoutContainer layout={{ width, height }} eventMode="none">
            <pixiSprite
                texture={texture}
                tint={tint}
                alpha={alpha}
                eventMode="none"
                anchor={0.5}
                x={width / 2}
                y={height / 2}
                width={width}
                height={height}
                rotation={rotation}
            />
        </layoutContainer>
    )
}
