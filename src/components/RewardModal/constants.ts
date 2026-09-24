export const CONTENT_WIDTH = 300
/** Длительность «перетекания» награды из кнопки рекламы в карточки */
export const AD_TRANSFER_MS = 2000
/** Плавное посерение наград в кнопке рекламы при «Забрать» без просмотра */
export const AD_MUTE_MS = 300
/** Пульс числа после окончания анимации счётчика */
export const AMOUNT_PULSE_MS = 320
export const AMOUNT_PULSE_SCALE = 0.15
export const AMOUNT_PULSE_LIGHTEN = 0.20
export const COLLECT_FEEDBACK_MS = 450
export const MODAL_PAD_X = 32
/** Drop-in карточек награды (как coin-drop / gem-drop в notes/RewardModalForGame-main) */
export const CARD_DROP_MS = 450
export const CARD_DROP_COIN_DELAY_MS = 250
export const CARD_DROP_GEM_DELAY_MS = 350
/** Градиент брови из макета Figma: violet → gold → violet */
export const BROW_GRADIENT = ['#8b5cf6', '#fbbf24', '#8b5cf6'] as const
/** Одна волна контраста: золото → яркий блик → золото */
export const TITLE_SHIMMER_COLORS = ['#fbbf24', '#fef08a', '#fbbf24'] as const
/** Ширина волны в долях ширины текста (1 = одна волна на всю строку) */
export const TITLE_SHIMMER_SPAN = 1
export const TITLE_SHIMMER_PERIOD_MS = 2500
