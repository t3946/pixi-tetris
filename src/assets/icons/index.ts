import pause from './pause.svg'
import gear from './gear.svg'
import houseBlank from './house-blank.svg'
import medal from './medal.svg'
import rankingStar from './ranking-star.svg'

export const icons = {
    pause,
    gear,
    houseBlank,
    medal,
    rankingStar,
} as const

export type IconName = keyof typeof icons
