import { Container, Geometry, Shader, Mesh, Texture, Buffer, GlProgram } from 'pixi.js';

const OCTOPUS_SIZE = 64;

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
varying float vState;

const float BASE_SIZE = 48.0;
const float PI = 3.14159265;

void main() {
    float x = aInstanceTransform.x;
    float y = aInstanceTransform.y;
    float scale = aInstanceTransform.z;
    float rotation = aInstanceTransform.w;
    float phase = aInstanceData.y;
    float state = aInstanceData.z;

    vec2 localPos = aPosition;

    // Determine arm region based on position from center
    // The octopus is drawn with head at center-top, arms radiating downward
    float distFromCenter = length(localPos);
    float angle = atan(localPos.y, localPos.x);

    // Arms are in the lower half (y < 0)
    float isArm = step(0.1, -localPos.y) * step(0.15, distFromCenter);

    // Arm distance (0 at body, 1 at tip)
    float armDist = clamp((distFromCenter - 0.15) / 0.35, 0.0, 1.0);

    // Determine which arm (0-7) based on angular position
    float armIndex = floor(mod((angle + PI) / (PI * 2.0) * 8.0 + 0.5, 8.0));
    float armPhase = armIndex * 0.785; // PI/4 offset per arm

    // Curl animation with phase offset per arm
    float curlFreq = state == 1.0 ? 4.0 : 2.0; // Faster when fleeing
    float curl = sin(uTime * curlFreq + phase + armPhase + armDist * 4.0);
    float curlAmp = armDist * 0.2 * isArm;

    // Apply perpendicular displacement
    float perpAngle = angle + PI * 0.5;
    localPos.x += curl * curlAmp * cos(perpAngle);
    localPos.y += curl * curlAmp * sin(perpAngle);

    // Body pulse (breathing)
    float bodyMask = 1.0 - isArm;
    float breathe = 1.0 + sin(uTime * 2.0 + phase) * 0.05 * bodyMask;
    localPos *= breathe;

    // Jet propulsion effect when fleeing
    if (state == 1.0) {
        float jet = sin(uTime * 8.0 + phase) * 0.03;
        localPos.x += jet;
    }

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
    vState = state;
}
`;

const fragmentSrc = `
precision highp float;

varying vec2 vUV;
varying float vHue;
varying float vState;

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

    // Orange-red to purple range based on hue
    float hue = mod(vHue * 0.2 + 0.05, 1.0);
    float sat = 0.5;
    float val = 0.7;

    // Flash white when fleeing (ink defense implication)
    if (vState == 1.0) {
        float flash = sin(uTime * 12.0) * 0.5 + 0.5;
        sat *= (1.0 - flash * 0.3);
        val += flash * 0.2;
    }

    vec3 tint = hsv2rgb(vec3(hue, sat, val));

    gl_FragColor = vec4(texColor.rgb * tint, texColor.a);
}
`;

export class OctopusRenderer extends Container {
    private mesh: Mesh<Geometry, Shader>;
    private instanceBuffer: Buffer;
    private instanceData: Float32Array;
    private octopusCount: number;
    private time: number = 0;

    constructor(count: number) {
        super();
        this.octopusCount = count;

        const texture = this.createOctopusTexture();
        this.instanceData = new Float32Array(count * INSTANCE_STRIDE);
        this.instanceBuffer = new Buffer({ data: this.instanceData, usage: 1 });

        const geometry = this.createGeometry(count);
        const shader = this.createShader(texture);

        this.mesh = new Mesh({ geometry, shader });
        this.addChild(this.mesh);
    }

    private createOctopusTexture(): Texture {
        const canvas = document.createElement('canvas');
        canvas.width = OCTOPUS_SIZE;
        canvas.height = OCTOPUS_SIZE;
        const ctx = canvas.getContext('2d')!;

        const cx = OCTOPUS_SIZE / 2;
        const cy = OCTOPUS_SIZE / 2 - 4;

        // Body/mantle (bulbous head)
        const bodyGrad = ctx.createRadialGradient(cx, cy - 4, 0, cx, cy, 16);
        bodyGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        bodyGrad.addColorStop(0.7, 'rgba(240, 240, 240, 0.9)');
        bodyGrad.addColorStop(1, 'rgba(200, 200, 200, 0.85)');

        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.ellipse(cx, cy - 4, 14, 16, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eyes (two large angular eyes)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        // Left eye
        ctx.beginPath();
        ctx.ellipse(cx - 6, cy - 2, 5, 6, -0.2, 0, Math.PI * 2);
        ctx.fill();
        // Right eye
        ctx.beginPath();
        ctx.ellipse(cx + 6, cy - 2, 5, 6, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = 'rgba(20, 20, 20, 0.9)';
        ctx.beginPath();
        ctx.ellipse(cx - 5, cy - 2, 2, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + 5, cy - 2, 2, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Arms (8 arms radiating from bottom of body)
        ctx.fillStyle = 'rgba(240, 240, 240, 0.85)';
        ctx.strokeStyle = 'rgba(200, 200, 200, 0.7)';
        ctx.lineWidth = 1;

        const armCount = 8;
        const armLength = 22;
        const armBaseY = cy + 10;

        for (let i = 0; i < armCount; i++) {
            const baseAngle = (i / armCount) * Math.PI - Math.PI / 2 + Math.PI;
            const spreadAngle = baseAngle * 0.7; // Reduce spread

            ctx.beginPath();
            const baseX = cx + Math.cos(spreadAngle) * 8;

            ctx.moveTo(baseX, armBaseY);

            // Draw tapered arm with segments
            const segments = 5;

            for (let j = 1; j <= segments; j++) {
                const t = j / segments;
                const segAngle = spreadAngle + Math.sin(i + j * 0.5) * 0.3;
                const segLen = armLength * t;

                const segX = baseX + Math.sin(segAngle) * segLen * 0.4;
                const segY = armBaseY + segLen;

                ctx.lineTo(segX, segY);
            }

            ctx.lineWidth = 4;
            ctx.strokeStyle = 'rgba(230, 230, 230, 0.8)';
            ctx.stroke();

            // Suction cups (small dots along arm)
            ctx.fillStyle = 'rgba(180, 180, 180, 0.5)';
            for (let j = 1; j < segments; j++) {
                const t = j / segments;
                const segLen = armLength * t;
                const dotX = baseX + Math.sin(spreadAngle) * segLen * 0.4;
                const dotY = armBaseY + segLen;
                const dotSize = 1.5 * (1 - t * 0.5);

                ctx.beginPath();
                ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }

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

        for (let i = 0; i < this.octopusCount; i++) {
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
