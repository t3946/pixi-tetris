import type { Board } from '@src/tetris/engine'
import { ClearIterator } from '@src/tetris/clear/ClearIterator'
import type { ClearEffect } from '@src/tetris/clear/ClearEffect'
import type { ClearApi, Monomino } from '@src/tetris/clear/types'
import { SPARKLE_FLASH_MS } from '@src/tetris/clear/sparkle/SparkleClearEffect'
import { SPARKLE_PARTICLE_MS } from '@src/tetris/clear/sparkle/playSparkleAnimation'

/** Полная длительность одного SparkleClearEffect (вспышка + частицы). */
export const SPARKLE_EFFECT_MS = SPARKLE_FLASH_MS + SPARKLE_PARTICLE_MS

/** Интервал между стартами = 90% длительности эффекта (лёгкий overlap ~10%). */
const INTERVAL_RATIO = 0.04

function wait(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

function shuffle<T>(items: T[]): T[] {
    const result = [...items]
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
}

/**
 * Итератор для Sparkle: случайный порядок клеток,
 * следующий старт через 90% длительности эффекта (эффекты слегка перекрываются).
 */
export class SparkleClearIterator extends ClearIterator {
    constructor(private readonly intervalRatio: number = INTERVAL_RATIO) {
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

        const cells: Monomino[] = []
        for (let x = 0; x < row.length; x++) {
            const color = row[x]
            if (color !== 0) {
                cells.push({ x, y: line, color })
            }
        }

        if (cells.length === 0) {
            return
        }

        const order = shuffle(cells)
        const intervalMs = SPARKLE_EFFECT_MS * this.intervalRatio
        const tasks: Promise<void>[] = []

        for (let i = 0; i < order.length; i++) {
            if (i > 0) {
                await wait(intervalMs)
            }
            // Не ждём окончания эффекта — следующий старт по интервалу
            tasks.push(Promise.resolve(effect.apply(order[i], api)))
        }

        await Promise.all(tasks)
    }
}
