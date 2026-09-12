#version 300 es
precision highp float;

// Galaxy — adapted from Shadertoy (Frank Hugenroth /frankenburgh/ 07/2015)
// Demo fade-out / screen effect removed for continuous game loop.
// uLowQuality: 0 = full, 1 = fewer cloud layers / FBM octaves

uniform float uTime;
uniform float uIntroFade;
uniform float uIntroFadeDuration;
uniform float uLowQuality;
float t;

float hash(float n) {
    return fract(cos(n) * 41415.92653);
}

float noise(in vec2 x) {
    vec2 p = floor(x);
    vec2 f = smoothstep(0.0, 1.0, fract(x));
    float n = p.x + p.y * 57.0;

    return mix(
        mix(hash(n + 0.0), hash(n + 1.0), f.x),
        mix(hash(n + 57.0), hash(n + 58.0), f.x),
        f.y
    );
}

float noise(in vec3 x) {
    vec3 p = floor(x);
    vec3 f = smoothstep(0.0, 1.0, fract(x));
    float n = p.x + p.y * 57.0 + 113.0 * p.z;

    return mix(
        mix(
            mix(hash(n + 0.0), hash(n + 1.0), f.x),
            mix(hash(n + 57.0), hash(n + 58.0), f.x),
            f.y
        ),
        mix(
            mix(hash(n + 113.0), hash(n + 114.0), f.x),
            mix(hash(n + 170.0), hash(n + 171.0), f.x),
            f.y
        ),
        f.z
    );
}

mat3 m = mat3(
    0.00, 1.60, 1.20,
    -1.60, 0.72, -0.96,
    -1.20, -0.96, 1.28
);

// high: 4 octaves, low: 2
float fbmslow(vec3 p) {
    float f = 0.5000 * noise(p);
    p = m * p * 1.2;
    f += 0.2500 * noise(p);
    p = m * p * 1.3;
    if (uLowQuality < 0.5) {
        f += 0.1666 * noise(p);
        p = m * p * 1.4;
        f += 0.0834 * noise(p);
    }
    return f;
}

// high: original 6-octave (last term not in s), low: 3 octaves
float fbm(vec3 p) {
    float f = 0.0, a = 1.0, s = 0.0;
    f += a * noise(p); p = m * p * 1.149; s += a; a *= 0.75;
    f += a * noise(p); p = m * p * 1.41; s += a; a *= 0.75;
    f += a * noise(p); p = m * p * 1.51; s += a; a *= 0.65;
    if (uLowQuality > 0.5) return f / s;
    f += a * noise(p); p = m * p * 1.21; s += a; a *= 0.35;
    f += a * noise(p); p = m * p * 1.41; s += a; a *= 0.75;
    f += a * noise(p);
    return f / s;
}

