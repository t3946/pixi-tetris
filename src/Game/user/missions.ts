import { EPieceType } from '@src/tetris/blocks/themes'
import { pieceBagWithExtras, type PieceType } from '@src/tetris/tetrominoes'

/** Цель миссии: опциональные пороги по рядам и/или очкам. */
export type Mission = {
    lines?: number
    score?: number
    /** Сложность тетриса (индекс LEVEL_CONFIGS, 1…10). */
    level?: number
    /** Пентамино (и др.), добавляемые к классическому пулу. */
    extraPieces?: readonly PieceType[]
}

export type MissionMetric = 'lines' | 'score'

export const BLITZ_MISSIONS_TOTAL = 3
/** Стартовое значение: миссии «Легко» ещё не проходились */
export const INITIAL_BLITZ_MISSIONS_COMPLETED = 0

export const CHALLENGE_MISSIONS_TOTAL = 3
/** Стартовое значение: миссии «Средне» ещё не проходились */
export const INITIAL_CHALLENGE_MISSIONS_COMPLETED = 0

/** Награда за каждую выполненную миссию */
export const MISSION_REWARD_COIN = 100
export const MISSION_REWARD_JEM = 1

/** Бонус к базовой награде после просмотра рекламы (то, что на кнопке «Реклама») */
export const MISSION_AD_BONUS_COIN = 200
export const MISSION_AD_BONUS_JEM = 3

export type MissionReward = {
    coin: number
    jem: number
}

export const MISSION_REWARD: MissionReward = {
    coin: MISSION_REWARD_COIN,
    jem: MISSION_REWARD_JEM,
}

/** Бонус рекламы — суммы на кнопке «Реклама». */
export function getMissionAdBonus(): MissionReward {
    return {
        coin: MISSION_AD_BONUS_COIN,
        jem: MISSION_AD_BONUS_JEM,
    }
}

/** Базовая награда или базовая + бонус рекламы (100→300, 1→4). */
export function getMissionReward(withAdBonus = false): MissionReward {
    if (!withAdBonus) {
        return {
            coin: MISSION_REWARD_COIN,
            jem: MISSION_REWARD_JEM,
        }
    }

    return {
        coin: MISSION_REWARD_COIN + MISSION_AD_BONUS_COIN,
        jem: MISSION_REWARD_JEM + MISSION_AD_BONUS_JEM,
    }
}

/** Фиксированная последовательность миссий «Легко» (сложность 1 → 2 → 3). */
export const BLITZ_MISSIONS: readonly Mission[] = [
    { lines: 5, level: 1 },
    { score: 1000, level: 2 },
    { lines: 20, score: 3000, level: 3 },
] as const

/**
 * Миссии «Средне»: уровни 4–6, пентамино по нарастающей.
 * 1: V · 2: V+W · 3: X+W (V заменяется на X)
 */
export const CHALLENGE_MISSIONS: readonly Mission[] = [
    { lines: 15, score: 2000, level: 4, extraPieces: [EPieceType.V] },
    { lines: 20, score: 2500, level: 5, extraPieces: [EPieceType.V, EPieceType.W] },
    { lines: 25, score: 3000, level: 6, extraPieces: [EPieceType.X, EPieceType.W] },
] as const

/** Следующая миссия «Легко» по числу уже пройденных. */
export function createBlitzMission(completedCount: number): Mission | null {
    if (completedCount < 0 || completedCount >= BLITZ_MISSIONS.length) {
        return null
    }

    return BLITZ_MISSIONS[completedCount]
}

/** Следующая миссия «Средне» по числу уже пройденных. */
export function createChallengeMission(completedCount: number): Mission | null {
    if (completedCount < 0 || completedCount >= CHALLENGE_MISSIONS.length) {
        return null
    }

    return CHALLENGE_MISSIONS[completedCount]
}

/** Сложность тетриса для следующей миссии «Легко» (по умолчанию 1). */
export function getBlitzTetrisLevel(completedCount: number): number {
    return createBlitzMission(completedCount)?.level ?? 1
}

/** Сложность тетриса для следующей миссии «Средне» (по умолчанию 4). */
export function getChallengeTetrisLevel(completedCount: number): number {
    return createChallengeMission(completedCount)?.level ?? 4
}

/** Пул фигур для миссии (классика + extraPieces). */
export function getMissionPieceBag(mission: Mission | null | undefined): PieceType[] {
    return pieceBagWithExtras(mission?.extraPieces ?? [])
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
