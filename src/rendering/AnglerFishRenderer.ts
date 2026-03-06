import { Container, Geometry, Shader, Mesh, Texture, Buffer, GlProgram } from 'pixi.js';

const ANGLER_WIDTH = 64;
const ANGLER_HEIGHT = 48;

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
varying float vPhase;
varying float vState;
varying float vStateTimer;

const float BASE_SIZE = 50.0;

void main() {
    float x = aInstanceTransform.x;
    float y = aInstanceTransform.y;
    float scale = aInstanceTransform.z;
    float rotation = aInstanceTransform.w;
    float phase = aInstanceData.y;
    float state = aInstanceData.z;
    float stateTimer = aInstanceData.w;

    vec2 localPos = aPosition;

    // Lure sway animation (bottom-front of sprite after V-flip)
    // Lure is at approximately UV (0.85, 0.85) -> position (0.35, -0.35)
    float isLure = step(0.3, localPos.x) * step(localPos.y, -0.25);
    float lureSway = sin(uTime * 3.0 + phase) * 0.08 * isLure;
    localPos.x += lureSway;

    // Jaw animation (upper front of sprite after V-flip)
    // When lunging (state 5), jaw opens wide
    float isJaw = step(0.2, localPos.x) * step(0.1, localPos.y);
    float jawOpen = 0.0;
    if (state == 5.0) {
        // Lunge: snap jaw open then closed
        jawOpen = sin(stateTimer * 10.0) * 0.12;
    } else {
        // Idle: occasional slow jaw movement
        jawOpen = max(0.0, sin(uTime * 0.5 + phase)) * 0.04;
    }
    localPos.y += jawOpen * isJaw;

    // Subtle body sway
    float bodySway = sin(uTime * 1.5 + phase) * 0.02;
    localPos.y += bodySway;

    // Handle facing left: flip sprite horizontally to keep lure on top
    // Facing left when rotation is close to PI or -PI (within ~60 degrees)
    float absRotation = abs(rotation);
    float facingLeft = step(2.1, absRotation); // True when |rotation| > ~120 degrees

    // Flip sprite horizontally when facing left
    localPos.x *= mix(1.0, -1.0, facingLeft);

    // Adjust rotation to remove the 180-degree flip, keeping only the tilt
    float adjustedRotation = rotation - facingLeft * sign(rotation) * 3.14159;

    // Apply adjusted rotation
    float cr = cos(adjustedRotation);
    float sr = sin(adjustedRotation);
    vec2 rotated = vec2(
        localPos.x * cr - localPos.y * sr,
        localPos.x * sr + localPos.y * cr
    );

    float finalScale = BASE_SIZE * scale;
    vec2 worldPos = rotated * finalScale + vec2(x, y);

    vec3 projected = uProjectionMatrix * uWorldTransformMatrix * vec3(worldPos, 1.0);
    gl_Position = vec4(projected.xy, 0.0, 1.0);

    vUV = aUV;
    vPhase = phase;
    vState = state;
    vStateTimer = stateTimer;
}
`;

const fragmentSrc = `
precision highp float;

varying vec2 vUV;
varying float vPhase;
varying float vState;
varying float vStateTimer;

uniform sampler2D uTexture;
uniform float uTime;

