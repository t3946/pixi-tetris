import { Color as PixiColor, type ColorSource } from 'pixi.js'

/** Любой формат, который понимает Pixi Color, плюс наш Color. */
export type ColorInput = ColorSource | Color

const BARE_HEX = /^[0-9a-fA-F]{3,8}$/

function normalizeInput(value: ColorInput): ColorSource {
    if (value instanceof Color) {
        return value
    }

    if (typeof value === 'string') {
        const trimmed = value.trim()

        if (BARE_HEX.test(trimmed)) {
            return `#${trimmed}`
        }
    }

    return value
}

/**
 * Обёртка над Pixi Color: все преобразования и манипуляции каналами — через объект Color.
 * Конструктор дополнительно нормализует «голый» hex (`4fb1ff` → `#4fb1ff`).
 */
export class Color extends PixiColor {
    constructor(value: ColorInput = 0xffffff) {
        super(normalizeInput(value))
    }

    /** Копия текущего цвета. */
    clone(): Color {
        return new Color(this)
    }

    /** Строка `rgb(r, g, b)`. */
    rgb(): string {
        const [r, g, b] = this.toUint8RgbArray()

        return `rgb(${r}, ${g}, ${b})`
    }

    /** Строка `rgba(r, g, b, a)`. */
    rgba(alpha: number): string {
        const [r, g, b] = this.toUint8RgbArray()

        return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }

    /** Умножает RGB-каналы (затемнение при factor < 1). Возвращает новый Color. */
    scale(factor: number): Color {
        return this.clone().multiply([factor, factor, factor, 1])
    }

    /** Затемнение — alias для {@link scale}. */
    darken(factor: number): Color {
        return this.scale(factor)
    }

    /** Смешивает с белым; factor — доля белого (0…1). Возвращает новый Color. */
    lighten(factor: number): Color {
        const [r, g, b] = this.toUint8RgbArray()

        return new Color({
            r: Math.round(r + (255 - r) * factor),
            g: Math.round(g + (255 - g) * factor),
            b: Math.round(b + (255 - b) * factor),
        })
    }

    /** Добавляет amount к каждому каналу (0–255), с ограничением сверху. */
    lightenBy(amount: number): Color {
        const [r, g, b] = this.toUint8RgbArray()

        return new Color({
            r: Math.min(255, r + amount),
            g: Math.min(255, g + amount),
            b: Math.min(255, b + amount),
        })
    }

    /** Линейная интерполяция между двумя цветами (t: 0…1). */
    static lerp(from: ColorInput, to: ColorInput, t: number): Color {
        const [r1, g1, b1] = new Color(from).toUint8RgbArray()
        const [r2, g2, b2] = new Color(to).toUint8RgbArray()

        return new Color({
            r: Math.round(r1 + (r2 - r1) * t),
            g: Math.round(g1 + (g2 - g1) * t),
            b: Math.round(b1 + (b2 - b1) * t),
        })
    }
}
