import { useCallback, type ReactNode } from 'react'
import { Graphics } from 'pixi.js'
import { getAccentUiChrome } from '@components/GameThemes/GameTheme.ts'
import { BOARD_COLS, BOARD_ROWS } from '@src/tetris/constants'
import { useGameTheme } from '@src/hooks/useGameTheme'
import { useTheme } from '@src/ui/ThemeContext.tsx'

const GRID_ALPHA = 0.3
export const FIELD_BORDER = 3
const FIELD_RADIUS = 4

/** Целый размер клетки — иначе мономино и линии сетки «пляшут» на ±1px. */
export function computeCellSize(fieldWidth: number, cols: number): number {
    return Math.floor(Math.max(0, fieldWidth - FIELD_BORDER * 2) / cols)
}

type TProps = {
    width: number
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
    const { accent } = useGameTheme()
    const { chrome } = getAccentUiChrome(accent)

    const cellSize = computeCellSize(width, cols)
    const gridWidth = cellSize * cols
    const gridHeight = cellSize * rows
    const outerHeight = gridHeight + FIELD_BORDER * 2

    const drawGrid = useCallback(
        (graphics: Graphics) => {
            graphics.clear()

            graphics
                .rect(0, 0, gridWidth, gridHeight)
                .fill({ color: theme.GRID_FILL_COLOR, alpha: GRID_ALPHA })

            // Крайние линии (i/j = 0 и последняя) не рисуем — их заменяет рамка поля
            for (let i = 1; i < cols; i++) {
                const x = i * cellSize
                graphics.moveTo(x, 0).lineTo(x, gridHeight)
            }

            for (let j = 1; j < rows; j++) {
                const y = j * cellSize
                graphics.moveTo(0, y).lineTo(gridWidth, y)
            }

            graphics.stroke({ color: theme.GRID_LINE_COLOR, width: 1, alpha: GRID_ALPHA })
        },
        [cellSize, cols, gridHeight, gridWidth, theme.GRID_FILL_COLOR, theme.GRID_LINE_COLOR],
    )

    return (
        <layoutContainer
            layout={{
                width: gridWidth + FIELD_BORDER * 2,
                height: outerHeight,
                borderWidth: FIELD_BORDER,
                borderColor: chrome,
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
