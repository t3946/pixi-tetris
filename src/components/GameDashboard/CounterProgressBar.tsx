import { useGameTheme } from '@src/hooks/useGameTheme'

const BAR_HEIGHT = 4
const BAR_INSET = 6

type TProps = {
    /** Заполнение 0…1 */
    progress: number
}

/**
 * Тонкая полоска-прогрессбар у нижнего края панели счётчика.
 * Absolute — не сдвигает цифру.
 */
export function CounterProgressBar({ progress }: TProps) {
    const { accent } = useGameTheme()
    const clamped = Math.min(1, Math.max(0, progress))

    return (
        <layoutContainer
            eventMode="none"
            layout={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: BAR_HEIGHT + BAR_INSET * 1,
                paddingLeft: BAR_INSET,
                paddingRight: BAR_INSET,
                paddingBottom: BAR_INSET,
                justifyContent: 'flex-end',
                alignItems: 'stretch',
            }}
        >
            <layoutContainer
                layout={{
                    width: '100%',
                    height: BAR_HEIGHT,
                    backgroundColor: accent.rgba(0.22),
                    overflow: 'hidden',
                    borderRadius: BAR_HEIGHT / 2,
                }}
            >
                <layoutContainer
                    layout={{
                        width: `${clamped * 100}%`,
                        height: '100%',
                        backgroundColor: accent.toHex(),
                    }}
                />
            </layoutContainer>
        </layoutContainer>
    )
}
