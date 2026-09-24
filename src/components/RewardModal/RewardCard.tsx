import { UiIcon } from '@components/ui/UiIcon'
import type { IconName } from '@src/assets/icons'
import { useTheme } from '@src/ui/ThemeContext'
import { Color } from '@src/utils/color'

type TProps = {
    icon: IconName
    accent: string
    amount: number
    baseAmount: number
    label: string
    bonusLabel: string | null
    showBaseStrike: boolean
}

export function RewardCard({
    icon,
    accent,
    amount,
    baseAmount,
    label,
    bonusLabel,
    showBaseStrike,
}: TProps) {
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
