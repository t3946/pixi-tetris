import { UiIcon } from '@components/ui/UiIcon'
import type { GameModeId } from '../gameModes'

type TProps = {
    modeId: GameModeId
    color: string
    size: number
}

export function ModeGlyph({ modeId, color, size }: TProps) {
    if (modeId !== 'free') {
        return null
    }

    return <UiIcon name="star" size={size} tint={color} />
}
