#version 300 es

//Force high precision to fix the rand and hash functions on some devices
#ifdef GL_ES
precision highp float;
precision highp int;
#endif

lowp vec4 vColor;

//Replacement for gl_fragcolor in es 3.0
out vec4 fragColor;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_grain_strength;

highp float rand(vec2 co, float seed)
{
    highp float a = 12.9898 * seed;
    highp float b = 78.233 * seed;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14*seed);
    return fract(sin(sn) * c);
}

float hash(uint n){
    n = (n << 13U) ^ n;
    n = n * (n * n * 15731U + 789221U) + 1376312589U;
    return float( n & uint(0x7fffffffU))/float(0x7fffffff);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st, in float seed) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = rand(i, seed);
    float b = rand(i + vec2(1.0, 0.0), seed);
    float c = rand(i + vec2(0.0, 1.0), seed);
    float d = rand(i + vec2(1.0, 1.0), seed);

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 6
float fbm (in vec2 st, in float seed) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st, seed);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}

float fbm2 ( in vec2 _st, in float seed) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < OCTAVES; ++i) {
        v += a * noise(_st, seed);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

float pattern1( in vec2 p, in float seed){
    vec2 q = vec2 ( fbm2(p + vec2(0.0,0.0), seed),
                    fbm2(p + vec2(5.2, 1.3), seed));
    vec2 r = vec2( fbm2( p + 4.0*q + vec2(1.7,9.2)+ 0.1*u_time, seed),
                   fbm2( p + 4.0*q + vec2(8.3,2.8)+ 0.1*u_time, seed));
    return fbm2(p+4.0*r, seed);
}

float pattern( in vec2 p, in float seed){
    vec2 q = vec2 ( fbm2(p + vec2(0.0), seed),
                    fbm2(p + vec2(1.0), seed));
    vec2 r = vec2( fbm2( p + 1.0*q + vec2(1.7,9.2)+ 0.15*u_time, seed),
                   fbm2( p + 1.0*q + vec2(8.3,2.8)+ 0.126*u_time, seed));
    return fbm2(p+4.0*r, seed);
}

void main() {

    mat4 colorTransform = mat4(1.0);
    //r
    colorTransform[0][0] = 1.0;
    //g
    colorTransform[1][1] = 0.0;
    //b
    colorTransform[2][2] = 0.8;
    //a
    colorTransform[3][3] = 1.0;
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    float seed = fract(0.5);
    float speed = 0.2;
    float speed1 = 0.4;
    float speed2 = 0.5;
    float speed3 = 0.1;
    float sf = 2.0;
    vec4 color = vec4(0.0);

    //Alternative Patterns, these are too intensive for most devices

    //color += pattern(st*sf + u_time*speed, seed);
    //color.r += pattern(st*sf + u_time*speed, seed);
    //color.g += pattern(st*sf + u_time*speed, seed+0.1);
    //color.b += pattern(st*sf + u_time*speed, seed+0.2);
    //color.a += pattern(st*sf + u_time*speed, seed+0.3);

    //float f = pattern(st*sf + u_time*speed, seed);
    //color += f*f*f+0.6*f*f+0.4*f;

    //float r = pattern(st*sf + u_time*speed, seed);
    //color.r = r*r*r+0.6*r*r+0.4*r;
    //float b = pattern(st*sf + u_time*speed, seed+0.1);
    //color.b = b*b*b+0.6*b*b+0.4*b;
    //float g = pattern(st*sf + u_time*speed, seed+0.2);
    //color.g = g*g*g+0.6*g*g+0.4*g;
    //float a = pattern(st*sf + u_time*speed, seed+0.3);
    //color.a = a*a*a+0.6*a*a+0.4*a;

    color.r += fbm2(st*sf + u_time*speed, seed);
    //color.g += fbm2(st*sf + u_time*speed1, seed+0.1); //* 0.2;
    color.b += fbm2(st*sf + u_time*speed2, seed+0.2); //* 0.8;
    color.a += fbm2(st*sf + u_time*speed3, seed+0.3)*0.5 + 0.1;

    color = colorTransform*color;

    float grain = hash(uint(gl_FragCoord.x+gl_FragCoord.y*gl_FragCoord.x+u_time*40.0));
    fragColor = color + color*grain*u_grain_strength;
}