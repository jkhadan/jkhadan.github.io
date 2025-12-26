precision mediump float;

attribute vec2 aPosition;
attribute vec2 aUV;

// Instanced attributes
attribute vec4 aInstancePosition; // x, y, scale, rotation
attribute vec4 aInstanceData;     // hue, phase, empty, empty

uniform mat3 uProjectionMatrix;
uniform mat3 uWorldTransformMatrix;
uniform mat3 uTransformMatrix;

// Base size in pixels - makes fish visible on screen
const float BASE_SIZE = 40.0;

varying vec2 vUV;
varying float vHue;

void main() {
    float x = aInstancePosition.x;
    float y = aInstancePosition.y;
    float instanceScale = aInstancePosition.z;
    float rotation = aInstancePosition.w;
    
    float hue = aInstanceData.x;
    float phase = aInstanceData.y;

    // Combined scale: base pixel size * instance variation (0.8 - 1.2)
    float scale = BASE_SIZE * instanceScale;

    // Rotate vertex
    float cr = cos(rotation);
    float sr = sin(rotation);
    
    float localX = aPosition.x;
    float localY = aPosition.y;
    
    // Amplitude increases as x decreases (towards tail)
    float tailFactor = max(0.0, 0.5 - localX); 
    
    // Sine wave for swimming animation
    float wobble = sin(phase + localX * 5.0) * 0.1 * tailFactor; 
    localY += wobble;

    // Apply Rotation
    float rx = localX * cr - localY * sr;
    float ry = localX * sr + localY * cr;

    // Apply scale and translation
    vec2 pos = vec2(rx * scale + x, ry * scale + y);

    gl_Position = vec4((uProjectionMatrix * vec3(pos, 1.0)).xy, 0.0, 1.0);
    
    vUV = aUV;
    vHue = hue;
}
