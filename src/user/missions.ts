/** Цель миссии: опциональные пороги по рядам и/или очкам. */
export type Mission = {
    lines?: number
    score?: number
}

export type MissionMetric = 'lines' | 'score'

export const BLITZ_MISSIONS_TOTAL = 3
/** Стартовое значение: миссии Блица ещё не проходились */
export const INITIAL_BLITZ_MISSIONS_COMPLETED = 0

/** Награда за каждую выполненную миссию */
export const MISSION_REWARD_COIN = 100
export const MISSION_REWARD_JEM = 1

export type MissionReward = {
    coin: number
    jem: number
}

export const MISSION_REWARD: MissionReward = {
    coin: MISSION_REWARD_COIN,
    jem: MISSION_REWARD_JEM,
}

/** Фиксированная последовательность миссий Блица. */
export const BLITZ_MISSIONS: readonly Mission[] = [
    { lines: 5 },
    { score: 1000 },
    { lines: 20, score: 3000 },
] as const

/** Следующая миссия Блица по числу уже пройденных. */
export function createBlitzMission(completedCount: number): Mission | null {
    if (completedCount < 0 || completedCount >= BLITZ_MISSIONS.length) {
        return null
    }

    return BLITZ_MISSIONS[completedCount]
}

export function isMissionComplete(
    mission: Mission,
    score: number,
    linesCleared: number,
): boolean {
    if (mission.lines == null && mission.score == null) {
        return false
    }

    if (mission.lines != null && linesCleared < mission.lines) {
        return false
    }

    if (mission.score != null && score < mission.score) {
        return false
    }

    return true
}

/**
 * Прогресс 0…1 для панели счётчика.
 * `null` — метрика не входит в миссию, бар не показываем.
 */
export function getMissionProgress(
    mission: Mission | null,
    metric: MissionMetric,
    value: number,
): number | null {
    const target = mission?.[metric]

    if (target == null || target <= 0) {
        return null
    }

    return Math.min(1, Math.max(0, value / target))
}
