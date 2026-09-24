import { useMemo, useState } from 'react'
import { CanvasTextMetrics, TextStyle } from 'pixi.js'
import { UiIcon } from '@components/ui/UiIcon'
import type { IconName } from '@src/assets/icons'
import { useAnimatedNumber } from '@src/hooks/useAnimatedNumber'
import { usePulse } from '@src/hooks/usePulse'
import { useTheme } from '@src/ui/ThemeContext'
import { Color } from '@src/utils/color'
import { Easing } from '@src/utils/bezier'
import {
    AD_TRANSFER_MS,
    AMOUNT_PULSE_LIGHTEN,
    AMOUNT_PULSE_MS,
    AMOUNT_PULSE_SCALE,
} from './constants'

type TProps = {
    icon: IconName
    accent: string
    amount: number
    immediate?: boolean
}

const ICON_HEIGHT = 36
const AMOUNT_FONT_SIZE = 26

export function RewardCard({ icon, accent, amount, immediate = false }: TProps) {
    const theme = useTheme()
    const color = new Color(accent)
    const [pulseGen, setPulseGen] = useState(0)
    const pulse = usePulse(pulseGen, AMOUNT_PULSE_MS)

    const displayAmount = useAnimatedNumber(amount, {
        duration: AD_TRANSFER_MS,
        easing: Easing.easeOut,
        immediate,
        onComplete: () => setPulseGen((generation) => generation + 1),
    })

    const fontSize = AMOUNT_FONT_SIZE * (1 + AMOUNT_PULSE_SCALE * pulse)
    const fill = color.lighten(AMOUNT_PULSE_LIGHTEN * pulse).toHex()

    const amountMetrics = useMemo(() => {
        const measureStyle = new TextStyle({
            fontFamily: theme.MENU.FONT_DISPLAY,
            fontSize: AMOUNT_FONT_SIZE,
            fontWeight: 'bold',
        })
        // Ширину берём по целевому значению, чтобы бокс не прыгал во время анимации
        const measured = CanvasTextMetrics.measureText(`${amount}`, measureStyle)
        measureStyle.destroy()
        return {
            width: Math.ceil(measured.width),
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
                    width: amountMetrics.width,
                    height: amountMetrics.height,
                    flexShrink: 0,
                }}
            >
                <pixiText
                    text={`${displayAmount}`}
                    style={{
                        fontFamily: theme.MENU.FONT_DISPLAY,
                        fontSize,
                        fill,
                        fontWeight: 'bold',
                    }}
                    anchor={0.5}
                    x={amountMetrics.width / 2}
                    y={amountMetrics.height / 2}
                    eventMode="none"
                    roundPixels={true}
                />
            </layoutContainer>
        </layoutContainer>
    )
}
