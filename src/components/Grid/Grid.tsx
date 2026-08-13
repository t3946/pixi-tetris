import { useCallback, type ReactNode } from 'react'
import { Graphics } from 'pixi.js'
import { BOARD_COLS, BOARD_ROWS } from '@src/tetris/constants'
import { useTheme } from '@src/ui/ThemeContext.tsx'

const GRID_ALPHA = 0.5
const FIELD_BORDER = 3
const FIELD_RADIUS = 4

type TProps = {
    width: number
    height: number
    cols?: number
    rows?: number
    children?: ReactNode
}

export function Grid({
    width,
    cols = BOARD_COLS,
    rows = BOARD_ROWS,
    children,
}: TProps) {
    const theme = useTheme()

    const innerWidth = Math.max(0, width - FIELD_BORDER * 2)
    const cellSize = innerWidth / cols
    const innerHeight = cellSize * rows
    const outerHeight = innerHeight + FIELD_BORDER * 2

    const drawGrid = useCallback(
        (graphics: Graphics) => {
            graphics.clear()

            graphics
                .rect(0, 0, innerWidth, innerHeight)
                .fill({ color: theme.GRID_FILL_COLOR, alpha: GRID_ALPHA })

            // Крайние линии (i/j = 0 и последняя) не рисуем — их заменяет рамка поля
            for (let i = 1; i < cols; i++) {
                const x = i * cellSize
                graphics.moveTo(x, 0).lineTo(x, innerHeight)
            }

            for (let j = 1; j < rows; j++) {
                const y = j * cellSize
                graphics.moveTo(0, y).lineTo(innerWidth, y)
            }

            graphics.stroke({ color: theme.GRID_LINE_COLOR, width: 1, alpha: GRID_ALPHA })
        },
        [cellSize, cols, innerHeight, innerWidth, rows, theme.GRID_FILL_COLOR, theme.GRID_LINE_COLOR],
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
                    {children}
                </pixiContainer>
            </layoutContainer>
        </layoutContainer>
    )
}
