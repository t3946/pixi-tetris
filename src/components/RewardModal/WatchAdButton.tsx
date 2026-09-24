import { useState } from 'react'
import type { FederatedPointerEvent } from 'pixi.js'
import { useTheme } from '@src/ui/ThemeContext'
import { Color } from '@src/utils/color'
import {
    MISSION_AD_COIN_MULTIPLIER,
    MISSION_AD_JEM_MULTIPLIER,
} from '@src/user/missions'
import { AdBonusHint } from './AdBonusHint'
import { CONTENT_WIDTH } from './constants'
import type { AdState, MissionRewardAmounts } from './types'

type TProps = {
    adState: Exclude<AdState, 'done'>
    adProgress: number
    bonusPreview: MissionRewardAmounts
    onPress: () => void
}

export function WatchAdButton({
    adState,
    adProgress,
    bonusPreview,
    onPress,
}: TProps) {
    const theme = useTheme()
    const watching = adState === 'watching'
    const [hovered, setHovered] = useState(false)

    const handlePress = (event: FederatedPointerEvent) => {
        event.stopPropagation()
        if (!watching) {
            onPress()
        }
    }

    return (
        <layoutContainer
            eventMode={watching ? 'none' : 'static'}
            cursor={watching ? 'default' : 'pointer'}
            onPointerTap={watching ? undefined : handlePress}
            onPointerOver={() => {
                if (!watching) {
                    setHovered(true)
                }
            }}
            onPointerOut={() => setHovered(false)}
            layout={{
                width: CONTENT_WIDTH,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 12,
                paddingRight: 12,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: new Color(theme.MENU.ACCENT).rgba(0.5),
                backgroundColor:
                    hovered && !watching
                        ? new Color(theme.UI.BUTTON_FILL_TOP).rgba(0.55)
                        : new Color(theme.MENU.PANEL).rgba(0.85),
                overflow: 'hidden',
            }}
        >
            {watching && (
                <layoutContainer
                    eventMode="none"
                    layout={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: `${adProgress}%`,
                        height: '100%',
                        backgroundColor: new Color(theme.MENU.GLOW).rgba(0.22),
                    }}
                />
            )}

            <layoutContainer
                eventMode="none"
                layout={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    flex: 1,
                }}
            >
                <layoutContainer
                    eventMode="none"
                    layout={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: theme.MENU.PLAY,
                        flexShrink: 0,
                    }}
                >
                    <layoutText
                        text={watching ? '❚❚' : '▶'}
                        style={{
                            fontFamily: theme.UI.FONT_FAMILY,
                            fontSize: watching ? 12 : 14,
                            fill: theme.TEXT_COLOR,
                            fontWeight: 'bold',
                            align: 'center',
                        }}
                        layout={{ objectFit: 'none' }}
                        roundPixels={true}
                    />
                </layoutContainer>

                <layoutContainer
                    eventMode="none"
                    layout={{
                        flexDirection: 'column',
                        gap: 2,
                        flex: 1,
                    }}
                >
                    <layoutText
                        text={watching ? 'Просмотр...' : 'Смотреть рекламу'}
                        style={{
                            fontFamily: theme.UI.FONT_FAMILY,
                            fontSize: 14,
                            fill: theme.TEXT_COLOR,
                            fontWeight: 'bold',
                        }}
                        layout={{ objectFit: 'none' }}
                        roundPixels={true}
                    />
                    <layoutText
                        text={
                            watching
                                ? `${Math.round(adProgress)}% готово`
                                : `×${MISSION_AD_COIN_MULTIPLIER} монеты + ×${MISSION_AD_JEM_MULTIPLIER} кристаллы`
                        }
                        style={{
                            fontFamily: theme.UI.FONT_FAMILY,
                            fontSize: 11,
                            fill: theme.MENU.ACCENT,
                            fontWeight: 'normal',
                        }}
                        layout={{ objectFit: 'none' }}
                        roundPixels={true}
                    />
                </layoutContainer>
            </layoutContainer>

            <layoutContainer
                eventMode="none"
                layout={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    flexShrink: 0,
                }}
            >
                <AdBonusHint
                    amount={bonusPreview.coin}
                    label="монеты"
                    tint={theme.MENU.GOLD}
                />
                <layoutText
                    text="+"
                    style={{
                        fontFamily: theme.UI.FONT_FAMILY,
                        fontSize: 11,
                        fill: theme.TEXT_MUTED,
                        fontWeight: 'bold',
                    }}
                    layout={{ objectFit: 'none' }}
                    roundPixels={true}
                />
                <AdBonusHint
                    amount={bonusPreview.jem}
                    label="крист."
                    tint={theme.MENU.RUBY}
                />
            </layoutContainer>
        </layoutContainer>
    )
}
