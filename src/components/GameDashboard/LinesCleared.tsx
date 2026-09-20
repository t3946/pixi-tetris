import { useTheme } from '@src/ui/ThemeContext'
import { useTetrisGameState } from '@src/tetris/TetrisGameContext'
import { useAnimatedNumber } from '@src/hooks/useAnimatedNumber'
import { Easing } from '@src/utils/bezier'

const LINES_FONT_SIZE = 28

export const LinesCleared = () => {
    const { linesCleared } = useTetrisGameState()
    const theme = useTheme()
    const displayLines = useAnimatedNumber(linesCleared, {
        duration: 400,
        easing: Easing.easeOut,
    })

    return (
        <pixiText
            text={String(displayLines)}
            style={{
                fontFamily: theme.UI.FONT_FAMILY,
                fontSize: LINES_FONT_SIZE,
                fill: theme.TEXT_COLOR,
                fontWeight: 'bold',
                align: 'center',
            }}
            layout={{
                objectFit: 'none',
                objectPosition: 'center',
            }}
            roundPixels={true}
        />
    )
}
