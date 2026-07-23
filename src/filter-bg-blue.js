import { Filter, GlProgram } from 'pixi.js';

// universal vertex shader
const vertex = `
in vec2 aPosition;
out vec2 vTextureCoord;

uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;

vec4 filterVertexPosition(void) {
    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0 * uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;
    return vec4(position, 0.0, 1.0);
}

vec2 filterTextureCoord(void) {
    return aPosition * (uOutputFrame.zw * uInputSize.zw);
}

void main(void) {
    gl_Position = filterVertexPosition();
    vTextureCoord = filterTextureCoord();
}
`;

const fragment = `
in vec2 vTextureCoord;
uniform sampler2D uTexture;
uniform float uTime;

void main(void) {
    vec4 color = texture2D(uTexture, vTextureCoord);
    color.rgb *= 0.5 + 0.5 * sin(uTime);
    gl_FragColor = color;
}
`;

export const filterShadingInOut = new Filter({
  glProgram: new GlProgram({ vertex, fragment }),
  resources: {
    timeUniforms: {
      uTime: { value: 0.0, type: 'f32' },
    },
  },
});
