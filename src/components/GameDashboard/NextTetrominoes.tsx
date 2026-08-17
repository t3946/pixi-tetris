import { useTetrisGameState } from '@src/tetris/TetrisGameContext'
import { getShapeLocalCells } from '@src/tetris/tetrominoes'
import { useBlockTexture } from '@src/hooks/useBlockTexture'

const CELL_PADDING = 1
/** Область контента панели (высота дашборда минус полоска заголовка) */
const PREVIEW_BOX = 56

export const NextTetrominoes = () => {
    const { nextType } = useTetrisGameState()
    const texture = useBlockTexture()
    const cells = getShapeLocalCells(nextType)

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
                            texture={texture}
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
