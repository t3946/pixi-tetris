import { useTheme } from '@src/ui/ThemeContext'
import { useTetrisGameState } from '@src/tetris/TetrisGameContext'

const SCORE_FONT_SIZE = 28

export const Score = () => {
    const { score } = useTetrisGameState()
    const theme = useTheme()

    return (
        <pixiText
            text={String(score)}
            style={{
                fontSize: SCORE_FONT_SIZE,
                fill: theme.TEXT_COLOR,
                fontWeight: 'bold',
                align: 'center',
            }}
            layout={true}
        />
    )
}
