import {Filter, GlProgram} from 'pixi.js';
import vertexShaderSource from '../basic/flat.vert?raw';
import fragmentShaderSource from './bg-blue.frag?raw'

export const filterBgBlue = (app) => {
    console.log([app.screen.width, app.screen.height])
    return new Filter({
        glProgram: new GlProgram({vertex: vertexShaderSource, fragment: fragmentShaderSource}),
        resources: {
            timeUniforms: {
                uTime: {value: 0.0, type: 'f32'},
                uResolution: {value: [app.screen.width, app.screen.height], type: 'vec2<f32>'}
            },
        },
    });
}
