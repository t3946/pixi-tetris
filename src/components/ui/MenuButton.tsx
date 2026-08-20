import type { LayoutStyles } from '@pixi/layout'
import { BaseButton } from '@components/ui/BaseButton'
import { useTheme } from '@src/ui/ThemeContext'

type TProps = {
    label: string
    onPress?: () => void
    /** Компактный вариант (для рядов кнопок 1–4) */
    compact?: boolean
    disabled?: boolean
    layout?: LayoutStyles
}

export function MenuButton({
    label,
    onPress,
    compact = false,
    disabled = false,
    layout,
}: TProps) {
    const theme = useTheme()

    return (
        <BaseButton
            label={label}
            onPress={onPress}
            disabled={disabled}
            layout={layout}
            fill={theme.UI.BUTTON_FILL_BOTTOM}
            fillHover={theme.UI.BUTTON_FILL_TOP}
            fontSize={compact ? 18 : 22}
            appearance={{
                paddingTop: compact ? 10 : 14,
                paddingBottom: compact ? 10 : 14,
                paddingLeft: compact ? 18 : 40,
                paddingRight: compact ? 18 : 40,
                minWidth: compact ? 48 : undefined,
                borderColor: theme.UI.ACCENT,
                borderWidth: 2,
                borderRadius: 8,
            }}
        />
    )
}
