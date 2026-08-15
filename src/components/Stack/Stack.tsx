import { useRef, useState, useEffect } from 'react'
import { Grid, computeCellSize } from '@components/Grid/Grid.tsx'
import { GameField } from '@components/GameField.tsx'
import { ButtonCircle } from '@components/ui/ButtonCircle.tsx'
import { useTogglePause, useTetrisGameState } from '@src/tetris/TetrisGameContext'
import { BOARD_COLS, BOARD_ROWS } from '@src/tetris/constants'
import debounce from 'lodash/debounce'

export const Stack = () => {
    const parentRef = useRef<any>(null)
    const [parentSize, setParentSize] = useState({ width: 0, height: 0 })
    const togglePause = useTogglePause()
    const { paused } = useTetrisGameState()

    useEffect(() => {
        if (parentRef.current) {
            const bounds = parentRef.current.getLocalBounds()

            setParentSize({
                width: bounds.width || 100,
                height: bounds.height || 100,
            })
        }
    }, [])

    useEffect(() => {
        const handleResize = () => {
            if (parentRef.current) {
                setParentSize({
                    width: parentRef.current.width,
                    height: parentRef.current.height,
                })
            }
        }
        const debouncedHandleResize = debounce(handleResize, 50)

        debouncedHandleResize()
        window.addEventListener('resize', debouncedHandleResize)

        return () => {
            debouncedHandleResize.cancel()
            window.removeEventListener('resize', debouncedHandleResize)
        }
    }, [])

    const cellSize = computeCellSize(parentSize.width, BOARD_COLS)

    return (
        <layoutContainer
            layout={{
                width: '100%',
                overflow: 'hidden',
            }}
            ref={parentRef}
        >
            <pixiContainer>
                <Grid width={parentSize.width} height={parentSize.height}>
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
    )
}
