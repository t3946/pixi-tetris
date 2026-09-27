import { UiIcon } from '@components/ui/UiIcon'
import { useTheme } from '@src/ui/ThemeContext'

type TProps = {
    scale: number
    score: number
}

function formatScore(value: number) {
    return new Intl.NumberFormat('ru-RU').format(value)
}

export function StarCounter({ scale, score }: TProps) {
    const theme = useTheme()

    return (
        <layoutContainer
            layout={{
                flexShrink: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100',
                flexGrow: 0,
                gap: Math.round(6 * scale),
                paddingTop: Math.round(6 * scale),
                paddingBottom: Math.round(6 * scale),
                paddingLeft: Math.round(10 * scale),
                paddingRight: Math.round(14 * scale),
                borderRadius: Math.round(20 * scale),
                backgroundColor: 'rgba(255, 214, 0, 0.15)',
                borderWidth: 1,
                borderColor: 'rgba(255, 214, 0, 0.3)',
            }}
        >
            <UiIcon
                name="star"
                size={Math.round(14 * scale)}
                tint={theme.MENU.GOLD}
            />

            <layoutText
                text={formatScore(score)}
                style={{
                    fontFamily: theme.UI.FONT_FAMILY,
                    fontSize: Math.round(14 * scale),
                    fill: theme.MENU.GOLD,
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
