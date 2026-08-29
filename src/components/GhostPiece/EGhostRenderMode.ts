/** Способ отрисовки ghost piece. Переключение — в настройках. */
export enum EGhostRenderMode {
    /** Один силуэт по внешнему контуру полиомино. */
    Unified = 'unified',
    /** Отдельный rounded rect на каждую клетку (как Monomino). */
    PerCell = 'perCell',
}

/** Основной режим по умолчанию. */
export const DEFAULT_GHOST_RENDER_MODE = EGhostRenderMode.Unified
