/**
 * Настройки эффекта Sparkle.
 * Меняй значения здесь — итератор, вспышка и разлёт блёсток читают этот файл.
 */

// --- Вспышка клетки ---

/** Доля смешения цвета клетки к белому (0…1). */
export const SPARKLE_WHITE_BLEND = 0.8

/** Длительность вспышки к белому, мс. */
export const SPARKLE_FLASH_MS = 50

// --- Итератор (порядок и пауза между клетками) ---

/** Интервал между стартами клеток = доля полной длительности эффекта. */
export const SPARKLE_INTERVAL_RATIO = 0.05

// --- Частицы ---

/** Длительность разлёта блёсток после вспышки, мс. */
export const SPARKLE_PARTICLE_MS = 540

/** Цвет блёсток. */
export const SPARKLE_TINT = 0xffffff

/** Базовое число частиц на клетку. */
export const SPARKLE_COUNT_MIN = 16

/** Случайная добавка к числу частиц (итог: MIN … MIN+EXTRA−1). */
export const SPARKLE_COUNT_EXTRA = 8

/** Нижний предел размера искры, px. */
export const SPARKLE_SIZE_MIN_PX = 0.96

/** Верхний предел размера искры, px. */
export const SPARKLE_SIZE_MAX_PX = 1.44

/** Нижний размер искры относительно клетки. */
export const SPARKLE_SIZE_MIN_RATIO = 0.024

/** Верхний размер искры относительно клетки. */
export const SPARKLE_SIZE_MAX_RATIO = 0.066

/** Базовый угол спрайта (ромб). */
export const SPARKLE_ROTATION_BASE = Math.PI / 4

/** Случайный разброс угла спрайта, рад. */
export const SPARKLE_ROTATION_JITTER = 0.4

/** Разброс стартовой позиции относительно центра клетки. */
export const SPARKLE_SPAWN_OFFSET_RATIO = 0.048

/** Минимальная скорость разлёта. */
export const SPARKLE_SPEED_MIN = 1.2

/** Максимальная скорость разлёта. */
export const SPARKLE_SPEED_MAX = 3.36

/** Дополнительный импульс вверх (минимум). */
export const SPARKLE_LIFT_MIN = 0.24

/** Дополнительный импульс вверх (максимум). */
export const SPARKLE_LIFT_MAX = 1.2

/** Разброс угловой скорости, рад/кадр. */
export const SPARKLE_SPIN_JITTER = 0.4

/** Гравитация блёсток. */
export const SPARKLE_GRAVITY = 0.08

/** Скорость мерцания (минимум). */
export const SPARKLE_TWINKLE_SPEED_MIN = 14

/** Скорость мерцания (максимум). */
export const SPARKLE_TWINKLE_SPEED_MAX = 24

/** Шаг фазы мерцания за кадр. */
export const SPARKLE_TWINKLE_PHASE_STEP = 0.05

/** Нижняя граница яркости мерцания. */
export const SPARKLE_TWINKLE_MIN = 0.4

/** Амплитуда мерцания (минимум + амплитуда = 1). */
export const SPARKLE_TWINKLE_AMPLITUDE = 0.6

/** Доля размера искры к концу жизни (остальное добирает fade). */
export const SPARKLE_SIZE_FADE_KEEP = 0.8

/** Доля размера, которая гаснет вместе с жизнью частицы. */
export const SPARKLE_SIZE_FADE_RANGE = 0.2

/** Полная длительность одного SparkleClearEffect (вспышка + частицы). */
export const SPARKLE_EFFECT_MS = SPARKLE_FLASH_MS + SPARKLE_PARTICLE_MS
