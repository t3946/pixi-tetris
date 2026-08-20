import { FIELD_BORDER } from '@components/Grid/Grid.tsx'
import { useAppLayout } from '@src/scenes/useAppLayout'
import { BOARD_COLS } from '@src/tetris/constants'

/** Целевой боковой отступ, как прежние 7%. Итог будет близким, но в пикселях. */
const TARGET_SIDE_PADDING_RATIO = 0.07

export type GameColumnLayout = {
    cellSize: number
    wellWidth: number
    paddingStart: number
    paddingEnd: number
}

const EMPTY_LAYOUT: GameColumnLayout = {
    cellSize: 0,
    wellWidth: 0,
    paddingStart: 0,
    paddingEnd: 0,
}

/**
 * Исключение игрового экрана: клетка остаётся целой, а «почти 7%» полей
 * подгоняются так, чтобы стакан и дашборд заняли одну и ту же колонку
 * без зазора справа.
 *
 * wellWidth + paddingStart + paddingEnd === containerWidth
 */
export function computeGameColumnLayout(containerWidth: number): GameColumnLayout {
    if (containerWidth <= 0) {
        return EMPTY_LAYOUT
    }

    const idealInnerWidth = containerWidth * (1 - TARGET_SIDE_PADDING_RATIO * 2)
    const maxCellSize = Math.floor(
        Math.max(0, containerWidth - FIELD_BORDER * 2) / BOARD_COLS,
    )
    const cellSize = Math.max(
        0,
        Math.min(
            maxCellSize,
            Math.round((idealInnerWidth - FIELD_BORDER * 2) / BOARD_COLS),
        ),
    )
    const wellWidth = cellSize * BOARD_COLS + FIELD_BORDER * 2
    const totalPadding = containerWidth - wellWidth

    const paddingStart = Math.floor(totalPadding / 2)
    const paddingEnd = totalPadding - paddingStart

    return { cellSize, wellWidth, paddingStart, paddingEnd }
}

export function useGameColumnLayout(): GameColumnLayout {
    const { mainSize } = useAppLayout()

    return computeGameColumnLayout(mainSize.width)
}
