import type { LayoutStyles } from '@pixi/layout'
import { useTheme } from '@src/ui/ThemeContext'
import { Color, type ColorInput } from '@src/utils/color'

type TProps = {
    children: string
    accent: ColorInput
    fontSize?: number
    layout?: LayoutStyles
}

export function Badge({
    children,
    accent,
    fontSize = 12,
    layout = {},
}: TProps) {
    const theme = useTheme()
    const color = accent instanceof Color ? accent : new Color(accent)

    return (
        <layoutContainer
            layout={{
                paddingTop: 8,
                paddingBottom: 8,
                paddingLeft: 8,
                paddingRight: 8,
                borderWidth: 1,
                borderColor: color.rgba(0.45),
                backgroundColor: color.rgba(0.15),
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
                flexShrink: 0,
                ...layout,
            }}
        >
            <layoutText
                text={children}
                style={{
                    fontFamily: theme.UI.FONT_FAMILY,
                    fontSize,
                    fill: color,
                    fontWeight: 'bold',
                }}
                layout={{
                    objectFit: 'none',
                    objectPosition: 'center',
                }}
                roundPixels={true}
            />
        </layoutContainer>
    )
}
