import type { ClearApi, Monomino } from '@src/tetris/clear/types'

/**
 * Абстрактный визуальный/логический эффект удаления одного мономино.
 * Наследники решают, как именно «сгорает» клетка (мгновенно, с анимацией и т.д.).
 */
export abstract class ClearEffect {
    abstract apply(monomino: Monomino, api: ClearApi): void | Promise<void>
}
