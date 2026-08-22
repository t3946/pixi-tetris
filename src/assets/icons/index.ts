import pause from './pause.svg'
import gear from './gear.svg'
import houseBlank from './house-blank.svg'
import medal from './medal.svg'
import rankingStar from './ranking-star.svg'
import volume from './volume.svg'
import volumeMute from './volume-mute.svg'
import star from './star.svg'
import layers from './layers.svg'
import palette from './palette.svg'
import leftArrow from './left-arrow.svg'
import skull from './skull.svg'
import skullAndEyePatch from './skull-and-eye-patch.svg'

export const icons = {
    pause,
    gear,
    houseBlank,
    medal,
    rankingStar,
    volume,
    volumeMute,
    star,
    layers,
    palette,
    leftArrow,
    skull,
    skullAndEyePatch,
} as const

export type IconName = keyof typeof icons
