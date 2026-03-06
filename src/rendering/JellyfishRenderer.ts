import { Container, Geometry, Shader, Mesh, Texture, Buffer, GlProgram } from 'pixi.js';

const JELLYFISH_SIZE = 64;

// Instance buffer stride: 10 floats per jellyfish
// aInstanceTransform (vec4): x, y, scale, rotation
// aInstanceData (vec4): hue, phase, state, stateTimer
// aInstanceExtra (vec2): reserved1, reserved2
const INSTANCE_STRIDE = 10;

// Worker buffer stride for creatures
const WORKER_STRIDE = 12;

const vertexSrc = `
precision highp float;

attribute vec2 aPosition;
attribute vec2 aUV;
attribute vec4 aInstanceTransform; // x, y, scale, rotation
attribute vec4 aInstanceData;      // hue, phase, state, stateTimer
attribute vec2 aInstanceExtra;     // reserved

uniform mat3 uProjectionMatrix;
uniform mat3 uWorldTransformMatrix;
uniform float uTime;

varying vec2 vUV;
varying float vHue;
varying float vPhase;
varying float vBellPulse;

const float BASE_SIZE = 48.0;

void main() {
    float x = aInstanceTransform.x;
    float y = aInstanceTransform.y;
    float scale = aInstanceTransform.z;
    float rotation = aInstanceTransform.w;
    float phase = aInstanceData.y;

    // Bell pulsing animation
    float bellPulse = sin(uTime * 3.0 + phase) * 0.15;
    vBellPulse = bellPulse;

    // Apply bell contraction to upper portion
    vec2 localPos = aPosition;
    float bellY = clamp((localPos.y + 0.5) * 2.0 - 0.4, 0.0, 1.0);
    localPos.x *= 1.0 + bellPulse * bellY;

    // Tentacle wave (lower portion)
    float tentacleY = max(0.0, -localPos.y - 0.1);
    float wave = sin(uTime * 4.0 + phase + tentacleY * 6.0) * 0.08;
    localPos.x += wave * tentacleY;

    // Gentle vertical drift
    float drift = sin(uTime * 0.5 + phase) * 2.0;

    // Apply rotation
    float cr = cos(rotation);
    float sr = sin(rotation);
    vec2 rotated = vec2(
        localPos.x * cr - localPos.y * sr,
        localPos.x * sr + localPos.y * cr
    );

    // Final position
    float finalScale = BASE_SIZE * scale;
    vec2 worldPos = rotated * finalScale + vec2(x, y + drift);

    vec3 projected = uProjectionMatrix * uWorldTransformMatrix * vec3(worldPos, 1.0);
    gl_Position = vec4(projected.xy, 0.0, 1.0);

    vUV = aUV;
    vHue = aInstanceData.x;
    vPhase = phase;
}
`;

const fragmentSrc = `
precision highp float;

varying vec2 vUV;
varying float vHue;
varying float vPhase;
varying float vBellPulse;

uniform sampler2D uTexture;
uniform float uTime;

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec4 texColor = texture2D(uTexture, vUV);

    if (texColor.a < 0.01) discard;

    // Vivid pink or bioluminescent green coloring - use direct RGB for reliability
    // vHue < 0.5 = pink, vHue >= 0.5 = green
    float isPink = step(vHue, 0.5);

    // Pink: RGB(255, 105, 180) hot pink -> normalized (1.0, 0.41, 0.71)
    // Green: RGB(80, 255, 150) bioluminescent green -> normalized (0.31, 1.0, 0.59)
    vec3 pinkColor = vec3(1.0, 0.4, 0.7);
    vec3 greenColor = vec3(0.3, 1.0, 0.6);
    vec3 baseColor = mix(greenColor, pinkColor, isPink);

    // Subtle pulsing glow
    float glow = 0.9 + 0.1 * sin(uTime * 2.0 + vPhase);

    // Add slight brightness variation from bell pulse
    float brightness = 1.0 + vBellPulse * 0.1;

    gl_FragColor = vec4(baseColor * glow * brightness, texColor.a * 0.85);
}
`;

export class JellyfishRenderer extends Container {
    private mesh: Mesh<Geometry, Shader>;
    private instanceBuffer: Buffer;
    private instanceData: Float32Array;
    private jellyfishCount: number;
    private time: number = 0;

    constructor(count: number) {
        super();
        this.jellyfishCount = count;

        const texture = this.createJellyfishTexture();
        this.instanceData = new Float32Array(count * INSTANCE_STRIDE);
        this.instanceBuffer = new Buffer({
            data: this.instanceData,
            usage: 1,
        });

        const geometry = this.createGeometry(count);
        const shader = this.createShader(texture);

        this.mesh = new Mesh({ geometry, shader });
        this.mesh.blendMode = 'normal'; // Normal blending to show true colors
        this.addChild(this.mesh);
    }

