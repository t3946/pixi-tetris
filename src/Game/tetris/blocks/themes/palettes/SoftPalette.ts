import { EPieceType, ThemeColors } from "@src/tetris/blocks";

const lightBlue1: string = '#4ae1d8'
const yellow: string = '#fbfb5f'
const purple: string = '#c08aec'
const green: string = '#2fef2f'
const red: string = '#ff4343'
const blue: string = '#5959f8'
const orange: string = '#ffb938'

export const softThemeColors: ThemeColors = {
    [EPieceType.I]: { [lightBlue1]: 1 },
    [EPieceType.O]: { [yellow]: 1 },
    [EPieceType.T]: { [purple]: 1 },
    [EPieceType.S]: { [green]: 1 },
    [EPieceType.Z]: { [red]: 1 },
    [EPieceType.J]: { [blue]: 1 },
    [EPieceType.L]: { [orange]: 1 },
}