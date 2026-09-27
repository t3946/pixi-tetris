/**
 * Глобальная палитра (Raw Palette).
 * Физические цвета, привязанные к именам. Без семантики — только значения.
 */

export const palette = {
    // Neutrals
    white: '#ffffff',
    black: '#000000',

    gray_100: '#f5f5f5',
    gray_200: '#e0e0e0',
    gray_300: '#bdbdbd',
    gray_400: '#9e9e9e',
    gray_500: '#666666',
    gray_600: '#424242',
    gray_700: '#2c3642',
    gray_800: '#222222',
    gray_900: '#121212',

    // Blue / slate (UI surfaces)
    slate_200: '#6b7c8d',
    slate_400: '#4a5a6a',
    slate_600: '#2c3642',

    blue_200: '#7ec8e3',
    blue_400: '#1099bb',
    blue_500: '#0000f0',
    blue_700: '#0a6a85',

    // Accent / tetromino hues
    cyan_200: '#d0f8ff',
    cyan_400: '#00e5ff',
    cyan_500: '#00f0f0',
    cyan_700: '#007ea3',
    yellow_500: '#f0f000',
    /** Primary button top (buttons-design: Продолжить / Забрать) */
    gold_300: '#ffe234',
    gold_400: '#ffd600',
    /** Primary button bottom (buttons-design: Продолжить / Забрать) */
    gold_600: '#f5a800',
    ruby_400: '#e0115f',
    purple_500: '#a000f0',
    green_500: '#00f000',
    red_500: '#f00000',
    /** Danger button text */
    pink_200: '#ffb3c6',
    /** Danger button top */
    wine_600: '#6b2040',
    /** Danger button bottom */
    wine_800: '#4a1030',
    orange_500: '#f0a000',

    navy_800: '#12103a',
    navy_900: '#0d0a2e',
    navy_950: '#100823',
    navy_980: '#0a0a1a',
    navy_990: '#05081c',
    /** Primary button text (buttons-design: Продолжить / Забрать) */
    brown_990: '#1a0e00',

    violet_300: '#a78bfa',
    /** Secondary button top (buttons-design: Настройки) */
    violet_400: '#6a4fc8',
    violet_500: '#7c3aed',
    violet_600: '#9d3ae8',
    /** Secondary button bottom (buttons-design: Настройки) */
    violet_750: '#4a35a0',

    purple_100: '#e3dcfd',
    purple_300: '#83c8e3',
    purple_400: '#7E64E8',
    purple_700: '#3B1F84',
    purple_800: '#2E3554',
    purple_900: '#6090e5',
    purple_950: '#151A31',
    coral_300: '#F0919E',
    coral_400: '#E07A8A',
} as const

export type PaletteColor = keyof typeof palette
export type PaletteValue = (typeof palette)[PaletteColor]
