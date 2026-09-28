import { UiIcon } from '@components/ui/UiIcon'
import { useTetrisGameState } from '@src/tetris/TetrisGameContext'
import { getShapeLocalCells } from '@src/tetris/tetrominoes'
import { useBlockTheme } from '@src/hooks/useBlockTheme'
import { useGameTheme } from '@src/hooks/useGameTheme'

const CELL_PADDING = 1
/** Область контента панели (высота дашборда минус полоска заголовка) */
const PREVIEW_BOX = 56
const HIDDEN_ICON_SIZE = Math.round(PREVIEW_BOX * 0.55 * 1.2)

export const NextTetrominoes = () => {
    const { nextType, nextCellColors, nextPreviewHidden } = useTetrisGameState()
    const { accent } = useGameTheme()
    const blockTheme = useBlockTheme()

    if (nextPreviewHidden) {
        return (
            <layoutContainer
                layout={{
                    width: PREVIEW_BOX,
                    height: PREVIEW_BOX,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <UiIcon
                    name="circleQuestion"
                    size={HIDDEN_ICON_SIZE}
                    tint={accent.lighten(0.45).toHex()}
                />
            </layoutContainer>
        )
    }

    const material = blockTheme.getMaterial(nextType)
    const cells = getShapeLocalCells(nextType, 0, nextCellColors)

    if (cells.length === 0) {
        return (
            <layoutContainer
                layout={{
                    width: PREVIEW_BOX,
                    height: PREVIEW_BOX,
                }}
            />
        )
    }

    const minX = Math.min(...cells.map((cell) => cell.x))
    const maxX = Math.max(...cells.map((cell) => cell.x))
    const minY = Math.min(...cells.map((cell) => cell.y))
    const maxY = Math.max(...cells.map((cell) => cell.y))

    const shapeWidth = maxX - minX + 1
    const shapeHeight = maxY - minY + 1
    const cellSize = Math.floor(PREVIEW_BOX / Math.max(shapeWidth, shapeHeight, 4))
    const size = Math.max(0, cellSize - CELL_PADDING * 2)

    const offsetX = (PREVIEW_BOX - shapeWidth * cellSize) / 2
    const offsetY = (PREVIEW_BOX - shapeHeight * cellSize) / 2

    return (
        <layoutContainer
            layout={{
                width: PREVIEW_BOX,
                height: PREVIEW_BOX,
            }}
        >
            <pixiContainer>
                {cells.map((cell, index) => {
                    const col = cell.x - minX
                    const row = cell.y - minY

                    return (
                        <pixiSprite
                            key={`${nextType}-${index}-${cell.x}-${cell.y}`}
                            texture={material.texture}
                            tint={cell.color}
                            x={offsetX + col * cellSize + CELL_PADDING}
                            y={offsetY + row * cellSize + CELL_PADDING}
                            width={size}
                            height={size}
                            roundPixels={true}
                        />
                    )
                })}
            </pixiContainer>
        </layoutContainer>
    )
}
