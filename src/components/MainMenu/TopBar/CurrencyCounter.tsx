import { UiIcon } from '@components/ui/UiIcon'
import type { IconName } from '@src/assets/icons'
import { useTheme } from '@src/ui/ThemeContext'

type TProps = {
    scale: number
    icon: IconName
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
    value,
    tint,
    backgroundColor,
    borderColor,
}: TProps) {
    const theme = useTheme()

    return (
        <layoutContainer
            layout={{
                flexShrink: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexGrow: 0,
                gap: Math.round(6 * scale),
                paddingTop: Math.round(6 * scale),
                paddingBottom: Math.round(6 * scale),
                paddingLeft: Math.round(10 * scale),
                paddingRight: Math.round(14 * scale),
                borderRadius: Math.round(20 * scale),
                backgroundColor,
                borderWidth: 1,
                borderColor,
            }}
        >
            <UiIcon name={icon} size={Math.round(14 * scale)} tint={tint} />

            <layoutText
                text={formatValue(value)}
                style={{
                    fontFamily: theme.UI.FONT_FAMILY,
                    fontSize: Math.round(14 * scale),
                    fill: tint,
                    fontWeight: 'bold',
                }}
                layout={{
                    objectFit: 'none',
                }}
                roundPixels={true}
            />
        </layoutContainer>
    )
}
