import { useEffect, useRef, useState } from 'react'
import type { FederatedPointerEvent } from 'pixi.js'
import { Modal } from '@components/ui/Modal'
import { BaseButton } from '@components/ui/BaseButton'
import { SceneId, useScene } from '@src/scenes/SceneContext'
import { useTheme } from '@src/ui/ThemeContext'
import { useUser } from '@src/user/UserContext'
import { UiIcon } from '@components/ui/UiIcon'
import type { IconName } from '@src/assets/icons'
import { Color } from '@src/utils/color'
import { palette } from '@src/ui/palette'
import {
    getMissionReward,
    MISSION_AD_COIN_MULTIPLIER,
    MISSION_AD_JEM_MULTIPLIER,
    MISSION_REWARD,
} from '@src/user/missions'

type TProps = {
    open: boolean
    /** Превью на главном экране: после «Забрать» сбрасывает состояние, не уходит со сцены */
    preview?: boolean
}

type AdState = 'idle' | 'watching' | 'done'

const CONTENT_WIDTH = 300
const AD_DURATION_MS = 5000

export function MissionCompleteModal({ open, preview = false }: TProps) {
    const theme = useTheme()
    const { setScene } = useScene()
    const { claimActiveMissionReward } = useUser()

    const [adState, setAdState] = useState<AdState>('idle')
    const [adProgress, setAdProgress] = useState(0)
    const [collected, setCollected] = useState(false)
    const adTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const collectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const adBonus = adState === 'done'
    const reward = getMissionReward(adBonus)
    const bonusPreview = getMissionReward(true)

    const resetLocalState = () => {
        setAdState('idle')
        setAdProgress(0)
        setCollected(false)
        if (adTimerRef.current) {
            clearInterval(adTimerRef.current)
            adTimerRef.current = null
        }
        if (collectTimerRef.current) {
            clearTimeout(collectTimerRef.current)
            collectTimerRef.current = null
        }
    }

    useEffect(() => {
        if (!open) {
            resetLocalState()
        }
    }, [open])

    useEffect(
        () => () => {
            if (adTimerRef.current) {
                clearInterval(adTimerRef.current)
            }
            if (collectTimerRef.current) {
                clearTimeout(collectTimerRef.current)
            }
        },
        [],
    )

    const handleWatchAd = () => {
        if (adState !== 'idle') {
            return
        }

        setAdState('watching')
        setAdProgress(0)
        const start = Date.now()

        adTimerRef.current = setInterval(() => {
            const elapsed = Date.now() - start
            const pct = Math.min((elapsed / AD_DURATION_MS) * 100, 100)
            setAdProgress(pct)

            if (pct >= 100) {
                if (adTimerRef.current) {
                    clearInterval(adTimerRef.current)
                    adTimerRef.current = null
                }
                setAdState('done')
            }
        }, 50)
    }

    const handleCollect = () => {
        if (collected) {
            return
        }

        setCollected(true)

        if (preview) {
            collectTimerRef.current = setTimeout(resetLocalState, 450)
            return
        }

        claimActiveMissionReward(adBonus)
        collectTimerRef.current = setTimeout(() => setScene(SceneId.MainMenu), 450)
    }

    return (
        <Modal open={open}>
            <layoutContainer
                layout={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: CONTENT_WIDTH,
                    gap: 0,
                }}
            >
                <layoutContainer
                    layout={{
                        width: '100%',
                        height: 3,
                        marginBottom: 18,
                        borderRadius: 2,
                        backgroundColor: theme.MENU.GOLD,
                    }}
                />

                <layoutText
                    text="Поздравляем!"
                    style={{
                        fontSize: 28,
                        fill: theme.MENU.GOLD,
                        fontWeight: 'bold',
                        align: 'center',
                        fontFamily: theme.MENU.FONT_DISPLAY,
                    }}
                    layout={{
                        objectFit: 'none',
                        objectPosition: 'center',
                        marginBottom: 6,
                    }}
                    roundPixels={true}
                />

                <layoutText
                    text={
                        adBonus
                            ? 'Бонус получен — награда увеличена!'
                            : 'Вы заработали награду'
                    }
                    style={{
                        fontSize: 13,
                        fill: theme.TEXT_MUTED,
                        fontWeight: 'normal',
                        align: 'center',
                        fontFamily: theme.UI.FONT_FAMILY,
                    }}
                    layout={{
                        objectFit: 'none',
                        objectPosition: 'center',
                        marginBottom: 18,
                    }}
                    roundPixels={true}
                />

                <layoutContainer
                    layout={{
                        flexDirection: 'row',
                        width: '100%',
                        gap: 12,
                        marginBottom: 16,
                    }}
                >
                    <RewardCard
                        icon="coins"
                        accent={theme.MENU.GOLD}
                        amount={reward.coin}
                        baseAmount={MISSION_REWARD.coin}
                        label="Монеты"
                        bonusLabel={adBonus ? `×${MISSION_AD_COIN_MULTIPLIER} бонус!` : null}
                        showBaseStrike={adBonus}
                    />
                    <RewardCard
                        icon="gem"
                        accent={theme.MENU.RUBY}
                        amount={reward.jem}
                        baseAmount={MISSION_REWARD.jem}
                        label="Кристаллы"
                        bonusLabel={adBonus ? `×${MISSION_AD_JEM_MULTIPLIER} бонус!` : null}
                        showBaseStrike={adBonus}
                    />
                </layoutContainer>

                {adState !== 'done' && (
                    <WatchAdButton
                        adState={adState}
                        adProgress={adProgress}
                        bonusPreview={bonusPreview}
                        onPress={handleWatchAd}
                    />
                )}

                <BaseButton
                    label={collected ? 'Получено!' : 'Забрать награду'}
                    onPress={handleCollect}
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
            </layoutContainer>
        </Modal>
    )
}

