import { Filter, GlProgram } from 'pixi.js'
import vertexShaderSource from '@shaders/basic/flat.vert?raw'
import fragmentShaderSource from '@shaders/game-backgrounds/galaxy/galaxy.frag?raw'

/** Presets for graphics quality. Default is `high` (full Shadertoy fidelity). */
export const galaxyQuality = {
    /** Original: 20+20 cloud layers, 4/6 FBM octaves */
    high: 'high',
    /** Mobile/min: ~7+8 cloud layers, 2/3 FBM octaves */
    low: 'low',
}

export const filterGalaxy = (
    width,
    height,
    { introFade = false, introFadeDuration = 4.0, quality = galaxyQuality.high } = {},
) => {
    const lowQuality = quality === galaxyQuality.low

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
