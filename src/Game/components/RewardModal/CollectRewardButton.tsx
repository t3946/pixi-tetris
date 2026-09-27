import { BaseButton } from '@components/ui/BaseButton'
import { useAnimatedNumber } from '@src/hooks/useAnimatedNumber'
import { useTheme } from '@src/ui/ThemeContext'
import { palette } from '@src/ui/palette'
import { Color } from '@src/utils/color'
import { Easing } from '@src/utils/bezier'
import { CONTENT_WIDTH } from './constants'

type TProps = {
    collected: boolean
    onPress: () => void
}

const COLLECT_TRANSITION_MS = 500

export function CollectRewardButton({ collected, onPress }: TProps) {
    const theme = useTheme()
    const progress = useAnimatedNumber(collected ? 1 : 0, {
        duration: COLLECT_TRANSITION_MS,
        easing: Easing.easeOut,
        round: false,
    })

    const accent = Color.lerp(theme.MENU.PRIMARY, palette.green_500, progress)
    const accentTo = Color.lerp(
        theme.MENU.PRIMARY_TO,
        new Color(palette.green_500).darken(0.55),
        progress,
    )
    const textFill = collected ? palette.white : theme.MENU.PRIMARY_TEXT

    return (
        <BaseButton
            label={collected ? 'Получено' : 'Забрать'}
            onPress={onPress}
            disabled={collected}
            disabledAlpha={1}
            accent={accent}
            accentTo={accentTo}
            textFill={textFill}
            textFillHover={textFill}
            iconLeft={progress > 0.01 ? 'thumbUp' : undefined}
            iconSize={18}
            fontSize={18}
            appearance={{
                width: CONTENT_WIDTH,
                height: 52,
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
            }}
            layout={{
                marginTop: 12,
            }}
        />
    )
}
