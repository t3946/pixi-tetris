export type MonominoView = {
    setTint: (color: number) => void
    setAlpha: (alpha: number) => void
    getTint: () => number
    getAlpha: () => number
    /** Относительный scale: 1 = полный размер, 0 = точка. */
    setScale: (scale: number) => void
    getScale: () => number
    /**
     * Прячет исходный спрайт и запускает анимацию осколков.
     * Резолвится, когда осколки доиграли и уничтожены.
     */
    shatter: () => Promise<void>
    /** Пиксельный дождь: мелкие квадраты падают вниз с разной скоростью. */
    pixelRain: () => Promise<void>
    /** Взрыв конфетти из центра клетки. */
    confetti: () => Promise<void>
    /** Мелкие белые блёстки (после вспышки в SparkleClearEffect). */
    sparkle: () => Promise<void>
    /** Горизонтальный разрез: две половинки падают вниз. */
    samuraiCut: () => Promise<void>
}

function viewKey(x: number, y: number): string {
    return `${x},${y}`
}

const views = new Map<string, MonominoView>()

/** Регистрирует display-object мономино для ClearEffect. */
export function registerMonominoView(x: number, y: number, view: MonominoView): void {
    views.set(viewKey(x, y), view)
}

export function unregisterMonominoView(x: number, y: number): void {
    views.delete(viewKey(x, y))
}

export function getMonominoView(x: number, y: number): MonominoView | null {
    return views.get(viewKey(x, y)) ?? null
}
