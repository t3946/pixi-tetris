import { Filter, GlProgram } from 'pixi.js'
import vertexShaderSource from '@shaders/basic/flat.vert?raw'
import fragmentShaderSource from '@shaders/game-backgrounds/ocean-under/ocean-under.frag?raw'

/** Presets for later graphics/optimization pass. Default is `high` (full Shadertoy fidelity). */
export const oceanUnderQuality = {
    /** Original: STEP 36, FAR 35, 5 wave octaves, 5 bisection iters */
    high: 'high',
    /** Mobile/min: STEP 24, FAR 32, 4 wave octaves, 3 bisection iters */
    low: 'low',
}

export const filterOceanUnder = (
    width,
    height,
    { introFade = false, introFadeDuration = 4.0, quality = oceanUnderQuality.high } = {},
) => {
    const lowQuality = quality === oceanUnderQuality.low

    return new Filter({
        glProgram: new GlProgram({ vertex: vertexShaderSource, fragment: fragmentShaderSource }),
        resources: {
            timeUniforms: {
                uTime: { value: 0.0, type: 'f32' },
                uIntroFade: { value: introFade ? 1.0 : 0.0, type: 'f32' },
                uIntroFadeDuration: { value: introFadeDuration, type: 'f32' },
                uLowQuality: { value: lowQuality ? 1.0 : 0.0, type: 'f32' },
            },
        },
    })
}
