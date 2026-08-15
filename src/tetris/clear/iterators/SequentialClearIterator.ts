import type { Board } from '@src/tetris/engine'
import { ClearIterator } from '@src/tetris/clear/ClearIterator'
import type { ClearEffect } from '@src/tetris/clear/ClearEffect'
import type { ClearApi } from '@src/tetris/clear/types'

const DEFAULT_INTERVAL_MS = 100

function wait(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

/**
 * Обходит мономино ряда слева направо с паузой между клетками
 * и применяет переданный эффект (по умолчанию — SamuraiCutClearEffect).
 */
export class SequentialClearIterator extends ClearIterator {
    constructor(private readonly intervalMs: number = DEFAULT_INTERVAL_MS) {
        super()
    }

    async iterate(
        line: number,
        board: Board,
        effect: ClearEffect,
        api: ClearApi,
    ): Promise<void> {
        const row = board[line]

        if (!row) {
            return
        }

        let isFirst = true

        for (let x = 0; x < row.length; x++) {
            const color = row[x]

            if (color === 0) {
                continue
            }

            if (!isFirst) {
                await wait(this.intervalMs)
            }
            isFirst = false

            await effect.apply({ x, y: line, color }, api)
        }
    }
}
