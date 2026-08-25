import { useCallback } from 'react'
import { Graphics } from 'pixi.js'
import {
    MINI_BOARD_COLS,
    MINI_BOARD_ROWS,
    MODE_BOARDS,
    type GameModeId,
} from '../gameModes'

type TProps = {
    modeId: GameModeId
    scale: number
}

export function MiniBoard({ modeId, scale }: TProps) {
    const cell = Math.max(12, Math.round(20 * scale))
    const gap = Math.max(2, Math.round(3 * scale))
    const step = cell + gap
    const boardWidth = MINI_BOARD_COLS * step - gap
    const boardHeight = MINI_BOARD_ROWS * step - gap
    const blocks = MODE_BOARDS[modeId]

    const draw = useCallback(
        (graphics: Graphics) => {
            graphics.clear()

            for (let row = 0; row < MINI_BOARD_ROWS; row++) {
                for (let col = 0; col < MINI_BOARD_COLS; col++) {
                    graphics
                        .roundRect(col * step, row * step, cell, cell, 3)
                        .fill({ color: 0xffffff, alpha: 0.03 })
                        .stroke({ width: 0.5, color: 0xffffff, alpha: 0.06 })
                }
            }

            for (const block of blocks) {
                const x = block.x * step
                const y = block.y * step
                if (block.ghost) {
                    graphics
                        .roundRect(x, y, cell, cell, 3)
                        .stroke({ width: 1.5, color: block.color, alpha: 0.35 })
                } else {
                    graphics.roundRect(x, y, cell, cell, 3).fill({ color: block.color, alpha: 0.92 })
                }
            }
        },
        [blocks, cell, step],
    )

    return (
        <layoutContainer
            layout={{
                width: boardWidth,
                height: boardHeight,
            }}
        >
            <pixiGraphics draw={draw} />
        </layoutContainer>
    )
}
