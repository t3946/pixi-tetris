export type GameModeId = 'blitz' | 'challenge' | 'hardcore' | 'free'

export type ModeMissions = {
    total: number
    available: number
    resetHours: number
}

export type GameMode = {
    id: GameModeId
    name: string
    accentColor: string
    missions: ModeMissions | null
}

export type BoardCell = {
    x: number
    y: number
    color: string
    ghost?: boolean
}

export const MENU_DESIGN_WIDTH = 390

export const GAME_MODES: GameMode[] = [
    {
        id: 'blitz',
        name: 'Блиц',
        accentColor: '#4ade80',
        missions: { total: 3, available: 3, resetHours: 1 },
    },
    {
        id: 'challenge',
        name: 'Испытания',
        accentColor: '#fbbf24',
        missions: { total: 4, available: 1, resetHours: 41 },
    },
    {
        id: 'hardcore',
        name: 'Хардкор',
        accentColor: '#f87171',
        missions: { total: 5, available: 1, resetHours: 65 },
    },
    {
        id: 'free',
        name: 'Свободный',
        accentColor: '#60a5fa',
        missions: null,
    },
]

export const MODE_BOARDS: Record<GameModeId, BoardCell[]> = {
    blitz: [
        { x: 2, y: 1, color: '#4ade80' },
        { x: 2, y: 2, color: '#4ade80' },
        { x: 3, y: 2, color: '#4ade80' },
        { x: 4, y: 2, color: '#4ade80' },
        { x: 2, y: 4, color: '#4ade80', ghost: true },
        { x: 2, y: 5, color: '#4ade80', ghost: true },
        { x: 3, y: 5, color: '#4ade80', ghost: true },
        { x: 4, y: 5, color: '#4ade80', ghost: true },
        { x: 0, y: 6, color: '#4ade80' },
        { x: 1, y: 6, color: '#86efac' },
        { x: 2, y: 6, color: '#4ade80' },
        { x: 3, y: 6, color: '#86efac' },
        { x: 4, y: 6, color: '#4ade80' },
        { x: 5, y: 6, color: '#86efac' },
    ],
    challenge: [
        { x: 3, y: 0, color: '#fbbf24' },
        { x: 4, y: 0, color: '#fbbf24' },
        { x: 2, y: 1, color: '#fbbf24' },
        { x: 3, y: 1, color: '#fbbf24' },
        { x: 3, y: 3, color: '#fbbf24', ghost: true },
        { x: 4, y: 3, color: '#fbbf24', ghost: true },
        { x: 2, y: 4, color: '#fbbf24', ghost: true },
        { x: 3, y: 4, color: '#fbbf24', ghost: true },
        { x: 0, y: 5, color: '#fbbf24' },
        { x: 1, y: 5, color: '#f59e0b' },
        { x: 2, y: 5, color: '#fbbf24' },
        { x: 4, y: 5, color: '#f59e0b' },
        { x: 5, y: 5, color: '#fbbf24' },
        { x: 0, y: 6, color: '#f59e0b' },
        { x: 1, y: 6, color: '#fbbf24' },
        { x: 2, y: 6, color: '#f59e0b' },
        { x: 3, y: 6, color: '#fbbf24' },
        { x: 4, y: 6, color: '#f59e0b' },
        { x: 5, y: 6, color: '#fbbf24' },
    ],
    hardcore: [
        { x: 1, y: 0, color: '#f87171' },
        { x: 2, y: 0, color: '#f87171' },
        { x: 3, y: 0, color: '#f87171' },
        { x: 2, y: 1, color: '#f87171' },
        { x: 0, y: 2, color: '#ef4444' },
        { x: 1, y: 2, color: '#f87171' },
        { x: 2, y: 2, color: '#ef4444' },
        { x: 3, y: 2, color: '#f87171' },
        { x: 4, y: 2, color: '#ef4444' },
        { x: 5, y: 2, color: '#f87171' },
        { x: 0, y: 3, color: '#f87171' },
        { x: 1, y: 3, color: '#ef4444' },
        { x: 2, y: 3, color: '#f87171' },
        { x: 3, y: 3, color: '#ef4444' },
        { x: 4, y: 3, color: '#f87171' },
        { x: 5, y: 3, color: '#ef4444' },
        { x: 0, y: 4, color: '#ef4444' },
        { x: 1, y: 4, color: '#f87171' },
        { x: 2, y: 4, color: '#ef4444' },
        { x: 3, y: 4, color: '#f87171' },
        { x: 4, y: 4, color: '#ef4444' },
        { x: 5, y: 4, color: '#f87171' },
        { x: 0, y: 5, color: '#f87171' },
        { x: 1, y: 5, color: '#ef4444' },
        { x: 2, y: 5, color: '#f87171' },
        { x: 3, y: 5, color: '#ef4444' },
        { x: 4, y: 5, color: '#f87171' },
        { x: 5, y: 5, color: '#ef4444' },
        { x: 0, y: 6, color: '#ef4444' },
        { x: 1, y: 6, color: '#f87171' },
        { x: 2, y: 6, color: '#ef4444' },
        { x: 3, y: 6, color: '#f87171' },
        { x: 4, y: 6, color: '#ef4444' },
        { x: 5, y: 6, color: '#f87171' },
    ],
    free: [
        { x: 1, y: 2, color: '#60a5fa' },
        { x: 2, y: 2, color: '#60a5fa' },
        { x: 1, y: 3, color: '#60a5fa' },
        { x: 2, y: 3, color: '#60a5fa' },
        { x: 4, y: 3, color: '#93c5fd' },
        { x: 5, y: 3, color: '#93c5fd' },
        { x: 4, y: 4, color: '#93c5fd' },
        { x: 0, y: 6, color: '#60a5fa' },
        { x: 1, y: 6, color: '#93c5fd' },
        { x: 3, y: 6, color: '#60a5fa' },
        { x: 4, y: 6, color: '#93c5fd' },
        { x: 5, y: 6, color: '#60a5fa' },
    ],
}

export const MINI_BOARD_COLS = 6
export const MINI_BOARD_ROWS = 7

export type TetrominoShape = {
    cells: [number, number][]
    color: number
}

export const FALLING_TETROMINOES: TetrominoShape[] = [
    { cells: [[0, 0], [1, 0], [2, 0], [3, 0]], color: 0x00e5ff },
    { cells: [[0, 0], [1, 0], [0, 1], [1, 1]], color: 0xffd600 },
    { cells: [[1, 0], [0, 1], [1, 1], [2, 1]], color: 0xaa00ff },
    { cells: [[1, 0], [2, 0], [0, 1], [1, 1]], color: 0x00e676 },
    { cells: [[0, 0], [1, 0], [1, 1], [2, 1]], color: 0xff1744 },
    { cells: [[0, 0], [0, 1], [0, 2], [1, 2]], color: 0xff6d00 },
    { cells: [[1, 0], [1, 1], [0, 2], [1, 2]], color: 0x2979ff },
]
