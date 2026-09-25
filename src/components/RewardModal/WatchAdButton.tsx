import { useState } from 'react'
import { BaseButton } from '@components/ui/BaseButton'
import { UiIcon } from '@components/ui/UiIcon'
import type { IconName } from '@src/assets/icons'
import { useAnimatedNumber } from '@src/hooks/useAnimatedNumber'
import { usePulse } from '@src/hooks/usePulse'
import { useTheme } from '@src/ui/ThemeContext'
import { palette } from '@src/ui/palette'
import { Color } from '@src/utils/color'
import { Easing } from '@src/utils/bezier'
import {
    AD_MUTE_MS,
    AD_TRANSFER_MS,
    AMOUNT_PULSE_LIGHTEN,
    AMOUNT_PULSE_MS,
    AMOUNT_PULSE_SCALE,
    CONTENT_WIDTH,
} from './constants'
import type { AdState, MissionRewardAmounts } from './types'

type TProps = {
    adState: AdState
    bonusPreview: MissionRewardAmounts
    /** «Забрать» без просмотра рекламы — награды в кнопке сереют */
    muted: boolean
    /** Довести счётчики до цели без анимации */
    immediate?: boolean
    onPress: () => void
}

const ROW_HEIGHT = 52
const ROW_GAP = 10
const HALF_WIDTH = (CONTENT_WIDTH - ROW_GAP) / 2
const ICON_SIZE = 18
const LABEL_FONT_SIZE = 18
const REWARD_ICON_SIZE = 18
const COINS_ICON_SIZE = Math.round(REWARD_ICON_SIZE * 1.2)
const REWARD_FONT_SIZE = 18

function RewardAmount({
    target,
    icon,
    tint,
    immediate,
}: {
    target: number
    icon: IconName
    tint: string
    immediate: boolean
}) {
    const theme = useTheme()
    const iconSize = icon === 'coins' ? COINS_ICON_SIZE : REWARD_ICON_SIZE
    const [pulseGen, setPulseGen] = useState(0)
    const pulse = usePulse(pulseGen, AMOUNT_PULSE_MS)

    const amount = useAnimatedNumber(target, {
        duration: AD_TRANSFER_MS,
        easing: Easing.easeOut,
        immediate,
        onComplete: () => setPulseGen((generation) => generation + 1),
    })

    const fontSize = REWARD_FONT_SIZE * (1 + AMOUNT_PULSE_SCALE * pulse)
    const fill = new Color(tint).lighten(AMOUNT_PULSE_LIGHTEN * pulse).toHex()

    return (
        <layoutContainer
            eventMode="none"
            layout={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                flexGrow: 0,
                flexShrink: 0,
            }}
        >
            <pixiText
                text={`${amount}`}
                style={{
                    fontFamily: theme.UI.FONT_FAMILY,
                    fontSize,
                    fill,
                    fontWeight: 'bold',
                }}
                layout={{ objectFit: 'none' }}
                roundPixels={true}
            />
            <UiIcon name={icon} size={iconSize} tint={tint} />
        </layoutContainer>
    )
}

export function WatchAdButton({
    adState,
    bonusPreview,
    muted,
    immediate = false,
    onPress,
}: TProps) {
    const theme = useTheme()
    const busy = adState !== 'idle'
    const locked = busy || muted

    const draining = adState === 'transferring' || adState === 'done'

    const muteProgress = useAnimatedNumber(muted ? 1 : 0, {
        duration: AD_MUTE_MS,
        easing: Easing.easeOut,
        round: false,
    })
    const coinTint = Color.lerp(theme.MENU.GOLD, theme.TEXT_MUTED, muteProgress).toHex()
    const jemTint = Color.lerp(theme.MENU.RUBY, theme.TEXT_MUTED, muteProgress).toHex()

    return (
        <layoutContainer
            eventMode="passive"
            layout={{
                width: CONTENT_WIDTH,
                height: ROW_HEIGHT,
                flexDirection: 'row',
                alignItems: 'center',
                gap: ROW_GAP,
            }}
        >
            <BaseButton
                label="Реклама"
                onPress={onPress}
                disabled={locked}
                disabledAlpha={0.55}
                accent={theme.MENU.SECONDARY}
                accentTo={theme.MENU.SECONDARY_TO}
                textFill={palette.white}
                textFillHover={palette.white}
                iconLeft="clapperboardPlay"
                iconSize={ICON_SIZE}
                fontSize={LABEL_FONT_SIZE}
                appearance={{
                    width: HALF_WIDTH,
                    height: ROW_HEIGHT,
                    borderRadius: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            />

            <layoutContainer
                eventMode="none"
                layout={{
                    width: HALF_WIDTH,
                    height: ROW_HEIGHT,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    paddingLeft: 14,
                    paddingRight: 14,
                    borderRadius: 12,
                    borderWidth: 1.5,
                    borderColor: new Color(theme.MENU.ACCENT).rgba(0.5),
                    backgroundColor: new Color(theme.MENU.PANEL).rgba(0.85),
                    flexGrow: 0,
                    flexShrink: 0,
                }}
            >
                <RewardAmount
                    target={draining ? 0 : bonusPreview.coin}
                    icon="coins"
                    tint={coinTint}
                    immediate={immediate}
                />
                <RewardAmount
                    target={draining ? 0 : bonusPreview.jem}
                    icon="gem"
                    tint={jemTint}
                    immediate={immediate}
                />
            </layoutContainer>
        </layoutContainer>
    )
}
