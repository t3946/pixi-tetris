/** Цель миссии: набрать очки или собрать ряды. */
export type Mission = {
    kind: 'score' | 'lines'
    target: number
}

export const BLITZ_MISSIONS_TOTAL = 3
/** Стартовое значение: миссии Блица ещё не проходились */
export const INITIAL_BLITZ_MISSIONS_COMPLETED = 0
export const BLITZ_SCORE_TARGET = 200
export const BLITZ_LINES_TARGET = 3

/** Случайная миссия для режима Блиц. */
export function createBlitzMission(): Mission {
    return Math.random() < 0.5
        ? { kind: 'score', target: BLITZ_SCORE_TARGET }
        : { kind: 'lines', target: BLITZ_LINES_TARGET }
}

export function isMissionComplete(
    mission: Mission,
    score: number,
    linesCleared: number,
): boolean {
    if (mission.kind === 'score') {
        return score >= mission.target
    }

    return linesCleared >= mission.target
}
