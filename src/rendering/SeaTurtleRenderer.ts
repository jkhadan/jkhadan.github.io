import { Container, Geometry, Shader, Mesh, Texture, Buffer, GlProgram } from 'pixi.js';

const TURTLE_SIZE = 64;

const INSTANCE_STRIDE = 10;
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

const float BASE_SIZE = 52.0;

void main() {
    float x = aInstanceTransform.x;
    float y = aInstanceTransform.y;
    float scale = aInstanceTransform.z;
    float rotation = aInstanceTransform.w;
    float phase = aInstanceData.y;

    vec2 localPos = aPosition;

    // Swimming wave animation - travels from tail (left, -x) to head (right, +x)
    float swimPhase = uTime * 2.0 + phase;

    // localPos.x ranges from -0.5 (tail) to 0.5 (head)
    // Wave propagates from tail to head with slight delay based on x position
    float waveProgress = localPos.x + 0.5; // 0 at tail, 1 at head
    float wavePhase = swimPhase - waveProgress * 1.5; // Delay wave toward head

    // Side-to-side undulation that diminishes toward head
    float waveAmplitude = 0.05 * (1.0 - waveProgress * 0.7); // Stronger at tail
    localPos.y += sin(wavePhase) * waveAmplitude;

    // Subtle vertical bobbing
    float bob = sin(swimPhase * 0.5) * 0.015;
    localPos.y += bob;

    // Apply rotation
    float cr = cos(rotation);
    float sr = sin(rotation);
    vec2 rotated = vec2(
        localPos.x * cr - localPos.y * sr,
        localPos.x * sr + localPos.y * cr
    );

    float finalScale = BASE_SIZE * scale;
    vec2 worldPos = rotated * finalScale + vec2(x, y);

    vec3 projected = uProjectionMatrix * uWorldTransformMatrix * vec3(worldPos, 1.0);
    gl_Position = vec4(projected.xy, 0.0, 1.0);

    vUV = aUV;
    vHue = aInstanceData.x;
}
`;

const fragmentSrc = `
precision highp float;

varying vec2 vUV;
varying float vHue;

