#version 300 es
precision highp float;

// Ocean under — adapted from Shadertoy (iChannel0 → procedural noise)
// uLowQuality: 0 = full (default), 1 = mobile/min preset (fewer steps/octaves)

uniform float uTime;
uniform float uIntroFade;
uniform float uIntroFadeDuration;
uniform float uLowQuality;
float t;

float wavedx(vec2 position, vec2 direction, float time, float freq) {
    float x = dot(direction, position) * freq + time;
    return exp(sin(x) - 1.0);
}

float getwaves(vec2 position) {
    float iter = 0.0, phase = 6.0, speed = 2.0;
    float weight = 1.0, w = 0.0, ws = 0.0;
    // high: 5 octaves, low: 4
    const int WAVE_MAX = 5;
    int waveLimit = uLowQuality > 0.5 ? 4 : 5;
    for (int i = 0; i < WAVE_MAX; i++) {
        if (i >= waveLimit) break;
        vec2 p = vec2(sin(iter), cos(iter));
        float res = wavedx(position, p, speed * t, phase);
        w += res * weight;
        ws += weight;
        iter += 12.0;
        weight *= 0.75;
        phase *= 1.18;
        speed *= 1.08;
    }
    return w / ws;
}

float sea_octave(vec2 uv, float choppy) {
    return getwaves(uv * choppy) + getwaves(uv);
}

float noise3D(vec3 p) {
    vec3 s = vec3(7.0, 157.0, 113.0);
    vec3 ip = floor(p);
    vec4 h = vec4(0.0, s.yz, s.y + s.z) + dot(ip, s);
    p -= ip;
    p = p * p * (3.0 - 2.0 * p);
    h = mix(fract(sin(h) * 43758.5453), fract(sin(h + s.x) * 43758.5453), p.x);
    h.xy = mix(h.xz, h.yw, p.y);
    return mix(h.x, h.y, p.z);
}

vec3 channelNoise(vec2 uv) {
    return vec3(
        noise3D(vec3(uv, 0.0)),
        noise3D(vec3(uv, 1.37)),
        noise3D(vec3(uv, 2.71))
    );
}

float smaxP(float a, float b, float s) {
    float h = clamp(0.5 + 0.5 * (a - b) / s, 0.0, 1.0);
    return mix(b, a, h) + h * (1.0 - h) * s;
}

const vec3 Freq = vec3(0.125, 0.31, 0.128);
const vec3 Amp = vec3(1.0, 1.5, 2.5);

vec2 path(float z) {
    return vec2(
        Amp.x * sin(z * Freq.x),
        Amp.y * cos(z * Freq.y) + Amp.z * (sin(z * Freq.z) - 1.0)
    );
}

float map(vec3 p) {
    float tx = noise3D(p);
    vec3 q = p * 0.35;
    float h = dot(sin(q) * cos(q.yzx), vec3(0.222))
        + dot(sin(q * 1.5) * cos(q.yzx * 1.5), vec3(0.111));
    float d = p.y + h * 3.9;
    p.xy -= path(p.z);
    float tnl = 1.5 - length(p.xy * vec2(0.33, 0.66)) + (0.25 - tx * 0.35);
    return smaxP(d, tnl, 2.0) - tx * 0.25 + tnl * 0.8;
}

// high: 36 / 35, low: 24 / 32
const int STEP_MAX = 36;

float sceneFar() {
    return uLowQuality > 0.5 ? 32.0 : 35.0;
}

