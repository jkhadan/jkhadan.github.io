import { Container, Geometry, Shader, Mesh, Texture, Buffer, GlProgram } from 'pixi.js';
import bubbleVertSource from './shaders/bubble.vert?raw';
import bubbleFragSource from './shaders/bubble.frag?raw';

interface BubbleState {
    x: number;
    y: number;
    speed: number;
    wobblePhase: number;
    size: number;
    alpha: number;
}

// Instance buffer stride: 4 floats per bubble
// aInstanceData (vec4): x, y, scale, alpha
const INSTANCE_STRIDE = 4;

export class InstancedBubbles extends Container {
    private mesh: Mesh<Geometry, Shader>;
    private instanceBuffer: Buffer;
    private instanceData: Float32Array;
    private bubbles: BubbleState[] = [];
    private bubbleCount: number;
    private viewportWidth: number;
    private viewportHeight: number;
    private time = 0;

    constructor(width: number, height: number, count: number) {
        super();
        this.viewportWidth = width;
        this.viewportHeight = height;
        this.bubbleCount = count;

        // Create bubble texture
        const texture = this.createBubbleTexture();

        // Create instance data buffer
        this.instanceData = new Float32Array(count * INSTANCE_STRIDE);
        this.instanceBuffer = new Buffer({
            data: this.instanceData,
            usage: 1, // GPUBufferUsage.VERTEX
        });

        // Initialize bubble states
        for (let i = 0; i < count; i++) {
            this.bubbles.push(this.createBubbleState(true));
        }

        // Create geometry with quad vertices and instance attributes
        const geometry = this.createGeometry(count);

        // Create shader
        const shader = this.createShader(texture);

        // Create mesh with additive blending
        this.mesh = new Mesh({ geometry, shader });
        this.mesh.blendMode = 'add';
        this.addChild(this.mesh);

        // Initial update to populate instance buffer
        this.updateInstanceBuffer();
    }

    private createBubbleState(randomY: boolean): BubbleState {
        return {
            x: Math.random() * this.viewportWidth,
            y: randomY ? Math.random() * this.viewportHeight : this.viewportHeight + 50,
            speed: 0.5 + Math.random() * 1.5,
            wobblePhase: Math.random() * Math.PI * 2,
            size: 0.5 + Math.random() * 1.5,
            alpha: 0.3 + Math.random() * 0.4,
        };
    }

    private createGeometry(instanceCount: number): Geometry {
        // Quad vertices using 2 triangles (6 vertices, no index buffer needed)
        // Position (x, y), UV (u, v)
        const vertices = new Float32Array([
            // Triangle 1: bottom-left, bottom-right, top-right
            // UVs rotated 180 degrees (1,0 -> 0,1 etc.)
            -0.5, -0.5, 1, 0,
             0.5, -0.5, 0, 0,
             0.5,  0.5, 0, 1,
            // Triangle 2: bottom-left, top-right, top-left
            -0.5, -0.5, 1, 0,
             0.5,  0.5, 0, 1,
            -0.5,  0.5, 1, 1,
        ]);

        const vertexBuffer = new Buffer({
            data: vertices,
            usage: 1,
        });

        return new Geometry({
            attributes: {
                aPosition: {
                    buffer: vertexBuffer,
                    format: 'float32x2',
                    stride: 4 * 4,
                    offset: 0,
                },
                aUV: {
                    buffer: vertexBuffer,
                    format: 'float32x2',
                    stride: 4 * 4,
                    offset: 2 * 4,
                },
                aInstanceData: {
                    buffer: this.instanceBuffer,
                    format: 'float32x4',
                    stride: INSTANCE_STRIDE * 4,
                    offset: 0,
                    instance: true,
                },
            },
            instanceCount,
        });
    }

    private createShader(texture: Texture): Shader {
        const glProgram = GlProgram.from({
            vertex: bubbleVertSource,
            fragment: bubbleFragSource,
        });

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

    private createBubbleTexture(): Texture {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d')!;

        // Radial gradient for bubble body
        const grad = ctx.createRadialGradient(16, 16, 2, 16, 16, 14);
        grad.addColorStop(0, 'rgba(255,255,255,0.1)');
        grad.addColorStop(0.8, 'rgba(255,255,255,0.4)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);

        // Bubble edge ring
        ctx.beginPath();
        ctx.arc(16, 16, 12, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.beginPath();
        ctx.arc(10, 10, 3, 0, Math.PI * 2);
        ctx.fill();

        return Texture.from(canvas);
    }

    private updateInstanceBuffer(): void {
        for (let i = 0; i < this.bubbleCount; i++) {
            const b = this.bubbles[i];
            const offset = i * INSTANCE_STRIDE;

            // Calculate wobble offset for x position
            const wobbleX = Math.sin(b.wobblePhase) * 20;

            this.instanceData[offset + 0] = b.x + wobbleX; // x (with wobble)
            this.instanceData[offset + 1] = b.y;          // y
            this.instanceData[offset + 2] = b.size;       // scale
            this.instanceData[offset + 3] = b.alpha;      // alpha
        }

        this.instanceBuffer.update();
    }

    resize(width: number, height: number): void {
        this.viewportWidth = width;
        this.viewportHeight = height;
    }

    update(delta: number): void {
        this.time += delta;

        // Update bubble physics
        for (let i = 0; i < this.bubbleCount; i++) {
            const b = this.bubbles[i];

            // Move upward
            b.y -= b.speed * delta;

            // Update wobble phase
            b.wobblePhase += 0.05 * delta;

            // Reset if off screen
            if (b.y < -50) {
                b.y = this.viewportHeight + 50;
                b.x = Math.random() * this.viewportWidth;
            }
        }

        // Update instance buffer with new positions
        this.updateInstanceBuffer();

        // Update time uniform for shader (optional since shader might be null during destroy)
        const shader = this.mesh.shader;
        if (shader?.resources?.uniforms) {
            const uniforms = shader.resources.uniforms as { uniforms: { uTime: number } };
            if (uniforms?.uniforms) {
                uniforms.uniforms.uTime = this.time;
            }
        }
    }

    override destroy(): void {
        this.mesh.destroy();
        super.destroy();
    }
}