uniform sampler2D uTexture;

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec4 texColor = texture2D(uTexture, vUV);

    if (texColor.a < 0.01) discard;

    // Brown-green shell tinting
    float hue = mod(vHue * 0.15 + 0.25, 1.0); // Green-brown range
    float sat = 0.35;
    float val = 0.75;
    vec3 tint = hsv2rgb(vec3(hue, sat, val));

    gl_FragColor = vec4(texColor.rgb * tint, texColor.a);
}
`;

export class SeaTurtleRenderer extends Container {
    private mesh: Mesh<Geometry, Shader>;
    private instanceBuffer: Buffer;
    private instanceData: Float32Array;
    private turtleCount: number;
    private time: number = 0;

    constructor(count: number) {
        super();
        this.turtleCount = count;

        const texture = this.createTurtleTexture();
        this.instanceData = new Float32Array(count * INSTANCE_STRIDE);
        this.instanceBuffer = new Buffer({ data: this.instanceData, usage: 1 });

        const geometry = this.createGeometry(count);
        const shader = this.createShader(texture);

        this.mesh = new Mesh({ geometry, shader });
        this.addChild(this.mesh);
    }

    private createTurtleTexture(): Texture {
        const canvas = document.createElement('canvas');
        canvas.width = TURTLE_SIZE;
        canvas.height = TURTLE_SIZE;
        const ctx = canvas.getContext('2d')!;

        const cx = TURTLE_SIZE / 2;
        const cy = TURTLE_SIZE / 2;

        // Shell (angular oval with hexagonal pattern)
        const shellGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 24);
        shellGrad.addColorStop(0, 'rgba(180, 160, 120, 0.95)');
        shellGrad.addColorStop(0.5, 'rgba(140, 120, 80, 0.95)');
        shellGrad.addColorStop(1, 'rgba(100, 90, 60, 0.9)');

        ctx.fillStyle = shellGrad;
        ctx.beginPath();
        // Oval shell shape
        const shellW = 22;
        const shellH = 18;
        ctx.ellipse(cx, cy, shellW, shellH, 0, 0, Math.PI * 2);
        ctx.fill();

        // Shell pattern (hexagonal scales)
        ctx.strokeStyle = 'rgba(80, 70, 50, 0.4)';
        ctx.lineWidth = 1;
        // Central pentagon
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
            const px = cx + Math.cos(angle) * 8;
            const py = cy + Math.sin(angle) * 6;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        // Outer shell segments
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const innerR = 8;
            const outerR = 18;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR * 0.75);
            ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR * 0.82);
            ctx.stroke();
        }

        // Head (triangular with beak)
        const headGrad = ctx.createLinearGradient(cx + 20, cy - 5, cx + 32, cy + 5);
        headGrad.addColorStop(0, 'rgba(120, 140, 100, 0.9)');
        headGrad.addColorStop(1, 'rgba(100, 120, 80, 0.85)');

        ctx.fillStyle = headGrad;
        ctx.beginPath();
        ctx.moveTo(cx + 22, cy);
        ctx.lineTo(cx + 30, cy - 4);
        ctx.lineTo(cx + 32, cy);
        ctx.lineTo(cx + 30, cy + 4);
        ctx.closePath();
        ctx.fill();

        // Eye (positioned on the upper part of the head)
        ctx.fillStyle = 'rgba(20, 20, 20, 0.95)';
        ctx.beginPath();
        ctx.arc(cx + 25, cy - 1.5, 1.5, 0, Math.PI * 2);
        ctx.fill();
        // Eye highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(cx + 24.5, cy - 2, 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Front flippers
        ctx.fillStyle = 'rgba(110, 130, 90, 0.85)';
        // Right front flipper
        ctx.beginPath();
        ctx.moveTo(cx + 12, cy - 14);
        ctx.lineTo(cx + 24, cy - 22);
        ctx.lineTo(cx + 20, cy - 10);
        ctx.closePath();
        ctx.fill();

        // Left front flipper
        ctx.beginPath();
        ctx.moveTo(cx + 12, cy + 14);
        ctx.lineTo(cx + 24, cy + 22);
        ctx.lineTo(cx + 20, cy + 10);
        ctx.closePath();
        ctx.fill();

        // Back flippers (smaller)
        ctx.fillStyle = 'rgba(100, 120, 80, 0.8)';
        // Right back flipper
        ctx.beginPath();
        ctx.moveTo(cx - 16, cy - 10);
        ctx.lineTo(cx - 24, cy - 16);
        ctx.lineTo(cx - 20, cy - 6);
        ctx.closePath();
        ctx.fill();

        // Left back flipper
        ctx.beginPath();
        ctx.moveTo(cx - 16, cy + 10);
        ctx.lineTo(cx - 24, cy + 16);
        ctx.lineTo(cx - 20, cy + 6);
        ctx.closePath();
        ctx.fill();

        // Small tail
        ctx.fillStyle = 'rgba(100, 120, 80, 0.7)';
        ctx.beginPath();
        ctx.moveTo(cx - 20, cy);
        ctx.lineTo(cx - 28, cy - 2);
        ctx.lineTo(cx - 28, cy + 2);
        ctx.closePath();
        ctx.fill();

        return Texture.from(canvas);
    }

    private createGeometry(instanceCount: number): Geometry {
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
                uniforms: { uTime: { value: 0, type: 'f32' } },
            },
        });
    }

    update(workerBuffer: Float32Array, startIndex: number, deltaTime: number): void {
        this.time += deltaTime * 0.016;

        for (let i = 0; i < this.turtleCount; i++) {
            const srcOffset = (startIndex + i) * WORKER_STRIDE;
            const dstOffset = i * INSTANCE_STRIDE;

            this.instanceData[dstOffset + 0] = workerBuffer[srcOffset + 0];
            this.instanceData[dstOffset + 1] = workerBuffer[srcOffset + 1];
            this.instanceData[dstOffset + 2] = workerBuffer[srcOffset + 7];
            this.instanceData[dstOffset + 3] = workerBuffer[srcOffset + 4];

            this.instanceData[dstOffset + 4] = workerBuffer[srcOffset + 6];
            this.instanceData[dstOffset + 5] = workerBuffer[srcOffset + 5];
            this.instanceData[dstOffset + 6] = workerBuffer[srcOffset + 9];
            this.instanceData[dstOffset + 7] = workerBuffer[srcOffset + 10];

            this.instanceData[dstOffset + 8] = 0;
            this.instanceData[dstOffset + 9] = 0;
        }

        this.instanceBuffer.update();

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