function RewardCard({
    icon,
    accent,
    amount,
    baseAmount,
    label,
    bonusLabel,
    showBaseStrike,
}: {
    icon: IconName
    accent: string
    amount: number
    baseAmount: number
    label: string
    bonusLabel: string | null
    showBaseStrike: boolean
}) {
    const theme = useTheme()
    const color = new Color(accent)
    const muted = color.darken(0.55).toHex()

    return (
        <layoutContainer
            layout={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                paddingTop: 16,
                paddingBottom: 14,
                paddingLeft: 8,
                paddingRight: 8,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: color.rgba(0.4),
                backgroundColor: color.rgba(0.12),
            }}
        >
            <UiIcon name={icon} size={48} tint={accent} />

            <layoutContainer
                layout={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <layoutContainer
                    layout={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        gap: 4,
                    }}
                >
                    <layoutText
                        text={`+${amount}`}
                        style={{
                            fontFamily: theme.MENU.FONT_DISPLAY,
                            fontSize: 26,
                            fill: accent,
                            fontWeight: 'bold',
                        }}
                        layout={{ objectFit: 'none' }}
                        roundPixels={true}
                    />
                    {showBaseStrike && (
                        <layoutText
                            text={`${baseAmount}`}
                            style={{
                                fontFamily: theme.UI.FONT_FAMILY,
                                fontSize: 12,
                                fill: muted,
                                fontWeight: 'bold',
                            }}
                            layout={{ objectFit: 'none', marginBottom: 4 }}
                            roundPixels={true}
                        />
                    )}
                </layoutContainer>

                <layoutText
                    text={label}
                    style={{
                        fontFamily: theme.UI.FONT_FAMILY,
                        fontSize: 11,
                        fill: muted,
                        fontWeight: 'bold',
                    }}
                    layout={{ objectFit: 'none' }}
                    roundPixels={true}
                />

                {bonusLabel && (
                    <layoutText
                        text={bonusLabel}
                        style={{
                            fontFamily: theme.UI.FONT_FAMILY,
                            fontSize: 10,
                            fill: accent,
                            fontWeight: 'bold',
                        }}
                        layout={{ objectFit: 'none', marginTop: 2 }}
                        roundPixels={true}
                    />
                )}
            </layoutContainer>
        </layoutContainer>
    )
}

function WatchAdButton({
    adState,
    adProgress,
    bonusPreview,
    onPress,
}: {
    adState: Exclude<AdState, 'done'>
    adProgress: number
    bonusPreview: { coin: number; jem: number }
    onPress: () => void
}) {
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
                backgroundColor: hovered && !watching
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

function AdBonusHint({
    amount,
    label,
    tint,
}: {
    amount: number
    label: string
    tint: string
}) {
    const theme = useTheme()

    return (
        <layoutContainer
            eventMode="none"
            layout={{
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0,
            }}
        >
            <layoutText
                text={`+${amount}`}
                style={{
                    fontFamily: theme.MENU.FONT_DISPLAY,
                    fontSize: 12,
                    fill: tint,
                    fontWeight: 'bold',
                }}
                layout={{ objectFit: 'none' }}
                roundPixels={true}
            />
            <layoutText
                text={label}
                style={{
                    fontFamily: theme.UI.FONT_FAMILY,
                    fontSize: 9,
                    fill: new Color(tint).darken(0.45).toHex(),
                    fontWeight: 'bold',
                }}
                layout={{ objectFit: 'none' }}
                roundPixels={true}
            />
        </layoutContainer>
    )
}
