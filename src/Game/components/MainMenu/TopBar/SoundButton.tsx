import { useState } from 'react'
import { UiIcon } from '@components/ui/UiIcon'
import { useTheme } from '@src/ui/ThemeContext'

type TProps = {
    scale: number
}

export function SoundButton({ scale }: TProps) {
    const theme = useTheme()
    const [muted, setMuted] = useState(false)
    const iconSize = Math.round(20 * scale)
    const pad = Math.round(8 * scale)

    return (
        <layoutContainer
            eventMode="static"
            cursor="pointer"
            onPointerTap={() => setMuted((value) => !value)}
            layout={{
                flexShrink: 0,
                paddingTop: pad,
                paddingBottom: pad,
                paddingLeft: pad,
                paddingRight: pad,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 999,
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.2)',
            }}
        >
            <UiIcon
                name={muted ? 'volumeMute' : 'volume'}
                size={iconSize}
                tint={theme.TEXT_COLOR}
            />
        </layoutContainer>
    )
}
