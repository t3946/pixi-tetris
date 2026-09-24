import { BaseButton } from '@components/ui/BaseButton'
import { useTheme } from '@src/ui/ThemeContext'
import { palette } from '@src/ui/palette'
import { CONTENT_WIDTH } from './constants'
import type { AdState } from './types'

type TProps = {
    collected: boolean
    adState: AdState
    onPress: () => void
}

export function CollectRewardButton({ collected, adState, onPress }: TProps) {
    const theme = useTheme()

    return (
        <BaseButton
            label={collected ? 'Получено!' : 'Забрать награду'}
            onPress={onPress}
            disabled={collected}
            accent={collected ? palette.green_500 : theme.MENU.GOLD}
            textFill={palette.navy_990}
            textFillHover={palette.navy_990}
            fontSize={18}
            appearance={{
                width: CONTENT_WIDTH,
                height: 52,
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
            }}
            layout={{
                marginTop: adState === 'done' ? 0 : 12,
            }}
        />
    )
}
