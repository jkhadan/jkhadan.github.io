precision highp float;

attribute vec2 aPosition;
attribute vec2 aUV;

// Instanced attributes: x, y, scale, alpha
attribute vec4 aInstanceData;

uniform mat3 uProjectionMatrix;
uniform mat3 uWorldTransformMatrix;
uniform float uTime;

// Base bubble size in pixels (matches 32x32 texture at ~0.5-1.5 scale)
const float BASE_SIZE = 16.0;

varying vec2 vUV;
varying float vAlpha;

void main() {
    // Unpack instance data
    float x = aInstanceData.x;
    float y = aInstanceData.y;
    float scale = aInstanceData.z;
    float alpha = aInstanceData.w;

    // Calculate final size
    float size = BASE_SIZE * scale;

    // Simple quad transform (no rotation needed for bubbles)
    vec2 worldPos = aPosition * size + vec2(x, y);

    // Project to clip space
    vec3 projected = uProjectionMatrix * uWorldTransformMatrix * vec3(worldPos, 1.0);
    gl_Position = vec4(projected.xy, 0.0, 1.0);

    vUV = aUV;
    vAlpha = alpha;
}