vec4 mainImage(vec4 fragColor, vec2 fragCoord, vec3 iResolution) {
    vec2 q = fragCoord / iResolution.xy;
    float time = t * 0.1;

    vec2 xy = -1.0 + 2.0 * fragCoord.xy / iResolution.xy;

    // Continuous play: no demo fade-out / delayed glow ramp
    float fade = 1.0;
    float glow = 1.0;

    vec3 campos = vec3(500.0, 850.0, -0.0 - cos((time - 1.4) / 2.0) * 2000.0);
    vec3 camtar = vec3(0.0, 0.0, 0.0);

    float roll = 0.34;
    vec3 cw = normalize(camtar - campos);
    vec3 cp = vec3(sin(roll), cos(roll), 0.0);
    vec3 cu = normalize(cross(cw, cp));
    vec3 cv = normalize(cross(cu, cw));
    vec3 rd = normalize(xy.x * cu + xy.y * cv + 1.6 * cw);

    vec3 light = normalize(vec3(0.0, 0.0, 0.0) - campos);
    float sundot = clamp(dot(light, rd), 0.0, 1.0);

    vec3 col = glow * 1.2 * min(vec3(1.0, 1.0, 1.0), vec3(2.0, 1.0, 0.5) * pow(sundot, 100.0));
    col += 0.3 * vec3(0.8, 0.9, 1.2) * pow(sundot, 8.0);

    vec3 stars = 85.5 * vec3(pow(fbmslow(rd.xyz * 312.0), 7.0)) * vec3(pow(fbmslow(rd.zxy * 440.3), 8.0));

    vec3 cpos = 1500.0 * rd + vec3(831.0 - time * 30.0, 321.0, 1000.0);
    col += vec3(0.4, 0.5, 1.0) * ((fbmslow(cpos * 0.0035) - 0.5));

    cpos += vec3(831.0 - time * 33.0, 321.0, 999.0);
    col += vec3(0.6, 0.3, 0.6) * 10.0 * pow((fbmslow(cpos * 0.0045)), 10.0);

    cpos += vec3(3831.0 - time * 39.0, 221.0, 999.0);
    col += 0.03 * vec3(0.6, 0.0, 0.0) * 10.0 * pow((fbmslow(cpos * 0.0145)), 2.0);

    cpos = 1500.0 * rd + vec3(831.0, 321.0, 999.0);
    col += stars * fbm(cpos * 0.0021);

    vec2 shift = vec2(time * 100.0, time * 180.0);
    vec4 sum = vec4(0.0);
    float c0 = campos.y / rd.y;
    vec3 cpos2 = campos - c0 * rd;
    float radius = length(cpos2.xz) / 1000.0;

    // high: q=10..-9 (20), low: q=10,-2,-… step 2 (~7)
    const int LAYER1_MAX = 20;
    int layer1Limit = uLowQuality > 0.5 ? 7 : 20;
    int layer1Step = uLowQuality > 0.5 ? 2 : 1;

    // high: 20, low: 8
    const int LAYER2_MAX = 20;
    int layer2Limit = uLowQuality > 0.5 ? 8 : 20;

    if (radius < 1.8) {
        for (int qi = 0; qi < LAYER1_MAX; qi++) {
            if (qi >= layer1Limit) break;
            int q = 10 - qi * layer1Step;
            if (sum.w > 0.999) break;

            float c = (float(q) * 8.0 - campos.y) / rd.y;
            vec3 cposL = campos + c * rd;

            float see = dot(normalize(cposL), normalize(campos));
            vec3 lightUnvis = vec3(0.0, 0.0, 0.0);
            vec3 lightVis = vec3(1.3, 1.2, 1.2);
            vec3 shine = mix(lightVis, lightUnvis, smoothstep(0.0, 1.0, see));

            float radiusL = length(cposL.xz) / 999.0;
            if (radiusL > 1.0) continue;

            float rot = 3.00 * (radiusL) - time;
            cposL.xz = cposL.xz * mat2(cos(rot), -sin(rot), sin(rot), cos(rot));

            cposL += vec3(
                831.0 + shift.x,
                321.0 + float(q) * mix(250.0, 50.0, radiusL) - shift.x * 0.2,
                1330.0 + shift.y
            );
            cposL *= mix(0.0025, 0.0028, radiusL);
            float alpha = smoothstep(0.50, 1.0, fbm(cposL));
            alpha *= 1.3 * pow(smoothstep(1.0, 0.0, radiusL), 0.3);
            vec3 dustcolor = mix(vec3(2.0, 1.3, 1.0), vec3(0.1, 0.2, 0.3), pow(radiusL, 0.5));
            vec3 localcolor = mix(dustcolor, shine, alpha);

            float gstar = 2.0 * pow(noise(cposL * 21.40), 22.0);
            float gstar2 = 3.0 * pow(noise(cposL * 26.55), 34.0);
            float gholes = 1.0 * pow(noise(cposL * 11.55), 14.0);
            localcolor += vec3(1.0, 0.6, 0.3) * gstar;
            localcolor += vec3(1.0, 1.0, 0.7) * gstar2;
            localcolor -= gholes;

            alpha = (1.0 - sum.w) * alpha;
            sum += vec4(localcolor * alpha, alpha);
        }

        for (int q = 0; q < LAYER2_MAX; q++) {
            if (q >= layer2Limit) break;
            if (sum.w > 0.999) break;

            float c = (float(q) * 4.0 - campos.y) / rd.y;
            vec3 cposL = campos + c * rd;

            float see = dot(normalize(cposL), normalize(campos));
            vec3 lightUnvis = vec3(0.0, 0.0, 0.0);
            vec3 lightVis = vec3(1.3, 1.2, 1.2);
            vec3 shine = mix(lightVis, lightUnvis, smoothstep(0.0, 1.0, see));

            float radiusL = length(cposL.xz) / 200.0;
            if (radiusL > 1.0) continue;

            float rot = 3.2 * (radiusL) - time * 1.1;
            cposL.xz = cposL.xz * mat2(cos(rot), -sin(rot), sin(rot), cos(rot));

            cposL += vec3(
                831.0 + shift.x,
                321.0 + float(q) * mix(250.0, 50.0, radiusL) - shift.x * 0.2,
                1330.0 + shift.y
            );
            float alpha = 0.1 + smoothstep(0.6, 1.0, fbm(cposL));
            alpha *= 1.2 * (
                pow(smoothstep(1.0, 0.0, radiusL), 0.72)
                - pow(smoothstep(1.0, 0.0, radiusL * 1.875), 0.2)
            );
            vec3 localcolor = vec3(0.0);

            alpha = (1.0 - sum.w) * alpha;
            sum += vec4(localcolor * alpha, alpha);
        }
    }

    float alpha = smoothstep(1.0 - radius * 0.5, 1.0, sum.w);
    sum.rgb /= sum.w + 0.0001;
    sum.rgb -= 0.2 * vec3(0.8, 0.75, 0.7) * pow(sundot, 10.0) * alpha;
    sum.rgb += min(glow, 10.0) * 0.2 * vec3(1.2, 1.2, 1.2) * pow(sundot, 5.0) * (1.0 - alpha);

    col = mix(col, sum.rgb, sum.w);

    col = fade * mix(
        col,
        vec3(0.3, 0.5, 0.9),
        29.0 * (pow(sundot, 50.0) - pow(sundot, 60.0)) / (2.0 + 9.0 * abs(rd.y))
    );

    // Vignetting
    col *= vec3(0.5) + 0.25 * pow(100.0 * q.x * q.y * (1.0 - q.x) * (1.0 - q.y), 0.5);

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
