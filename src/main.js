import { Application, Filter, Sprite, Texture } from 'pixi.js';
import shaderBody from './bg-shader?raw';

// Default PixiJS v8 filter vertex — Filter.from requires both vertex and fragment
const defaultVertex = `
in vec2 aPosition;
out vec2 vTextureCoord;

uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;

vec4 filterVertexPosition(void)
{
    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;

    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0 * uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

vec2 filterTextureCoord(void)
{
    return aPosition * (uOutputFrame.zw * uInputSize.zw);
}

void main(void)
{
    gl_Position = filterVertexPosition();
    vTextureCoord = filterTextureCoord();
}
`;

function buildFragmentShader(body) {
    return `
in vec2 vTextureCoord;
out vec4 finalColor;
uniform sampler2D uTexture;
uniform float iTime;
uniform vec2 iResolution;

${body}

void main() {
    vec2 fragCoord = vTextureCoord * iResolution;
    vec4 fragColor;
    mainImage(fragColor, fragCoord);
    finalColor = fragColor;
}
`;
}

let app;

async function init(body = shaderBody) {
    if (app) {
        app.canvas.remove();
        app.destroy(true, { children: true, texture: true });
    }

    app = new Application();
    await app.init({
        resizeTo: window,
        backgroundColor: 0x000000,
        antialias: true,
        preference: 'webgl',
    });

    document.body.appendChild(app.canvas);

    const sprite = new Sprite(Texture.WHITE);
    sprite.width = app.screen.width;
    sprite.height = app.screen.height;
    app.stage.addChild(sprite);

    const filter = Filter.from({
        gl: {
            vertex: defaultVertex,
            fragment: buildFragmentShader(body),
        },
        resources: {
            shaderUniforms: {
                iTime: { value: 0, type: 'f32' },
                iResolution: {
                    value: new Float32Array([app.screen.width, app.screen.height]),
                    type: 'vec2<f32>',
                },
            },
        },
    });
    sprite.filters = [filter];

    const uniforms = filter.resources.shaderUniforms.uniforms;
    const startTime = performance.now();

    app.ticker.add(() => {
        uniforms.iTime = (performance.now() - startTime) / 1000;
    });

    app.renderer.on('resize', () => {
        sprite.width = app.screen.width;
        sprite.height = app.screen.height;
        uniforms.iResolution[0] = app.screen.width;
        uniforms.iResolution[1] = app.screen.height;
    });
}

init().catch(console.error);

if (import.meta.hot) {
    import.meta.hot.accept('./bg-shader?raw', async (newModule) => {
        if (newModule) {
            await init(newModule.default);
        }
    });

    import.meta.hot.dispose(() => {
        app?.destroy(true, { children: true, texture: true });
    });
}
