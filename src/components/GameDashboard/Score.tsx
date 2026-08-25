import { useTheme } from '@src/ui/ThemeContext'
import { useTetrisGameState } from '@src/tetris/TetrisGameContext'
import { useAnimatedNumber } from '@src/hooks/useAnimatedNumber'
import { Easing } from '@src/utils/bezier'

const SCORE_FONT_SIZE = 28

/** Длительность анимации по дельте очков: Single / Double / Triple / Tetris */
const SCORE_ANIM_MS_BY_DELTA: Record<number, number> = {
    100: 600,
    300: 800,
    500: 1000,
    1200: 1200,
}

function scoreAnimMs(from: number, to: number): number {
    return SCORE_ANIM_MS_BY_DELTA[to - from] ?? 600
}

export const Score = () => {
    const { score } = useTetrisGameState()
    const theme = useTheme()
    const displayScore = useAnimatedNumber(score, {
        duration: scoreAnimMs,
        easing: Easing.easeOut,
    })

    return (
        <pixiText
            text={String(displayScore)}
            style={{
                fontFamily: theme.UI.FONT_FAMILY,
                fontSize: SCORE_FONT_SIZE,
                fill: theme.TEXT_COLOR,
                fontWeight: 'bold',
                align: 'center',
            }}
            layout={{
                objectFit: 'none',
                objectPosition: 'center',
            }}
        />
    )
}
