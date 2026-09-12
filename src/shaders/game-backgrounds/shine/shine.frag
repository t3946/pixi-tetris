#version 300 es
precision highp float;

// Shine — adapted from Shadertoy for PixiJS

#define MOD3 vec3(0.1031, 0.11369, 0.13787)
#define BLACK_COL vec3(16.0, 21.0, 25.0) / 255.0

uniform float uTime;
uniform float uIntroFade;
uniform float uIntroFadeDuration;
float t;

vec3 hash33(vec3 p3) {
    p3 = fract(p3 * MOD3);
    p3 += dot(p3, p3.yxz + 19.19);
    return -1.0 + 2.0 * fract(vec3(
        (p3.x + p3.y) * p3.z,
        (p3.x + p3.z) * p3.y,
        (p3.y + p3.z) * p3.x
    ));
}

float simplex_noise(vec3 p) {
    const float K1 = 0.333333333;
    const float K2 = 0.166666667;

    vec3 i = floor(p + (p.x + p.y + p.z) * K1);
    vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);

    vec3 e = step(vec3(0.0), d0 - d0.yzx);
    vec3 i1 = e * (1.0 - e.zxy);
    vec3 i2 = 1.0 - e.zxy * (1.0 - e);

    vec3 d1 = d0 - (i1 - 1.0 * K2);
    vec3 d2 = d0 - (i2 - 2.0 * K2);
    vec3 d3 = d0 - (1.0 - 3.0 * K2);

    vec4 h = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);
    vec4 n = h * h * h * h * vec4(
        dot(d0, hash33(i)),
        dot(d1, hash33(i + i1)),
        dot(d2, hash33(i + i2)),
        dot(d3, hash33(i + 1.0))
    );

    return dot(vec4(31.316), n);
}

vec4 mainImage(vec4 fragColor, vec2 fragCoord, vec3 iResolution) {
    vec2 q = fragCoord / iResolution.xy;
    // Disk ends at l≈1; base fit to shorter axis, then enlarge ~1/3 for gameplay
    float halfMin = 0.5 * min(iResolution.x, iResolution.y);
    vec2 uv = (fragCoord.xy - iResolution.xy * 0.5) / halfMin * 0.75;

    float a = sin(atan(uv.y, uv.x));
    float am = abs(a - 0.5) / 4.0;
    float l = length(uv);

    float m1 = clamp(0.1 / smoothstep(0.0, 1.75, l), 0.0, 1.0);
    float m2 = clamp(0.1 / smoothstep(0.42, 0.0, l), 0.0, 1.0);
    float s1 = (simplex_noise(vec3(uv * 2.0, 1.0 + t * 0.525)) * (max(1.0 - l * 1.75, 0.0)) + 0.9);
    float s2 = (simplex_noise(vec3(uv * 1.0, 15.0 + t * 0.525)) * (max(0.0 + l * 1.0, 0.025)) + 1.25);
    float s3 = (simplex_noise(vec3(vec2(am, am * 100.0 + t * 3.0) * 0.15, 30.0 + t * 0.525))
        * (max(0.0 + l * 1.0, 0.25)) + 1.5);
    s3 *= smoothstep(0.0, 0.3345, l);

    float sh = smoothstep(0.15, 0.35, l);

    float m = m1 * m1 * m2 * ((s1 * s2 * s3) * (1.0 - l)) * sh;

    vec3 col = mix(BLACK_COL, (0.5 + 0.5 * cos(t + uv.xyx * 3.0 + vec3(0.0, 2.0, 4.0))), m);

    col *= mix(1.0, smoothstep(0.0, uIntroFadeDuration, t - abs(q.y)), uIntroFade);

    return vec4(col, 1.0);
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
    fragCoord.y = uOutputFrame.w - fragCoord.y;
    vec3 resolution = vec3(uOutputFrame.z, uOutputFrame.w, 1.0);
    finalColor = mainImage(fragColor, fragCoord, resolution);
}
