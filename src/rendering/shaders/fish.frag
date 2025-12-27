precision highp float;

varying vec2 vUV;
varying float vHue;
varying float vFishType;

uniform sampler2D uTexture;

// Type-specific hue biases (matching COLOR_CONFIG from FishRenderer.ts)
// DART (0): Teals/cyans - base: 0.55, range: 0.1
// TROPICAL (1): Warm corals/oranges - base: 0.08, range: 0.08
// SCHOOLING (2): Sage greens - base: 0.35, range: 0.1
// ANGEL (3): Slate blues - base: 0.6, range: 0.15
const vec4 TYPE_HUE_BASE = vec4(0.55, 0.08, 0.35, 0.6);
const vec4 TYPE_HUE_RANGE = vec4(0.1, 0.08, 0.1, 0.15);

// Muted color palette ranges
const float SAT_MIN = 0.3;
const float SAT_MAX = 0.45;
const float VAL_MIN = 0.7;
const float VAL_MAX = 0.85;

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec4 texColor = texture2D(uTexture, vUV);

    // Discard fully transparent pixels for proper alpha handling
    if (texColor.a < 0.01) {
        discard;
    }

    // Get type-specific hue bias based on fishType (0-3)
    int typeIndex = int(vFishType);
    float hueBase, hueRange;

    if (typeIndex == 0) {
        hueBase = TYPE_HUE_BASE.x;
        hueRange = TYPE_HUE_RANGE.x;
    } else if (typeIndex == 1) {
        hueBase = TYPE_HUE_BASE.y;
        hueRange = TYPE_HUE_RANGE.y;
    } else if (typeIndex == 2) {
        hueBase = TYPE_HUE_BASE.z;
        hueRange = TYPE_HUE_RANGE.z;
    } else {
        hueBase = TYPE_HUE_BASE.w;
        hueRange = TYPE_HUE_RANGE.w;
    }

    // Calculate biased hue: blend base hue with type-specific variation
    // Formula matches: (bias.base + (baseHue - 0.5) * bias.range + 1) % 1
    float biasedHue = mod(hueBase + (vHue - 0.5) * hueRange + 1.0, 1.0);

    // Calculate muted saturation and value (matching JavaScript implementation)
    // sat = min + (hue * 0.5) * (max - min)
    // val = min + ((1 - hue) * 0.7) * (max - min)
    float sat = SAT_MIN + (vHue * 0.5) * (SAT_MAX - SAT_MIN);
    float val = VAL_MIN + ((1.0 - vHue) * 0.7) * (VAL_MAX - VAL_MIN);

    // Convert to RGB tint
    vec3 tint = hsv2rgb(vec3(biasedHue, sat, val));

    // Apply tint to texture (texture is white/grayscale with gradient)
    gl_FragColor = vec4(texColor.rgb * tint, texColor.a);
}
