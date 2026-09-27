import type { Filter } from 'pixi.js'
import { EBackgroundShaderId } from '@shaders/game-backgrounds/EBackgroundShaderId'
import { filterCrystalSquares } from '@shaders/game-backgrounds/crystal-squares/crystal-squares.filter.js'
import { filterPurpleTiles } from '@shaders/game-backgrounds/purple-tiles/purple-tiles.filter.js'
import { filterNeonwaveSunrise } from '@shaders/game-backgrounds/neonwave-sunrise/neonwave-sunrise.filter.js'
import { filterOceanUnder } from '@shaders/game-backgrounds/ocean-under/ocean-under.filter.js'
import { filterShine } from '@shaders/game-backgrounds/shine/shine.filter.js'
import {
    filterWadingWaterCaustic,
    wadingWaterCausticColors,
} from '@shaders/game-backgrounds/wading-water-caustic/wading-water-caustic.filter.js'

const DEFAULT_INTRO_FADE_DURATION = 4.0

function introFadeOptions(shadingOptions?: Record<string, unknown>) {
    const duration = shadingOptions?.introFadeDuration
    return {
        introFade: Boolean(shadingOptions?.introFade),
        introFadeDuration:
            typeof duration === 'number' && Number.isFinite(duration)
                ? duration
                : DEFAULT_INTRO_FADE_DURATION,
    }
}

export function createBackgroundFilter(
    shader: EBackgroundShaderId,
    width: number,
    height: number,
    shadingOptions?: Record<string, unknown>,
): Filter {
    const introFade = introFadeOptions(shadingOptions)

    switch (shader) {
        case EBackgroundShaderId.CrystalSquares:
            return filterCrystalSquares(width, height, introFade) as Filter
        case EBackgroundShaderId.PurpleTiles:
            return filterPurpleTiles(width, height, introFade) as Filter
        case EBackgroundShaderId.WadingWaterCaustic:
            return filterWadingWaterCaustic(
                width,
                height,
                shadingOptions?.preset as Parameters<typeof filterWadingWaterCaustic>[2],
                introFade,
            ) as Filter
        case EBackgroundShaderId.NeonwaveSunrise:
            return filterNeonwaveSunrise(width, height, introFade) as Filter
        case EBackgroundShaderId.OceanUnder:
            return filterOceanUnder(width, height, {
                ...introFade,
                quality: shadingOptions?.quality === 'low' ? 'low' : 'high',
            }) as Filter
        case EBackgroundShaderId.Shine:
            return filterShine(width, height, introFade) as Filter
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
        case EBackgroundShaderId.NeonwaveSunrise: {
            const uniforms = filter.resources.timeUniforms.uniforms
            const pulse = Number(uniforms.uPulse) || 0
            // Полёт над горами: буст ≈ 1/3 от прежних ×50
            const flightMul = 1.0 + pulse * (50.0 / 3.0)
            uniforms.uTime = time + 0.02 * deltaTime
            uniforms.uTravel = (Number(uniforms.uTravel) || 0) + 0.02 * deltaTime * flightMul
            break
        }
        case EBackgroundShaderId.OceanUnder:
            filter.resources.timeUniforms.uniforms.uTime = time + 0.02 * deltaTime
            break
        case EBackgroundShaderId.Shine:
            filter.resources.timeUniforms.uniforms.uTime = time + 0.02 * deltaTime
            break
    }
}
