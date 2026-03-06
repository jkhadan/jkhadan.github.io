import { Container, Geometry, Shader, Mesh, Texture, Buffer, GlProgram } from 'pixi.js';

const SHARK_WIDTH = 96;
const SHARK_HEIGHT = 48;

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
varying float vState;

const float BASE_SIZE = 56.0;

void main() {
    float x = aInstanceTransform.x;
    float y = aInstanceTransform.y;
    float scale = aInstanceTransform.z;
    float rotation = aInstanceTransform.w;
    float phase = aInstanceData.y;
    float state = aInstanceData.z;

    vec2 localPos = aPosition;

    // ABZU-style spine undulation
    // Body position: 0 = head (right), 1 = tail (left)
    float bodyPos = 0.5 - localPos.x / 2.0;  // Normalize to 0-1 (0 at head, 1 at tail)
    float swimMask = smoothstep(0.2, 1.0, bodyPos);  // Protect head from bending

    // Speed multiplier based on state (lunging = faster animation)
    float speedMult = state == 5.0 ? 2.0 : 1.0;  // 5 = LUNGING state

    // Yaw (side-to-side) - increases toward tail
    float yaw = sin(uTime * 4.0 * speedMult + phase + bodyPos * 5.0) * swimMask * 0.12;

    // Apply undulation
    localPos.y += yaw;

    // Subtle roll component
    float roll = sin(uTime * 2.0 + phase + bodyPos * 3.0) * swimMask * 0.03;
    localPos.y += roll * localPos.y;

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
    vState = state;
}
`;

const fragmentSrc = `
precision highp float;

varying vec2 vUV;
varying float vState;

uniform sampler2D uTexture;

void main() {
    vec4 texColor = texture2D(uTexture, vUV);

    if (texColor.a < 0.01) discard;

    // Slight red tint when lunging (aggressive)
    vec3 color = texColor.rgb;
    if (vState == 5.0) {
        color.r *= 1.15;
    }

    gl_FragColor = vec4(color, texColor.a);
}
`;

export class SharkRenderer extends Container {
    private mesh: Mesh<Geometry, Shader>;
    private instanceBuffer: Buffer;
    private instanceData: Float32Array;
    private sharkCount: number;
    private time: number = 0;

    constructor(count: number) {
        super();
        this.sharkCount = count;

        const texture = this.createSharkTexture();
        this.instanceData = new Float32Array(count * INSTANCE_STRIDE);
        this.instanceBuffer = new Buffer({ data: this.instanceData, usage: 1 });

        const geometry = this.createGeometry(count);
        const shader = this.createShader(texture);

        this.mesh = new Mesh({ geometry, shader });
        this.addChild(this.mesh);
    }

    private createSharkTexture(): Texture {
        const canvas = document.createElement('canvas');
        canvas.width = SHARK_WIDTH;
        canvas.height = SHARK_HEIGHT;
        const ctx = canvas.getContext('2d')!;

        const cy = SHARK_HEIGHT / 2;

        // Body gradient (darker top, lighter belly)
        const bodyGrad = ctx.createLinearGradient(0, 0, 0, SHARK_HEIGHT);
        bodyGrad.addColorStop(0, 'rgba(100, 100, 110, 0.95)');
        bodyGrad.addColorStop(0.5, 'rgba(140, 140, 150, 0.95)');
        bodyGrad.addColorStop(1, 'rgba(200, 200, 210, 0.95)');

        // Main body (torpedo shape)
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.moveTo(SHARK_WIDTH - 4, cy);           // Snout
        ctx.lineTo(SHARK_WIDTH * 0.7, cy - 14);    // Upper head
        ctx.lineTo(SHARK_WIDTH * 0.5, cy - 12);    // Upper mid
        ctx.lineTo(SHARK_WIDTH * 0.2, cy - 8);     // Upper rear
        ctx.lineTo(8, cy);                          // Tail base
        ctx.lineTo(SHARK_WIDTH * 0.2, cy + 8);     // Lower rear
        ctx.lineTo(SHARK_WIDTH * 0.5, cy + 12);    // Lower mid
        ctx.lineTo(SHARK_WIDTH * 0.7, cy + 14);    // Lower head
        ctx.closePath();
        ctx.fill();

        // Dorsal fin (tall triangle)
        ctx.fillStyle = 'rgba(80, 80, 90, 0.9)';
        ctx.beginPath();
        ctx.moveTo(SHARK_WIDTH * 0.55, cy - 12);
        ctx.lineTo(SHARK_WIDTH * 0.45, cy - 24);
        ctx.lineTo(SHARK_WIDTH * 0.35, cy - 10);
        ctx.closePath();
        ctx.fill();

        // Pectoral fins
        ctx.beginPath();
        ctx.moveTo(SHARK_WIDTH * 0.6, cy + 10);
        ctx.lineTo(SHARK_WIDTH * 0.5, cy + 20);
        ctx.lineTo(SHARK_WIDTH * 0.4, cy + 8);
        ctx.closePath();
        ctx.fill();

        // Tail fin (forked)
        ctx.fillStyle = 'rgba(90, 90, 100, 0.85)';
        ctx.beginPath();
        ctx.moveTo(12, cy - 6);
        ctx.lineTo(0, cy - 18);
        ctx.lineTo(6, cy);
        ctx.lineTo(0, cy + 18);
        ctx.lineTo(12, cy + 6);
        ctx.closePath();
        ctx.fill();

        // Eye
        ctx.fillStyle = 'rgba(20, 20, 20, 0.9)';
        ctx.beginPath();
        ctx.arc(SHARK_WIDTH - 18, cy - 4, 3, 0, Math.PI * 2);
        ctx.fill();

        // Gills (3 slits)
        ctx.strokeStyle = 'rgba(60, 60, 70, 0.6)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            const gx = SHARK_WIDTH * 0.65 - i * 5;
            ctx.beginPath();
            ctx.moveTo(gx, cy - 6);
            ctx.lineTo(gx - 2, cy + 2);
            ctx.stroke();
        }

        return Texture.from(canvas);
    }

    private createGeometry(instanceCount: number): Geometry {
        const aspectRatio = SHARK_WIDTH / SHARK_HEIGHT;
        const vertices = new Float32Array([
            -0.5 * aspectRatio, -0.5, 0, 1,
             0.5 * aspectRatio, -0.5, 1, 1,
             0.5 * aspectRatio,  0.5, 1, 0,
            -0.5 * aspectRatio, -0.5, 0, 1,
             0.5 * aspectRatio,  0.5, 1, 0,
            -0.5 * aspectRatio,  0.5, 0, 0,
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

        for (let i = 0; i < this.sharkCount; i++) {
            const srcOffset = (startIndex + i) * WORKER_STRIDE;
            const dstOffset = i * INSTANCE_STRIDE;

            this.instanceData[dstOffset + 0] = workerBuffer[srcOffset + 0]; // x
            this.instanceData[dstOffset + 1] = workerBuffer[srcOffset + 1]; // y
            this.instanceData[dstOffset + 2] = workerBuffer[srcOffset + 7]; // scale
            this.instanceData[dstOffset + 3] = workerBuffer[srcOffset + 4]; // rotation

            this.instanceData[dstOffset + 4] = workerBuffer[srcOffset + 6]; // hue
            this.instanceData[dstOffset + 5] = workerBuffer[srcOffset + 5]; // animationPhase
            this.instanceData[dstOffset + 6] = workerBuffer[srcOffset + 9]; // behaviorState
            this.instanceData[dstOffset + 7] = workerBuffer[srcOffset + 10]; // stateTimer

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
