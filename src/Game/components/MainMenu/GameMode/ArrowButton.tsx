import { useState } from 'react'
import { UiIcon } from '@components/ui/UiIcon'

type TProps = {
    dir: 'left' | 'right'
    color: string
    size: number
    onPress: () => void
}

export function ArrowButton({ dir, color, size, onPress }: TProps) {
    const [hovered, setHovered] = useState(false)
    const iconSize = Math.round(size * 0.72)

    return (
        <layoutContainer
            eventMode="static"
            cursor="pointer"
            onPointerTap={onPress}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            alpha={hovered ? 1 : 0.85}
            layout={{
                width: size,
                height: size,
                flexShrink: 0,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <UiIcon
                name="leftArrow"
                size={iconSize}
                tint={color}
                rotation={dir === 'right' ? Math.PI : 0}
            />
        </layoutContainer>
    )
}