    private createJellyfishTexture(): Texture {
        const canvas = document.createElement('canvas');
        canvas.width = JELLYFISH_SIZE;
        canvas.height = JELLYFISH_SIZE;
        const ctx = canvas.getContext('2d')!;

        const cx = JELLYFISH_SIZE / 2;
        const bellTop = 6;      // Top of dome
        const bellBottom = 28;  // Bottom of dome where tentacles attach
        const bellWidth = 22;
        const bellHeight = bellBottom - bellTop;

        // Draw bell (dome shape - convex upward like a mushroom cap)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();

        // Start at bottom-left of bell
        ctx.moveTo(cx - bellWidth, bellBottom);

        // Draw left edge going up
        ctx.quadraticCurveTo(cx - bellWidth - 2, bellTop + bellHeight * 0.5, cx - bellWidth * 0.6, bellTop + 4);

        // Draw the top dome curve (convex upward)
        ctx.quadraticCurveTo(cx, bellTop - 2, cx + bellWidth * 0.6, bellTop + 4);

        // Draw right edge going down
        ctx.quadraticCurveTo(cx + bellWidth + 2, bellTop + bellHeight * 0.5, cx + bellWidth, bellBottom);

        // Close bottom
        ctx.lineTo(cx - bellWidth, bellBottom);
        ctx.closePath();
        ctx.fill();

        // Inner bell membrane
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.moveTo(cx - bellWidth * 0.7, bellBottom - 2);
        ctx.quadraticCurveTo(cx, bellTop + 8, cx + bellWidth * 0.7, bellBottom - 2);
        ctx.lineTo(cx - bellWidth * 0.7, bellBottom - 2);
        ctx.closePath();
        ctx.fill();

        // Bell highlight (top-left)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.ellipse(cx - 8, bellTop + 8, 6, 4, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Draw tentacles (6 tapered strips)
        const tentacleCount = 6;
        const tentacleLength = 28;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';

        for (let i = 0; i < tentacleCount; i++) {
            const baseX = cx - bellWidth * 0.65 + (i / (tentacleCount - 1)) * bellWidth * 1.3;
            ctx.lineWidth = 2.5 - (i % 2) * 0.5;
            ctx.beginPath();
            ctx.moveTo(baseX, bellBottom);
            // Wavy tentacle shape
            const segs = 5;
            for (let j = 1; j <= segs; j++) {
                const t = j / segs;
                const waveOffset = Math.sin(i * 1.2 + j * 0.9) * 5;
                ctx.lineTo(baseX + waveOffset, bellBottom + tentacleLength * t);
            }
            ctx.stroke();
        }

        // Central organ pattern
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.beginPath();
        ctx.arc(cx, bellBottom - 6, 5, 0, Math.PI * 2);
        ctx.fill();

        return Texture.from(canvas);
    }

    private createGeometry(instanceCount: number): Geometry {
        // Quad vertices: position (x,y), UV (u,v)
        const vertices = new Float32Array([
            -0.5, -0.5, 0, 1,
             0.5, -0.5, 1, 1,
             0.5,  0.5, 1, 0,
            -0.5, -0.5, 0, 1,
             0.5,  0.5, 1, 0,
            -0.5,  0.5, 0, 0,
        ]);

        const vertexBuffer = new Buffer({ data: vertices, usage: 1 });

        return new Geometry({
            attributes: {
                aPosition: { buffer: vertexBuffer, format: 'float32x2', stride: 16, offset: 0 },
                aUV: { buffer: vertexBuffer, format: 'float32x2', stride: 16, offset: 8 },
                aInstanceTransform: { buffer: this.instanceBuffer, format: 'float32x4', stride: INSTANCE_STRIDE * 4, offset: 0, instance: true },
                aInstanceData: { buffer: this.instanceBuffer, format: 'float32x4', stride: INSTANCE_STRIDE * 4, offset: 16, instance: true },
                aInstanceExtra: { buffer: this.instanceBuffer, format: 'float32x2', stride: INSTANCE_STRIDE * 4, offset: 32, instance: true },
            },
            instanceCount,
        });
    }

    private createShader(texture: Texture): Shader {
        const glProgram = GlProgram.from({ vertex: vertexSrc, fragment: fragmentSrc });

        return new Shader({
            glProgram,
            resources: {
                uTexture: texture.source,
                uniforms: {
                    uTime: { value: 0, type: 'f32' },
                },
            },
        });
    }

    update(workerBuffer: Float32Array, startIndex: number, deltaTime: number): void {
        this.time += deltaTime * 0.016; // Convert to seconds approximately

        // Copy creature data from worker buffer
        for (let i = 0; i < this.jellyfishCount; i++) {
            const srcOffset = (startIndex + i) * WORKER_STRIDE;
            const dstOffset = i * INSTANCE_STRIDE;

            // aInstanceTransform: x, y, scale, rotation
            this.instanceData[dstOffset + 0] = workerBuffer[srcOffset + 0]; // x
            this.instanceData[dstOffset + 1] = workerBuffer[srcOffset + 1]; // y
            this.instanceData[dstOffset + 2] = workerBuffer[srcOffset + 7]; // scale
            this.instanceData[dstOffset + 3] = workerBuffer[srcOffset + 4]; // rotation

            // aInstanceData: hue, phase, state, stateTimer
            this.instanceData[dstOffset + 4] = workerBuffer[srcOffset + 6]; // hue
            this.instanceData[dstOffset + 5] = workerBuffer[srcOffset + 5]; // animationPhase
            this.instanceData[dstOffset + 6] = workerBuffer[srcOffset + 9]; // behaviorState
            this.instanceData[dstOffset + 7] = workerBuffer[srcOffset + 10]; // stateTimer

            // aInstanceExtra: reserved
            this.instanceData[dstOffset + 8] = 0;
            this.instanceData[dstOffset + 9] = 0;
        }

        this.instanceBuffer.update();

        // Update time uniform
        const shader = this.mesh.shader;
        if (shader?.resources?.uniforms) {
            (shader.resources.uniforms as { uniforms: { uTime: number } }).uniforms.uTime = this.time;
        }
    }

    override destroy(): void {
        this.mesh.destroy();
        super.destroy();
    }
}
