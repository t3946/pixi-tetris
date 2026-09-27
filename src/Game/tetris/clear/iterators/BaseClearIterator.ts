import type { Board } from '@src/tetris/engine'
import { ClearIterator } from '@src/tetris/clear/ClearIterator'
import type { ClearEffect } from '@src/tetris/clear/ClearEffect'
import type { ClearApi } from '@src/tetris/clear/types'

/**
 * Обходит мономино ряда слева направо без задержки
 * и применяет переданный эффект (по умолчанию — DefaultClearEffect).
 */
export class BaseClearIterator extends ClearIterator {
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

        for (let x = 0; x < row.length; x++) {
            const color = row[x]

            if (color === 0) {
                continue
            }

            await effect.apply({ x, y: line, color }, api)
        }
    }
}
