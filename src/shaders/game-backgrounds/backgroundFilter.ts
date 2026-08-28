import type { Filter } from 'pixi.js'
import { EBackgroundShaderId } from '@shaders/game-backgrounds/EBackgroundShaderId'
import { filterCrystalSquares } from '@shaders/game-backgrounds/crystal-squares/crystal-squares.filter.js'
import { filterPurpleTiles } from '@shaders/game-backgrounds/purple-tiles/purple-tiles.filter.js'
import {
    filterWadingWaterCaustic,
    wadingWaterCausticColors,
} from '@shaders/game-backgrounds/wading-water-caustic/wading-water-caustic.filter.js'

export function createBackgroundFilter(
    shader: EBackgroundShaderId,
    width: number,
    height: number,
    shadingOptions?: Record<string, unknown>,
): Filter {
    switch (shader) {
        case EBackgroundShaderId.CrystalSquares:
            return filterCrystalSquares(width, height) as Filter
        case EBackgroundShaderId.PurpleTiles:
            return filterPurpleTiles(width, height) as Filter
        case EBackgroundShaderId.WadingWaterCaustic:
            return filterWadingWaterCaustic(
                width,
                height,
                shadingOptions?.preset as Parameters<typeof filterWadingWaterCaustic>[2],
            ) as Filter
    }
}

export function tickBackgroundFilter(
    shader: EBackgroundShaderId,
    filter: Filter,
    deltaTime: number,
    shadingOptions?: Record<string, unknown>,
): void {
    const time = filter.resources.timeUniforms.uniforms.uTime as number

    switch (shader) {
        case EBackgroundShaderId.CrystalSquares:
            filter.resources.timeUniforms.uniforms.uTime = time + 0.02 * deltaTime
            break
        case EBackgroundShaderId.PurpleTiles:
            filter.resources.timeUniforms.uniforms.uTime = time + 0.02 * deltaTime
            break
        case EBackgroundShaderId.WadingWaterCaustic: {
            const preset = shadingOptions?.preset as { speed?: number } | undefined
            const speed = preset?.speed ?? wadingWaterCausticColors.speed
            filter.resources.timeUniforms.uniforms.uTime = time + 0.015 * speed * deltaTime
            break
        }
    }
}
