import pause from './pause.svg'

export const icons = {
    pause,
} as const

export type IconName = keyof typeof icons
