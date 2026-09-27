in vec2 vTextureCoord;
uniform sampler2D uTexture;
uniform float uTime;

void main(void) {
    vec4 color = texture2D(uTexture, vTextureCoord);
    color.rgb *= 0.5 + 0.5 * sin(uTime);
    gl_FragColor = color;
}