import { Grid } from '@components/Grid/Grid.tsx'
import { GameField } from '@components/GameField.tsx'
import { ButtonCircle } from '@components/ui/ButtonCircle.tsx'
import { useGameColumnLayout } from '@components/gameColumnLayout.ts'
import { useTogglePause, useTetrisGameState } from '@src/tetris/TetrisGameContext'
import { BOARD_COLS, BOARD_ROWS } from '@src/tetris/constants'

export const Stack = () => {
    const { cellSize, wellWidth, paddingStart, paddingEnd } = useGameColumnLayout()
    const togglePause = useTogglePause()
    const { paused } = useTetrisGameState()

    return (
        <layoutContainer
            layout={{
                width: '100%',
                overflow: 'hidden',
                paddingStart,
                paddingEnd,
            }}
        >
            <layoutContainer
                layout={{
                    width: wellWidth,
                    overflow: 'hidden',
                }}
            >
                <pixiContainer>
                    <Grid width={wellWidth}>
                        <GameField
                            vertica={BOARD_ROWS}
                            horizontal={BOARD_COLS}
                            cellSize={cellSize}
                        />
                    </Grid>

                    <ButtonCircle
                        icon="pause"
                        size={40}
                        x={16}
                        y={16}
                        alpha={paused ? 1 : 0.25}
                        hoverAlpha={1}
                        onPress={togglePause}
                    />
                </pixiContainer>
            </layoutContainer>
        </layoutContainer>
    )
}
