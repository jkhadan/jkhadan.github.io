precision highp float;

varying vec2 vUV;
varying float vAlpha;

uniform sampler2D uTexture;

void main() {
    vec4 texColor = texture2D(uTexture, vUV);

    // Apply per-instance alpha (0.3-0.7 range from bubble state)
    gl_FragColor = vec4(texColor.rgb, texColor.a * vAlpha);
}
