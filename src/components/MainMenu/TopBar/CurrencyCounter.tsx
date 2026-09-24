import { UiIcon } from '@components/ui/UiIcon'
import type { IconName } from '@src/assets/icons'
import { useTheme } from '@src/ui/ThemeContext'

type TProps = {
    scale: number
    icon: IconName
    iconSize: number
    value: number
    tint: string
    backgroundColor: string
    borderColor: string
}

function formatValue(value: number) {
    return new Intl.NumberFormat('ru-RU').format(value)
}

export function CurrencyCounter({
    scale,
    icon,
    iconSize,
    value,
    tint,
    backgroundColor,
    borderColor,
}: TProps) {
    const theme = useTheme()

    return (
        <layoutContainer
            layout={{
                flexGrow: 0,
                flexShrink: 0,
                flexDirection: 'row',
                alignItems: 'center',
                gap: Math.round(8 * scale),
                paddingTop: Math.round(6 * scale),
                paddingBottom: Math.round(6 * scale),
                paddingLeft: Math.round(10 * scale),
                paddingRight: Math.round(14 * scale),
                borderRadius: Math.round(20 * scale),
                backgroundColor,
                borderWidth: 1,
                borderColor,
                height: Math.round(32 * scale),
            }}
        >
            <UiIcon name={icon} size={Math.round(iconSize * scale)} tint={tint} />

            <pixiText
                text={formatValue(value)}
                style={{
                    fontFamily: theme.UI.FONT_FAMILY,
                    fontSize: Math.round(16 * scale),
                    fill: tint,
                    fontWeight: 'bold',
                }}
                layout={{ objectFit: 'none', marginTop: -2 }}
                roundPixels={true}
            />
        </layoutContainer>
    )
}