float logBisectTrace(vec3 ro, vec3 rd) {
    float far = sceneFar();
    int stepLimit = uLowQuality > 0.5 ? 24 : 36;
    int bisectLimit = uLowQuality > 0.5 ? 3 : 5;

    float dist = 0.0, told = 0.0, mid, dn;
    float d = map(ro);
    float sgn = sign(d);
    for (int i = 0; i < STEP_MAX; i++) {
        if (i >= stepLimit) break;
        if (sign(d) != sgn || d < 0.001 || dist > far) break;
        told = dist;
        dist += step(d, 1.0) * (log(abs(d) + 1.1) - d) + d;
        d = map(rd * dist + ro);
    }
    if (sign(d) != sgn) {
        dn = sign(map(rd * told + ro));
        vec2 iv = vec2(told, dist);
        for (int ii = 0; ii < 5; ii++) {
            if (ii >= bisectLimit) break;
            mid = dot(iv, vec2(0.5));
            float d2 = map(rd * mid + ro);
            if (abs(d2) < 0.001) break;
            iv = mix(vec2(iv.x, mid), vec2(mid, iv.y), step(0.0, d2 * dn));
        }
        dist = mid;
    }
    return min(dist, far);
}

vec3 normalAt(vec3 p, float eps) {
    vec2 e = vec2(-eps, eps);
    return normalize(
        e.yxx * map(p + e.yxx) +
        e.xxy * map(p + e.xxy) +
        e.xyx * map(p + e.xyx) +
        e.y * map(p + e.y)
    );
}

vec3 rotY(vec3 v, float a) {
    float c = cos(a), s = sin(a);
    return vec3(c * v.x - s * v.z, v.y, s * v.x + c * v.z);
}

vec4 mainImage(vec4 fragColor, vec2 fragCoord, vec3 iResolution) {
    vec2 q = fragCoord / iResolution.xy;
    vec2 uv = q - 0.5;
    uv.x *= iResolution.x / iResolution.y;

    float time = t * 0.2;
    float far = sceneFar();

    vec3 pos = (sin(time * 0.14) * 2.0 + 4.5) * vec3(sin(time * 0.5), 0.0, cos(time * 0.5));
    pos.z -= time;
    pos.y += 0.7 * sin(time * 0.2);
    float rot = -time * 0.5;
    vec3 dir = normalize(vec3(uv, -0.6));
    dir = rotY(dir, rot);

    vec3 sun = vec3(-0.6, 0.5, -0.3);
    float i = max(0.0, 1.2 / (length(sun - dir) + 1.0));
    vec3 col = vec3(pow(i, 1.9), pow(i, 1.0), pow(i, 0.8)) * 1.25;
    col = mix(col, vec3(0.0, 0.39, 0.62), (1.0 - dir.y) * 0.9);

    if (dir.y > 0.0) {
        float d = (pos.y - 3.0) / dir.y;
        vec2 wat = (dir * d).xz - pos.xz;
        d += sin(wat.x + time);
        wat = (dir * d).xz - pos.xz;
        wat = wat * 0.1 + 0.2 * channelNoise(wat * 0.01).xz;
        col += sea_octave(wat, 0.5) * 0.6 * max(2.0 / -d, 0.0);
    } else {
        vec3 ro = pos;
        ro.y += 12.0;

        float hit = logBisectTrace(ro, dir);
        vec3 rock = vec3(0.0);
        if (hit < far) {
            pos = ro + dir * hit;
            hit /= far;
            vec3 sn = normalAt(pos, 0.1 / (1.0 + hit));
            float fre = clamp(1.0 + dot(sun, sn), 0.0, 1.0);
            float Schlick = pow(1.0 - max(dot(dir, normalize(dir + sun)), 0.0), 5.0);
            fre *= mix(0.2, 1.0, Schlick);
            float dif = dot(sn, sun) * 0.2;
            rock = (dif * channelNoise(pos.xz * 0.05) + fre * fre * 0.35) * col;
            float y = smoothstep(0.9, 1.0, (1.0 + dir.y));
            if (y > 0.0) rock = mix(rock, col, y * hit);
            col = mix(rock, col, hit);
        }
        float f = (-dir.y - 0.3 + sin(time * 0.05) * 0.2) * 0.3185;
        f = clamp(f, 0.0, 1.0);
        col = mix(col, rock, f);
    }

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
    fragCoord = uOutputFrame.zw - fragCoord;
    vec3 resolution = vec3(uOutputFrame.z, uOutputFrame.w, 1.0);
    finalColor = mainImage(fragColor, fragCoord, resolution);
}
