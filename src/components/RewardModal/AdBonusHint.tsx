import { useTheme } from '@src/ui/ThemeContext'
import { Color } from '@src/utils/color'

type TProps = {
    amount: number
    label: string
    tint: string
}

export function AdBonusHint({ amount, label, tint }: TProps) {
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
