import { useCallback } from 'react'
import { Graphics } from 'pixi.js'
import { GameField } from '@components/GameField.tsx'
import { BOARD_COLS, BOARD_ROWS } from '@src/tetris/constants'
import { useTheme } from '@src/ui/ThemeContext.tsx'

const GRID_ALPHA = 0.5
const FIELD_BORDER = 3
const FIELD_RADIUS = 4

export function Grid({ width }: { width: number; height: number }) {
    const theme = useTheme()

    const innerWidth = Math.max(0, width - FIELD_BORDER * 2)
    const cellSize = innerWidth / BOARD_COLS
    const innerHeight = cellSize * BOARD_ROWS
    const outerHeight = innerHeight + FIELD_BORDER * 2

    const drawGrid = useCallback(
        (graphics: Graphics) => {
            graphics.clear()

            graphics.rect(0, 0, innerWidth, innerHeight).fill({ color: 0x222222, alpha: GRID_ALPHA })

            // Крайние линии (i/j = 0 и последняя) не рисуем — их заменяет рамка поля
            for (let i = 1; i < BOARD_COLS; i++) {
                const x = i * cellSize
                graphics.moveTo(x, 0).lineTo(x, innerHeight)
            }

            for (let j = 1; j < BOARD_ROWS; j++) {
                const y = j * cellSize
                graphics.moveTo(0, y).lineTo(innerWidth, y)
            }

            graphics.stroke({ color: 0x666666, width: 1, alpha: GRID_ALPHA })
        },
        [cellSize, innerHeight, innerWidth],
    )

    return (
        <layoutContainer
            layout={{
                width,
                height: outerHeight,
                borderWidth: FIELD_BORDER,
                borderColor: theme.UI.BUTTON_FILL_TOP,
                borderRadius: FIELD_RADIUS,
                overflow: 'hidden',
            }}
        >
            <layoutContainer
                layout={{
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                }}
            >
                <pixiContainer>
                    <pixiGraphics draw={drawGrid} />

                    <GameField
                        vertica={BOARD_ROWS}
                        horizontal={BOARD_COLS}
                        cellSize={cellSize}
                    />
                </pixiContainer>
            </layoutContainer>
        </layoutContainer>
    )
}
