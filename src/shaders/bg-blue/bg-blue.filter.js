import {Filter, GlProgram} from 'pixi.js';
import vertexShaderSource from '@shaders/basic/flat.vert?raw';
import fragmentShaderSource from '@shaders/bg-blue/bg-blue.frag?raw'

export const filterBgBlue = (width, height) => {
    return new Filter({
        glProgram: new GlProgram({vertex: vertexShaderSource, fragment: fragmentShaderSource}),
        resources: {
            timeUniforms: {
                uTime: {value: 0.0, type: 'f32'},
            },
        },
    });
}
