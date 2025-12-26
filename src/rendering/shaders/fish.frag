precision mediump float;

varying vec2 vUV;
varying float vHue;

uniform sampler2D uSampler;

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec4 color = texture2D(uSampler, vUV);
    
    // Apply hue shift
    // Input texture should be white/grey scale to take color well, or we shift existing hue
    // Simpler: Just tint it.
    
    vec3 tint = hsv2rgb(vec3(vHue, 0.8, 1.0));
    
    // Preservation of alpha
    gl_FragColor = vec4(color.rgb * tint, color.a);
}
