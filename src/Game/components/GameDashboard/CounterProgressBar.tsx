import { useGameTheme } from '@src/hooks/useGameTheme'
import { useAnimatedNumber } from '@src/hooks/useAnimatedNumber'
import { Easing } from '@src/utils/bezier'

const BAR_HEIGHT = 4
const BAR_INSET = 6
/** Длительность догона тёмной полоски */
const DARK_CHASE_MS = 800
/** Пауза после прыжка светлой, перед стартом chase */
const DARK_CHASE_DELAY_MS = 300
/** Порог, после которого светлую считаем догнанной и скрываем */
const CATCH_EPS = 0.002

type TProps = {
    /** Заполнение 0…1 */
    progress: number
}

/**
 * Двойной прогрессбар: светлая полоска прыгает сразу, тёмная плавно догоняет сверху.
 * Absolute — не сдвигает цифру счётчика.
 */
export function CounterProgressBar({ progress }: TProps) {
    const { accent } = useGameTheme()
    const lightProgress = Math.min(1, Math.max(0, progress))
    const darkProgress = useAnimatedNumber(lightProgress, {
        duration: DARK_CHASE_MS,
        delay: DARK_CHASE_DELAY_MS,
        easing: Easing.easeOut,
        round: false,
    })
    const showLight = lightProgress > darkProgress + CATCH_EPS

    const lightColor = accent.lighten(0.45).toHex()
    const darkColor = accent.toHex()
    const trackColor = accent.rgba(0.22)

    return (
        <layoutContainer
            eventMode="none"
            layout={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: BAR_HEIGHT + BAR_INSET,
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
                    backgroundColor: trackColor,
                    overflow: 'hidden',
                    borderRadius: BAR_HEIGHT / 2,
                }}
            >
                {showLight && (
                    <layoutContainer
                        eventMode="none"
                        layout={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: `${lightProgress * 100}%`,
                            height: '100%',
                            backgroundColor: lightColor,
                        }}
                    />
                )}
                <layoutContainer
                    eventMode="none"
                    layout={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: `${Math.min(1, Math.max(0, darkProgress)) * 100}%`,
                        height: '100%',
                        backgroundColor: darkColor,
                    }}
                />
            </layoutContainer>
        </layoutContainer>
    )
}
