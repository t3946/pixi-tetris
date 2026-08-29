import { useCallback } from 'react'
import type { FederatedPointerEvent } from 'pixi.js'
import { useTheme } from '@src/ui/ThemeContext'

export type RadioOption<T extends string> = {
    value: T
    label: string
}

type TProps<T extends string> = {
    value: T
    options: readonly RadioOption<T>[]
    onChange: (value: T) => void
}

const RADIO_SIZE = 21
const DOT_SIZE = 11
const LABEL_SIZE = 21
const OPTION_GAP = 13
const BORDER_WIDTH = 3

function RadioOption({
    optionValue,
    label,
    selected,
    onPress,
}: {
    optionValue: string
    label: string
    selected: boolean
    onPress: () => void
}) {
    const theme = useTheme()

    const handlePointerTap = useCallback(
        (event: FederatedPointerEvent) => {
            event.stopPropagation()
            onPress()
        },
        [onPress],
    )

    return (
        <layoutContainer
            layout={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                gap: OPTION_GAP,
            }}
            eventMode="static"
            onPointerTap={handlePointerTap}
        >
            <layoutContainer
                layout={{
                    width: RADIO_SIZE,
                    height: RADIO_SIZE,
                    borderRadius: RADIO_SIZE / 2,
                    borderWidth: BORDER_WIDTH,
                    borderColor: selected ? theme.UI.ACCENT : theme.TEXT_MUTED,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexShrink: 0,
                }}
            >
                {selected && (
                    <layoutContainer
                        layout={{
                            width: DOT_SIZE,
                            height: DOT_SIZE,
                            borderRadius: DOT_SIZE / 2,
                            backgroundColor: theme.UI.ACCENT,
                        }}
                    />
                )}
            </layoutContainer>

            <layoutText
                key={`${optionValue}:${selected}`}
                text={label}
                style={{
                    fontFamily: theme.UI.FONT_FAMILY,
                    fontSize: LABEL_SIZE,
                    fill: selected ? theme.TEXT_COLOR : theme.TEXT_MUTED,
                    fontWeight: selected ? 'bold' : 'normal',
                }}
                layout={{
                    objectFit: 'none',
                    objectPosition: 'left',
                }}
                roundPixels={true}
            />
        </layoutContainer>
    )
}

export function RadioGroup<T extends string>({ value, options, onChange }: TProps<T>) {
    return (
        <layoutContainer
            layout={{
                width: '100%',
                flexDirection: 'column',
                gap: OPTION_GAP,
                alignItems: 'flex-start',
            }}
        >
            {options.map((option) => (
                <RadioOption
                    key={option.value}
                    optionValue={option.value}
                    label={option.label}
                    selected={value === option.value}
                    onPress={() => onChange(option.value)}
                />
            ))}
        </layoutContainer>
    )
}
