import type { Filter } from 'pixi.js'
import { EBackgroundShaderId } from '@shaders/game-backgrounds/EBackgroundShaderId'
import { filterCrystalSquares } from '@shaders/game-backgrounds/crystal-squares/crystal-squares.filter.js'
import { filterPurpleTiles } from '@shaders/game-backgrounds/purple-tiles/purple-tiles.filter.js'
import {
    filterWadingWaterCaustic,
    wadingWaterCausticColors,
} from '@shaders/game-backgrounds/wading-water-caustic/wading-water-caustic.filter.js'

export type MosaicFillSource = {
    shader: EBackgroundShaderId
    bakeWidth: number
    bakeHeight: number
}

const DEFAULT_BAKE_WIDTH = 500
const DEFAULT_BAKE_HEIGHT = 800

export function getMosaicFillSource(
    shader: EBackgroundShaderId,
    bakeWidth = DEFAULT_BAKE_WIDTH,
    bakeHeight = DEFAULT_BAKE_HEIGHT,
): MosaicFillSource {
    return { shader, bakeWidth, bakeHeight }
}

export function createBackgroundFilter(
    shader: EBackgroundShaderId,
    width: number,
    height: number,
): Filter {
    switch (shader) {
        case EBackgroundShaderId.CrystalSquares:
            return filterCrystalSquares(width, height) as Filter
        case EBackgroundShaderId.PurpleTiles:
            return filterPurpleTiles(width, height) as Filter
        case EBackgroundShaderId.WadingWaterCaustic:
            return filterWadingWaterCaustic(width, height) as Filter
    }
}

export function tickBackgroundFilter(
    shader: EBackgroundShaderId,
    filter: Filter,
    deltaTime: number,
): void {
    const time = filter.resources.timeUniforms.uniforms.uTime as number

    switch (shader) {
        case EBackgroundShaderId.CrystalSquares:
            filter.resources.timeUniforms.uniforms.uTime = time + 0.02 * deltaTime
            break
        case EBackgroundShaderId.PurpleTiles:
            filter.resources.timeUniforms.uniforms.uTime = time + 0.02 * deltaTime
            break
        case EBackgroundShaderId.WadingWaterCaustic:
            filter.resources.timeUniforms.uniforms.uTime =
                time + 0.015 * wadingWaterCausticColors.speed * deltaTime
            break
    }
}
