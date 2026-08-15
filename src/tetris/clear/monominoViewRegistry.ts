export type MonominoView = {
    setTint: (color: number) => void
    setAlpha: (alpha: number) => void
    getTint: () => number
    getAlpha: () => number
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
