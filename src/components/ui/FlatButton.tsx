import type { LayoutStyles } from '@pixi/layout'
import { BaseButton } from '@components/ui/BaseButton'
import { useTheme } from '@src/ui/ThemeContext'

type TVariant = 'primary' | 'secondary' | 'danger'

type TProps = {
    label: string
    onPress?: () => void
    disabled?: boolean
    variant?: TVariant
    layout?: LayoutStyles
}

export function FlatButton({
    label,
    onPress,
    disabled = false,
    variant = 'primary',
    layout,
}: TProps) {
    const theme = useTheme()

    const looks = {
        primary: {
            fill: theme.UI.BUTTON_PRIMARY,
            fillHover: theme.UI.BUTTON_PRIMARY_HOVER,
            textFill: theme.UI.PANEL_LABEL,
            textFillHover: theme.UI.PANEL_LABEL,
        },
        secondary: {
            fill: theme.UI.BUTTON_SECONDARY,
            fillHover: theme.UI.BUTTON_SECONDARY_HOVER,
            textFill: theme.UI.PANEL_LABEL,
            textFillHover: theme.UI.PANEL_LABEL,
        },
        danger: {
            fill: theme.UI.BUTTON_SECONDARY,
            fillHover: theme.UI.BUTTON_SECONDARY_HOVER,
            textFill: theme.UI.BUTTON_DANGER_TEXT,
            textFillHover: theme.UI.BUTTON_DANGER_TEXT_HOVER,
        },
    }[variant]

    return (
        <BaseButton
            label={label}
            onPress={onPress}
            disabled={disabled}
            layout={layout}
            fill={looks.fill}
            fillHover={looks.fillHover}
            textFill={looks.textFill}
            textFillHover={looks.textFillHover}
            fontSize={20}
            appearance={{
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 40,
                paddingRight: 40,
                height: 50,
                borderWidth: 0,
                borderRadius: 4,
            }}
        />
    )
}
