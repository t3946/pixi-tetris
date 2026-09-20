import { useTheme } from '@src/ui/ThemeContext'
import { useTetrisGameState } from '@src/tetris/TetrisGameContext'
import { useAnimatedNumber } from '@src/hooks/useAnimatedNumber'
import { Easing } from '@src/utils/bezier'
import { useUser } from '@src/user/UserContext'
import { getMissionProgress } from '@src/user/missions'
import { CounterProgressBar } from '@components/GameDashboard/CounterProgressBar'

const LINES_FONT_SIZE = 28

export const LinesCleared = () => {
    const { linesCleared } = useTetrisGameState()
    const { user } = useUser()
    const theme = useTheme()
    const displayLines = useAnimatedNumber(linesCleared, {
        duration: 400,
        easing: Easing.easeOut,
    })
    const progress = getMissionProgress(user.activeMission, 'lines', linesCleared)

    return (
        <layoutContainer
            layout={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
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
            <CounterProgressBar progress={progress} />
        </layoutContainer>
    )
}
