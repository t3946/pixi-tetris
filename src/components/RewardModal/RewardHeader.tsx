import { useTheme } from '@src/ui/ThemeContext'

export function RewardHeader() {
    const theme = useTheme()

    return (
        <layoutText
            text="Уровень пройден!"
            style={{
                fontSize: 28,
                fill: theme.MENU.GOLD,
                fontWeight: '800',
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
    )
}
