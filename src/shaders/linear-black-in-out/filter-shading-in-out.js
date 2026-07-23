import {Filter, GlProgram} from 'pixi.js';
import vertexShaderSource from '../basic/flat.vert?raw';
import fragmentShaderSource from './linear-black-in-out.frag?raw'

export const filterShadingInOut = new Filter({
    glProgram: new GlProgram({vertex: vertexShaderSource, fragment: fragmentShaderSource}),
    resources: {
        timeUniforms: {
            uTime: {value: 0.0, type: 'f32'},
        },
    },
});
