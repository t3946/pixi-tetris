import { useMemo } from 'react'
import { CanvasTextMetrics, TextStyle } from 'pixi.js'
import { UiIcon } from '@components/ui/UiIcon'
import type { IconName } from '@src/assets/icons'
import { useTheme } from '@src/ui/ThemeContext'
import { Color } from '@src/utils/color'

type TProps = {
    icon: IconName
    accent: string
    amount: number
    baseAmount: number
    showBaseStrike: boolean
}

const ICON_HEIGHT = 36
const AMOUNT_FONT_SIZE = 26

export function RewardCard({
    icon,
    accent,
    amount,
    baseAmount,
    showBaseStrike,
}: TProps) {
    const theme = useTheme()
    const color = new Color(accent)
    const muted = color.darken(0.55).toHex()

    const amountMetrics = useMemo(() => {
        const measureStyle = new TextStyle({
            fontFamily: theme.MENU.FONT_DISPLAY,
            fontSize: AMOUNT_FONT_SIZE,
            fontWeight: 'bold',
        })
        const measured = CanvasTextMetrics.measureText(`${amount}`, measureStyle)
        measureStyle.destroy()
        return {
            width: Math.ceil(measured.width),
            // lineHeight ближе к реальному боксу глифов, чем height у display-шрифтов
            height: Math.ceil(Math.max(measured.height, measured.lineHeight)),
        }
    }, [amount, theme.MENU.FONT_DISPLAY])

    return (
        <layoutContainer
            layout={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                paddingTop: 20,
                paddingBottom: 16,
                paddingLeft: 8,
                paddingRight: 8,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: color.rgba(0.4),
                backgroundColor: color.rgba(0.12),
            }}
        >
            <UiIcon name={icon} height={ICON_HEIGHT} tint={accent} />

            <layoutContainer
                layout={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    gap: 4,
                    height: amountMetrics.height,
                    flexShrink: 0,
                }}
            >
                <layoutContainer
                    layout={{
                        width: amountMetrics.width,
                        height: amountMetrics.height,
                        flexShrink: 0,
                    }}
                >
                    <pixiText
                        text={`${amount}`}
                        style={{
                            fontFamily: theme.MENU.FONT_DISPLAY,
                            fontSize: AMOUNT_FONT_SIZE,
                            fill: accent,
                            fontWeight: 'bold',
                        }}
                        anchor={0.5}
                        x={amountMetrics.width / 2}
                        y={amountMetrics.height / 2}
                        eventMode="none"
                        roundPixels={true}
                    />
                </layoutContainer>
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
        </layoutContainer>
    )
}