void main() {
    vec4 texColor = texture2D(uTexture, vUV);

    if (texColor.a < 0.01) discard;

    vec3 color = texColor.rgb;

    // Lure glow effect
    // Lure position in UV space: approximately (0.86, 0.875) after V-flip
    float lureDist = distance(vUV, vec2(0.86, 0.875));
    float lureGlow = smoothstep(0.12, 0.02, lureDist);
    float glowPulse = 0.6 + 0.4 * sin(uTime * 4.0 + vPhase);

    // Bioluminescent cyan glow
    vec3 glowColor = vec3(0.3, 0.9, 1.0) * lureGlow * glowPulse * 1.5;
    color += glowColor;

    // Darken body for deep sea effect
    float bodyDarken = 1.0 - lureGlow * 0.3;
    color *= bodyDarken;

    // Flash during lunge
    if (vState == 5.0) {
        float flash = sin(vStateTimer * 20.0) * 0.5 + 0.5;
        color += vec3(0.2, 0.1, 0.0) * flash * (1.0 - lureGlow);
    }

    gl_FragColor = vec4(color, texColor.a);
}
`;

export class AnglerFishRenderer extends Container {
    private mesh: Mesh<Geometry, Shader>;
    private instanceBuffer: Buffer;
    private instanceData: Float32Array;
    private anglerCount: number;
    private time: number = 0;

    constructor(count: number) {
        super();
        this.anglerCount = count;

        const texture = this.createAnglerTexture();
        this.instanceData = new Float32Array(count * INSTANCE_STRIDE);
        this.instanceBuffer = new Buffer({ data: this.instanceData, usage: 1 });

        const geometry = this.createGeometry(count);
        const shader = this.createShader(texture);

        this.mesh = new Mesh({ geometry, shader });
        this.addChild(this.mesh);
    }

    private createAnglerTexture(): Texture {
        const canvas = document.createElement('canvas');
        canvas.width = ANGLER_WIDTH;
        canvas.height = ANGLER_HEIGHT;
        const ctx = canvas.getContext('2d')!;

        const cy = ANGLER_HEIGHT / 2;

        // Dark body gradient
        const bodyGrad = ctx.createLinearGradient(0, 0, ANGLER_WIDTH, 0);
        bodyGrad.addColorStop(0, 'rgba(40, 35, 30, 0.95)');
        bodyGrad.addColorStop(0.5, 'rgba(60, 50, 40, 0.95)');
        bodyGrad.addColorStop(1, 'rgba(50, 45, 35, 0.9)');

        // Main body (bulbous with oversized head)
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.moveTo(ANGLER_WIDTH - 8, cy);
        ctx.quadraticCurveTo(ANGLER_WIDTH - 4, cy - 12, ANGLER_WIDTH * 0.6, cy - 14);
        ctx.quadraticCurveTo(ANGLER_WIDTH * 0.3, cy - 10, 12, cy - 4);
        ctx.lineTo(6, cy);
        ctx.lineTo(12, cy + 4);
        ctx.quadraticCurveTo(ANGLER_WIDTH * 0.3, cy + 8, ANGLER_WIDTH * 0.6, cy + 14);
        ctx.quadraticCurveTo(ANGLER_WIDTH - 4, cy + 12, ANGLER_WIDTH - 8, cy);
        ctx.closePath();
        ctx.fill();

        // Large jaw (lower)
        ctx.fillStyle = 'rgba(50, 40, 35, 0.9)';
        ctx.beginPath();
        ctx.moveTo(ANGLER_WIDTH - 10, cy + 4);
        ctx.lineTo(ANGLER_WIDTH - 2, cy + 8);
        ctx.lineTo(ANGLER_WIDTH * 0.7, cy + 16);
        ctx.lineTo(ANGLER_WIDTH * 0.5, cy + 10);
        ctx.closePath();
        ctx.fill();

        // Teeth (triangular)
        ctx.fillStyle = 'rgba(220, 220, 200, 0.9)';
        const teethCount = 6;
        for (let i = 0; i < teethCount; i++) {
            const tx = ANGLER_WIDTH - 6 - i * 6;
            const baseY = cy + 2 + (i * 0.5);
            const toothHeight = 5 - i * 0.3;

            // Upper teeth (pointing down)
            ctx.beginPath();
            ctx.moveTo(tx - 2, baseY - 2);
            ctx.lineTo(tx, baseY + toothHeight);
            ctx.lineTo(tx + 2, baseY - 2);
            ctx.closePath();
            ctx.fill();

            // Lower teeth (pointing up)
            ctx.beginPath();
            ctx.moveTo(tx - 1.5, baseY + 4);
            ctx.lineTo(tx, baseY + 1);
            ctx.lineTo(tx + 1.5, baseY + 4);
            ctx.closePath();
            ctx.fill();
        }

        // Illicium (lure stalk)
        ctx.strokeStyle = 'rgba(80, 70, 60, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ANGLER_WIDTH * 0.65, cy - 14);
        ctx.quadraticCurveTo(ANGLER_WIDTH * 0.75, cy - 24, ANGLER_WIDTH * 0.85, cy - 20);
        ctx.stroke();

        // Esca (lure bulb) - bioluminescent
        const lureX = ANGLER_WIDTH * 0.86;
        const lureY = cy - 18;

        // Outer glow
        const glowGrad = ctx.createRadialGradient(lureX, lureY, 0, lureX, lureY, 10);
        glowGrad.addColorStop(0, 'rgba(100, 220, 255, 0.8)');
        glowGrad.addColorStop(0.5, 'rgba(50, 180, 220, 0.4)');
        glowGrad.addColorStop(1, 'rgba(30, 150, 200, 0.0)');

        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(lureX, lureY, 10, 0, Math.PI * 2);
        ctx.fill();

        // Inner lure
        ctx.fillStyle = 'rgba(180, 240, 255, 0.95)';
        ctx.beginPath();
        ctx.arc(lureX, lureY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Core highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(lureX - 1, lureY - 1, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Eye (small, adapted to darkness)
        ctx.fillStyle = 'rgba(150, 200, 180, 0.8)';
        ctx.beginPath();
        ctx.arc(ANGLER_WIDTH - 14, cy - 4, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(20, 20, 20, 0.9)';
        ctx.beginPath();
        ctx.arc(ANGLER_WIDTH - 13, cy - 4, 2, 0, Math.PI * 2);
        ctx.fill();

        // Small fins
        ctx.fillStyle = 'rgba(45, 40, 35, 0.7)';
        // Dorsal fin
        ctx.beginPath();
        ctx.moveTo(ANGLER_WIDTH * 0.35, cy - 10);
        ctx.lineTo(ANGLER_WIDTH * 0.25, cy - 16);
        ctx.lineTo(ANGLER_WIDTH * 0.2, cy - 8);
        ctx.closePath();
        ctx.fill();

        // Tail fin
        ctx.beginPath();
        ctx.moveTo(10, cy - 4);
        ctx.lineTo(2, cy - 10);
        ctx.lineTo(4, cy);
        ctx.lineTo(2, cy + 10);
        ctx.lineTo(10, cy + 4);
        ctx.closePath();
        ctx.fill();

        return Texture.from(canvas);
    }

    private createGeometry(instanceCount: number): Geometry {
        const aspectRatio = ANGLER_WIDTH / ANGLER_HEIGHT;
        const vertices = new Float32Array([
            -0.5 * aspectRatio, -0.5, 0, 0,
             0.5 * aspectRatio, -0.5, 1, 0,
             0.5 * aspectRatio,  0.5, 1, 1,
            -0.5 * aspectRatio, -0.5, 0, 0,
             0.5 * aspectRatio,  0.5, 1, 1,
            -0.5 * aspectRatio,  0.5, 0, 1,
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

        for (let i = 0; i < this.anglerCount; i++) {
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
