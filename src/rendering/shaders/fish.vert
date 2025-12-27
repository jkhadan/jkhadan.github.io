precision highp float;

attribute vec2 aPosition;
attribute vec2 aUV;

// Instanced attributes
attribute vec4 aInstanceTransform; // x, y, scale, rotation
attribute vec4 aInstanceData;      // hue, phase, fishType, reserved

uniform mat3 uProjectionMatrix;
uniform mat3 uWorldTransformMatrix;

// Texture atlas constants: 2x2 grid of 64x32 cells in 128x64 atlas
const vec2 CELL_SIZE = vec2(64.0, 32.0);
const vec2 ATLAS_SIZE = vec2(128.0, 64.0);
const vec2 UV_SCALE = CELL_SIZE / ATLAS_SIZE; // vec2(0.5, 0.5)

// Base size in pixels - matches sprite scale of 0.6 * 64 width
const float BASE_SIZE = 38.4;

varying vec2 vUV;
varying float vHue;
varying float vFishType;

void main() {
    // Unpack instance transform
    float x = aInstanceTransform.x;
    float y = aInstanceTransform.y;
    float instanceScale = aInstanceTransform.z;
    float rotation = aInstanceTransform.w;

    // Unpack instance data
    float hue = aInstanceData.x;
    float phase = aInstanceData.y;
    float fishType = aInstanceData.z;

    // Breathing animation - subtle 5% scale pulse using phase
    float breathe = 1.0 + sin(phase * 2.0) * 0.05;

    // Combined scale: base pixel size * instance variation * breathing
    float scale = BASE_SIZE * instanceScale * breathe;

    // Local vertex position (quad centered at origin, -0.5 to 0.5)
    float localX = aPosition.x;
    float localY = aPosition.y;

    // Tail wobble animation - amplitude increases toward tail (left side, x < 0)
    // aPosition.x ranges from -0.5 (tail) to +0.5 (head)
    float tailFactor = max(0.0, -localX + 0.2);
    float wobble = sin(phase * 2.0 + localX * 6.0) * 0.08 * tailFactor;
    localY += wobble;

    // Apply rotation
    float cr = cos(rotation);
    float sr = sin(rotation);
    float rx = localX * cr - localY * sr;
    float ry = localX * sr + localY * cr;

    // Apply scale and translation to get world position
    vec2 worldPos = vec2(rx * scale + x, ry * scale + y);

    // Project to clip space using PixiJS projection matrix
    vec3 projected = uProjectionMatrix * uWorldTransformMatrix * vec3(worldPos, 1.0);
    gl_Position = vec4(projected.xy, 0.0, 1.0);

    // Calculate UV offset for texture atlas (2x2 grid)
    // fishType: 0=top-left, 1=top-right, 2=bottom-left, 3=bottom-right
    float col = mod(fishType, 2.0);
    float row = floor(fishType / 2.0);
    vec2 uvOffset = vec2(col, row) * UV_SCALE;

    // Transform base UV (0-1) to atlas cell UV
    vUV = uvOffset + aUV * UV_SCALE;
    vHue = hue;
    vFishType = fishType;
}
