import { useState } from 'react'
import type { FederatedPointerEvent } from 'pixi.js'
import { UiIcon } from '@components/ui/UiIcon'
import type { IconName } from '@src/assets/icons'
import { useAnimatedNumber } from '@src/hooks/useAnimatedNumber'
import { useTheme } from '@src/ui/ThemeContext'
import { Color } from '@src/utils/color'
import { Easing } from '@src/utils/bezier'
import { AD_MUTE_MS, AD_TRANSFER_MS, CONTENT_WIDTH } from './constants'
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
    amount,
    icon,
    tint,
}: {
    amount: number
    icon: IconName
    tint: string
}) {
    const theme = useTheme()
    const iconSize = icon === 'coins' ? COINS_ICON_SIZE : REWARD_ICON_SIZE

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
                    fontSize: REWARD_FONT_SIZE,
                    fill: tint,
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
    const coin = useAnimatedNumber(draining ? 0 : bonusPreview.coin, {
        duration: AD_TRANSFER_MS,
        easing: Easing.easeOut,
        immediate,
    })
    const jem = useAnimatedNumber(draining ? 0 : bonusPreview.jem, {
        duration: AD_TRANSFER_MS,
        easing: Easing.easeOut,
        immediate,
    })

    const muteProgress = useAnimatedNumber(muted ? 1 : 0, {
        duration: AD_MUTE_MS,
        easing: Easing.easeOut,
        round: false,
    })
    const coinTint = Color.lerp(theme.MENU.GOLD, theme.TEXT_MUTED, muteProgress).toHex()
    const jemTint = Color.lerp(theme.MENU.RUBY, theme.TEXT_MUTED, muteProgress).toHex()

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
                    tint={theme.MENU.ACCENT}
                />
                <pixiText
                    text="Реклама"
                    style={{
                        fontFamily: theme.UI.FONT_FAMILY,
                        fontSize: LABEL_FONT_SIZE,
                        fill: theme.TEXT_COLOR,
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
                <RewardAmount amount={coin} icon="coins" tint={coinTint} />
                <RewardAmount amount={jem} icon="gem" tint={jemTint} />
            </layoutContainer>
        </layoutContainer>
    )
}
