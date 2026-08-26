import type { Filter } from 'pixi.js'
import { EShaderId } from '@shaders/EShaderId'
import { filterBgBlue } from '@shaders/bg-blue/bg-blue.filter.js'
import { filterPurpleTiles } from '@shaders/purple-tiles/purple-tiles.filter.js'
import {
    filterWadingWaterCaustic,
    wadingWaterCausticColors,
} from '@shaders/wading-water-caustic/wading-water-caustic.filter.js'
import { filterShadingInOut } from '@shaders/linear-black-in-out/filter-shading-in-out'

export type MosaicFillSource = {
    shader: EShaderId
    bakeWidth: number
    bakeHeight: number
}

const DEFAULT_BAKE_WIDTH = 500
const DEFAULT_BAKE_HEIGHT = 800

export function getMosaicFillSource(
    shader: EShaderId,
    bakeWidth = DEFAULT_BAKE_WIDTH,
    bakeHeight = DEFAULT_BAKE_HEIGHT,
): MosaicFillSource {
    return { shader, bakeWidth, bakeHeight }
}

export function createMosaicFilter(shader: EShaderId, width: number, height: number): Filter {
    switch (shader) {
        case EShaderId.BgBlue:
            return filterBgBlue(width, height) as Filter
        case EShaderId.PurpleTiles:
            return filterPurpleTiles(width, height) as Filter
        case EShaderId.WadingWaterCaustic:
            return filterWadingWaterCaustic(width, height) as Filter
        case EShaderId.LinearBlackInOut:
            return filterShadingInOut as Filter
    }
}

export function tickMosaicFilter(shader: EShaderId, filter: Filter, deltaTime: number): void {
    const time = filter.resources.timeUniforms.uniforms.uTime as number

    switch (shader) {
        case EShaderId.BgBlue:
            filter.resources.timeUniforms.uniforms.uTime = time + 0.02 * deltaTime
            break
        case EShaderId.PurpleTiles:
            filter.resources.timeUniforms.uniforms.uTime = time + 0.02 * deltaTime
            break
        case EShaderId.WadingWaterCaustic:
            filter.resources.timeUniforms.uniforms.uTime =
                time + 0.015 * wadingWaterCausticColors.speed * deltaTime
            break
        case EShaderId.LinearBlackInOut:
            filter.resources.timeUniforms.uniforms.uTime = time + 0.04 * deltaTime
            break
    }
}
