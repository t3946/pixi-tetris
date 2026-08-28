import {Filter, GlProgram} from 'pixi.js'
import vertexShaderSource from '@shaders/basic/flat.vert?raw'
import fragmentShaderSource from '@shaders/game-backgrounds/wading-water-caustic/wading-water-caustic.frag?raw'

/** Named color/speed presets for the caustic background */
export const wadingWaterCausticPresets = {
    ember: {
        // Base fill — darkest water, where there is no caustic light
        deepBlue: '#0f0500',
        // Mid tone — water color under moderate caustic intensity
        midBlue: '#3d0f00',
        // Bright caustic streaks — light refracted through the surface
        highlight: '#ff4800',
        // How strongly caustics pull the base toward midBlue (0 = only deepBlue)
        midMix: 0.55,
        // How bright the caustic streaks are (0 = no highlights)
        highlightStrength: 0.35,
        // Animation speed (1 = default, lower = slower)
        speed: 0.8,
        // Soft fade to black at the top, as fraction of screen height (0.05 = 5%)
        topFade: 1,
    },
    deepBlue: {
        // Base fill — darkest water, where there is no caustic light
        deepBlue: '#0a0520',
        // Mid tone — water color under moderate caustic intensity
        midBlue: '#1b1867',
        // Bright caustic streaks — light refracted through the surface
        highlight: '#508dd3',
        // How strongly caustics pull the base toward midBlue (0 = only deepBlue)
        midMix: 0.45,
        // How bright the caustic streaks are (0 = no highlights)
        highlightStrength: 0.24,
        // Animation speed (1 = default, lower = slower)
        speed: 0.65,
        // Soft fade to black at the top, as fraction of screen height (0.05 = 5%)
        topFade: 1,
    },
}

/** Switch preset here: 'ember' | 'deepBlue' */
export const wadingWaterCausticPreset = 'deepBlue'

export const wadingWaterCausticColors = wadingWaterCausticPresets[wadingWaterCausticPreset]

function hexToRgb01(hex) {
    const n = Number.parseInt(hex.slice(1), 16)
    return new Float32Array([
        ((n >> 16) & 255) / 255,
        ((n >> 8) & 255) / 255,
        (n & 255) / 255,
    ])
}

export const filterWadingWaterCaustic = (width, height, preset = wadingWaterCausticColors) => {
    const c = preset

    return new Filter({
        glProgram: new GlProgram({vertex: vertexShaderSource, fragment: fragmentShaderSource}),
        resources: {
            timeUniforms: {
                uTime: {value: 0.0, type: 'f32'},
            },
            colorUniforms: {
                uDeepBlue: {value: hexToRgb01(c.deepBlue), type: 'vec3<f32>'},
                uMidBlue: {value: hexToRgb01(c.midBlue), type: 'vec3<f32>'},
                uHighlight: {value: hexToRgb01(c.highlight), type: 'vec3<f32>'},
                uMidMix: {value: c.midMix, type: 'f32'},
                uHighlightStrength: {value: c.highlightStrength, type: 'f32'},
                uTopFade: {value: c.topFade, type: 'f32'},
            },
        },
    });
}
