import type { ColorSource } from 'pixi.js'
import { useIconTexture } from '@src/hooks/useIconTexture'
import type { IconName } from '@src/assets/icons'

type TProps = {
    name: IconName
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

    return (
        <layoutContainer layout={{ width: size, height: size }} eventMode="none">
            <pixiSprite
                texture={texture}
                tint={tint}
                alpha={alpha}
                eventMode="none"
                anchor={0.5}
                x={size / 2}
                y={size / 2}
                width={size}
                height={size}
                rotation={rotation}
            />
        </layoutContainer>
    )
}
