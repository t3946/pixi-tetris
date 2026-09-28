export const BOARD_ROWS = 19
export const BOARD_COLS = 10

export type LevelConfig = {
    level: number
    /** Интервал шага гравитации (секунды). */
    fallStep: number
    /** Lock Delay (мс). */
    lockDelay: number
    /** Лимит Move Reset. */
    maxResets: number
}

/**
 * Параметры сложности по уровням (заранее просчитанные).
 * fallStep — интервал шага гравитации в секундах.
 * lockDelay — Lock Delay в миллисекундах.
 * maxResets — лимит Move Reset на опоре.
 */
export const LEVEL_CONFIGS: readonly LevelConfig[] = [
    { level: 1, fallStep: 1.2, lockDelay: 1000, maxResets: 20 },
    { level: 2, fallStep: 1.1, lockDelay: 900, maxResets: 20 },
    { level: 3, fallStep: 1.0, lockDelay: 800, maxResets: 15 },
    { level: 4, fallStep: 0.9, lockDelay: 700, maxResets: 15 },
    { level: 5, fallStep: 0.8, lockDelay: 500, maxResets: 15 },
    { level: 6, fallStep: 0.7, lockDelay: 500, maxResets: 12 },
    { level: 7, fallStep: 0.6, lockDelay: 500, maxResets: 12 },
    { level: 8, fallStep: 0.5, lockDelay: 400, maxResets: 10 },
    { level: 9, fallStep: 0.4, lockDelay: 400, maxResets: 10 },
    { level: 10, fallStep: 0.3, lockDelay: 400, maxResets: 8 },
]

export const MIN_LEVEL = LEVEL_CONFIGS[0].level
export const MAX_LEVEL = LEVEL_CONFIGS[LEVEL_CONFIGS.length - 1].level

/** Конфиг уровня; значения вне 1…10 зажимаются в диапазон таблицы. */
export function getLevelConfig(level: number): LevelConfig {
    const raw = Number.isFinite(level) ? Math.floor(level) : MIN_LEVEL
    const safe = Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, raw))
    const config = LEVEL_CONFIGS.find((entry) => entry.level === safe)

    return config ?? LEVEL_CONFIGS[0]
}

/** Интервал гравитации в миллисекундах для уровня. */
export function fallIntervalMsForLevel(level: number): number {
    return getLevelConfig(level).fallStep * 1000
}
