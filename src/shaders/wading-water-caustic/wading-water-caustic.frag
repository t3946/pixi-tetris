#version 300 es

// Found this on GLSL sandbox. I really liked it, changed a few things and made it tileable.
// :)
// by David Hoskins.

// Water turbulence effect by joltz0r 2013-07-04, improved 2013-07-07

#define TAU 6.28318530718
#define MAX_ITER 5

uniform float uTime;
uniform vec3 uDeepBlue;
uniform vec3 uMidBlue;
uniform vec3 uHighlight;
uniform float uMidMix;
uniform float uHighlightStrength;
uniform float uTopFade;
float t;

vec4 mainImage(vec4 fragColor, vec2 fragCoord, vec3 iResolution)
{
    float time = t * .5 + 23.0;
    // uv should be the 0-1 uv of texture...
    vec2 uv = fragCoord.xy / iResolution.xy;

    vec2 p = mod(uv * TAU, TAU) - 250.0;
    vec2 i = vec2(p);
    float c = 1.0;
    float inten = .005;

    for (int n = 0; n < MAX_ITER; n++)
    {
        float tIter = time * (1.0 - (3.5 / float(n + 1)));
        i = p + vec2(cos(tIter - i.x) + sin(tIter + i.y), sin(tIter - i.y) + cos(tIter + i.x));
        c += 1.0 / length(vec2(p.x / (sin(i.x + tIter) / inten), p.y / (cos(i.y + tIter) / inten)));
    }
    c /= float(MAX_ITER);
    c = 1.17 - pow(c, 1.4);
    float caustic = pow(abs(c), 8.0);

    vec3 colour = mix(uDeepBlue, uMidBlue, caustic * uMidMix);
    colour += uHighlight * caustic * uHighlightStrength;
    colour = clamp(colour, 0.0, 1.0);

    // Soft fade to black at the top (uv.y = 0)
    colour *= smoothstep(0.0, uTopFade, uv.y);

    return vec4(colour, 1.0);
}

in vec2 vTextureCoord;
out vec4 finalColor;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform highp vec4 uInputSize;
uniform highp vec4 uOutputFrame;

void main(void) {
    t = mod(uTime, 1000.0);
    vec4 fragColor = vec4(0.0);
    vec2 fragCoord = vTextureCoord * uInputSize.xy;
    vec3 resolution = vec3(uOutputFrame.z, uOutputFrame.w, 1.0);
    finalColor = mainImage(fragColor, fragCoord, resolution);
}
