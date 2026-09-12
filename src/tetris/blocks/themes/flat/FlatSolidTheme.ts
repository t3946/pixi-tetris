import { BlockThemes, type ThemeColors } from '../BlockThemes'
import { softThemeColors } from '@src/tetris/blocks/themes/palettes/SoftPalette.ts'

export class FlatSolidTheme extends BlockThemes {
    readonly colors: ThemeColors = softThemeColors

    constructor() {
        super('flat-solid')
    }
}
