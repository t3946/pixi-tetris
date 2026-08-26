import {Filter, GlProgram} from 'pixi.js';
import vertexShaderSource from '@shaders/basic/flat.vert?raw'
import fragmentShaderSource from '@shaders/game-backgrounds/purple-tiles/purple-tiles.frag?raw'

export const filterPurpleTiles = (width, height) => {
    return new Filter({
        glProgram: new GlProgram({vertex: vertexShaderSource, fragment: fragmentShaderSource}),
        resources: {
            timeUniforms: {
                uTime: {value: 0.0, type: 'f32'},
            },
        },
    });
}
