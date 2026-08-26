import type { Filter } from 'pixi.js'
import { filterBgBlue } from '@shaders/bg-blue/bg-blue.filter.js'

export type MosaicFillSource = {
    bakeWidth: number
    bakeHeight: number
    createFilter: (width: number, height: number) => Filter
    onTick?: (filter: Filter, deltaTime: number) => void
}

export const crystalSquaresFill: MosaicFillSource = {
    bakeWidth: 500,
    bakeHeight: 800,
    createFilter: (width, height) => filterBgBlue(width, height) as Filter,
    onTick: (filter, deltaTime) => {
        filter.resources.timeUniforms.uniforms.uTime += 0.02 * deltaTime
    },
}
