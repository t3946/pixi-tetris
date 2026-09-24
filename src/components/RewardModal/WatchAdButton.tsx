import { useState } from 'react'
import type { FederatedPointerEvent } from 'pixi.js'
import { UiIcon } from '@components/ui/UiIcon'
import type { IconName } from '@src/assets/icons'
import { useAnimatedNumber } from '@src/hooks/useAnimatedNumber'
import { usePulse } from '@src/hooks/usePulse'
import { useTheme } from '@src/ui/ThemeContext'
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

const BUTTON_HEIGHT = 52
const ICON_SIZE = 22
const LABEL_FONT_SIZE = 16
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
    const [hovered, setHovered] = useState(false)

    const draining = adState === 'transferring' || adState === 'done'

    const muteProgress = useAnimatedNumber(muted ? 1 : 0, {
        duration: AD_MUTE_MS,
        easing: Easing.easeOut,
        round: false,
    })
    const coinTint = Color.lerp(theme.MENU.GOLD, theme.TEXT_MUTED, muteProgress).toHex()
    const jemTint = Color.lerp(theme.MENU.RUBY, theme.TEXT_MUTED, muteProgress).toHex()
    const labelTint = Color.lerp(theme.TEXT_COLOR, theme.TEXT_MUTED, muteProgress).toHex()
    const iconTint = Color.lerp(theme.MENU.ACCENT, theme.TEXT_MUTED, muteProgress).toHex()

    const handlePress = (event: FederatedPointerEvent) => {
        event.stopPropagation()
        if (!locked) {
            onPress()
        }
    }

    return (
        <layoutContainer
            eventMode={locked ? 'none' : 'static'}
            cursor={locked ? 'default' : 'pointer'}
            onPointerTap={locked ? undefined : handlePress}
            onPointerOver={() => {
                if (!locked) {
                    setHovered(true)
                }
            }}
            onPointerOut={() => setHovered(false)}
            layout={{
                width: CONTENT_WIDTH,
                height: BUTTON_HEIGHT,
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 14,
                paddingRight: 14,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: new Color(theme.MENU.ACCENT).rgba(0.5),
                backgroundColor:
                    hovered && !locked
                        ? new Color(theme.UI.BUTTON_FILL_TOP).rgba(0.55)
                        : new Color(theme.MENU.PANEL).rgba(0.85),
            }}
        >
            <layoutContainer
                eventMode="none"
                layout={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    flexGrow: 1,
                    flexShrink: 1,
                }}
            >
                <UiIcon
                    name="clapperboardPlay"
                    size={ICON_SIZE}
                    tint={iconTint}
                />
                <pixiText
                    text="Реклама"
                    style={{
                        fontFamily: theme.UI.FONT_FAMILY,
                        fontSize: LABEL_FONT_SIZE,
                        fill: labelTint,
                        fontWeight: 'bold',
                    }}
                    layout={{ objectFit: 'none' }}
                    roundPixels={true}
                />
            </layoutContainer>

            <layoutContainer
                eventMode="none"
                layout={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
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
