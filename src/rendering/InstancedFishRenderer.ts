import { Container, Geometry, Shader, Mesh, Texture, Buffer, GlProgram } from 'pixi.js';
import fishVertSource from './shaders/fish.vert?raw';
import fishFragSource from './shaders/fish.frag?raw';

const CELL_WIDTH = 64;
const CELL_HEIGHT = 32;

// Instance buffer stride: 8 floats per fish
// aInstanceTransform (vec4): x, y, scale, rotation
// aInstanceData (vec4): hue, phase, fishType, reserved
const INSTANCE_STRIDE = 8;

// Worker buffer stride: 7 floats per fish
const WORKER_STRIDE = 7;

export class InstancedFishRenderer extends Container {
    private mesh: Mesh<Geometry, Shader>;
    private instanceBuffer: Buffer;
    private instanceData: Float32Array;
    private fishCount: number;

    constructor(count: number) {
        super();
        this.fishCount = count;

        // Create texture atlas (same as sprite-based renderer)
        const atlasTexture = this.createFishAtlas();

        // Create instance data buffer
        this.instanceData = new Float32Array(count * INSTANCE_STRIDE);
        this.instanceBuffer = new Buffer({
            data: this.instanceData,
            usage: 1, // GPUBufferUsage.VERTEX
        });

        // Create geometry with quad vertices and instance attributes
        const geometry = this.createGeometry(count);

        // Create shader
        const shader = this.createShader(atlasTexture);

        // Create mesh
        this.mesh = new Mesh({ geometry, shader });
        this.addChild(this.mesh);
    }

    private createGeometry(instanceCount: number): Geometry {
        // Quad vertices using 2 triangles (6 vertices, no index buffer needed)
        // Fish faces right, centered at origin (-0.5 to 0.5)
        // Position (x, y), UV (u, v)
        const vertices = new Float32Array([
            // Triangle 1: bottom-left, bottom-right, top-right
            -0.5, -0.5, 0, 1, // bottom-left (tail-bottom)
             0.5, -0.5, 1, 1, // bottom-right (head-bottom)
             0.5,  0.5, 1, 0, // top-right (head-top)
            // Triangle 2: bottom-left, top-right, top-left
            -0.5, -0.5, 0, 1, // bottom-left (tail-bottom)
             0.5,  0.5, 1, 0, // top-right (head-top)
            -0.5,  0.5, 0, 0, // top-left (tail-top)
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
                    stride: 4 * 4, // 4 floats * 4 bytes
                    offset: 0,
                },
                aUV: {
                    buffer: vertexBuffer,
                    format: 'float32x2',
                    stride: 4 * 4,
                    offset: 2 * 4, // Skip position
                },
                aInstanceTransform: {
                    buffer: this.instanceBuffer,
                    format: 'float32x4',
                    stride: INSTANCE_STRIDE * 4,
                    offset: 0,
                    instance: true,
                },
                aInstanceData: {
                    buffer: this.instanceBuffer,
                    format: 'float32x4',
                    stride: INSTANCE_STRIDE * 4,
                    offset: 4 * 4, // Skip first vec4
                    instance: true,
                },
            },
            instanceCount,
        });
    }

    private createShader(texture: Texture): Shader {
        const glProgram = GlProgram.from({
            vertex: fishVertSource,
            fragment: fishFragSource,
        });

        return new Shader({
            glProgram,
            resources: {
                uTexture: texture.source,
            },
        });
    }

    private createFishAtlas(): Texture {
        const canvas = document.createElement('canvas');
        canvas.width = CELL_WIDTH * 2;  // 128px wide (2 columns)
        canvas.height = CELL_HEIGHT * 2; // 64px tall (2 rows)
        const ctx = canvas.getContext('2d')!;

        // Draw each fish type in its cell
        this.drawDartFish(ctx, 0, 0);
        this.drawTropicalFish(ctx, CELL_WIDTH, 0);
        this.drawSchoolingFish(ctx, 0, CELL_HEIGHT);
        this.drawAngelFish(ctx, CELL_WIDTH, CELL_HEIGHT);

        return Texture.from(canvas);
    }

    // Type 0: Dart Fish - sleek elongated arrow
    private drawDartFish(ctx: CanvasRenderingContext2D, ox: number, oy: number) {
        const cy = oy + CELL_HEIGHT / 2;

        ctx.fillStyle = this.createAngularGradient(ctx, ox, oy);
        ctx.beginPath();
        ctx.moveTo(ox + CELL_WIDTH - 4, cy);
        ctx.lineTo(ox + CELL_WIDTH * 0.6, cy - 8);
        ctx.lineTo(ox + CELL_WIDTH * 0.3, cy - 6);
        ctx.lineTo(ox + 8, cy - 4);
        ctx.lineTo(ox + 2, cy);
        ctx.lineTo(ox + 8, cy + 4);
        ctx.lineTo(ox + CELL_WIDTH * 0.3, cy + 6);
        ctx.lineTo(ox + CELL_WIDTH * 0.6, cy + 8);
        ctx.closePath();
        ctx.fill();

        // Tail fin - two triangles
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.moveTo(ox + 8, cy - 4);
        ctx.lineTo(ox, cy - 10);
        ctx.lineTo(ox + 2, cy);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(ox + 8, cy + 4);
        ctx.lineTo(ox, cy + 10);
        ctx.lineTo(ox + 2, cy);
        ctx.closePath();
        ctx.fill();

        this.drawPolygonEye(ctx, ox + CELL_WIDTH - 14, cy - 2, 2.5);
    }

    // Type 1: Tropical Fish - angular with prominent fins
    private drawTropicalFish(ctx: CanvasRenderingContext2D, ox: number, oy: number) {
        const cy = oy + CELL_HEIGHT / 2;

        ctx.fillStyle = this.createAngularGradient(ctx, ox, oy);
        ctx.beginPath();
        ctx.moveTo(ox + CELL_WIDTH - 8, cy);
        ctx.lineTo(ox + CELL_WIDTH * 0.65, cy - 10);
        ctx.lineTo(ox + CELL_WIDTH * 0.35, cy - 8);
        ctx.lineTo(ox + 12, cy);
        ctx.lineTo(ox + CELL_WIDTH * 0.35, cy + 8);
        ctx.lineTo(ox + CELL_WIDTH * 0.65, cy + 10);
        ctx.closePath();
        ctx.fill();

        // Dorsal fin
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.beginPath();
        ctx.moveTo(ox + CELL_WIDTH * 0.5, cy - 8);
        ctx.lineTo(ox + CELL_WIDTH * 0.35, cy - CELL_HEIGHT / 2 + 2);
        ctx.lineTo(ox + CELL_WIDTH * 0.3, cy - 6);
        ctx.closePath();
        ctx.fill();

        // Ventral fin
        ctx.beginPath();
        ctx.moveTo(ox + CELL_WIDTH * 0.5, cy + 8);
        ctx.lineTo(ox + CELL_WIDTH * 0.4, cy + CELL_HEIGHT / 2 - 2);
        ctx.lineTo(ox + CELL_WIDTH * 0.3, cy + 6);
        ctx.closePath();
        ctx.fill();

        // Tail
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.moveTo(ox + 12, cy);
        ctx.lineTo(ox + 2, cy - 8);
        ctx.lineTo(ox + 6, cy);
        ctx.lineTo(ox + 2, cy + 8);
        ctx.closePath();
        ctx.fill();

        this.drawPolygonEye(ctx, ox + CELL_WIDTH - 16, cy - 2, 2.5);
    }

    // Type 2: Schooling Fish - small compact hexagon
    private drawSchoolingFish(ctx: CanvasRenderingContext2D, ox: number, oy: number) {
        const cy = oy + CELL_HEIGHT / 2;

        ctx.fillStyle = this.createAngularGradient(ctx, ox, oy);
        ctx.beginPath();
        ctx.moveTo(ox + CELL_WIDTH - 12, cy);
        ctx.lineTo(ox + CELL_WIDTH * 0.6, cy - 7);
        ctx.lineTo(ox + CELL_WIDTH * 0.35, cy - 6);
        ctx.lineTo(ox + 14, cy);
        ctx.lineTo(ox + CELL_WIDTH * 0.35, cy + 6);
        ctx.lineTo(ox + CELL_WIDTH * 0.6, cy + 7);
        ctx.closePath();
        ctx.fill();

        // Small forked tail
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.beginPath();
        ctx.moveTo(ox + 14, cy - 2);
        ctx.lineTo(ox + 4, cy - 6);
        ctx.lineTo(ox + 8, cy);
        ctx.lineTo(ox + 4, cy + 6);
        ctx.lineTo(ox + 14, cy + 2);
        ctx.closePath();
        ctx.fill();

        this.drawPolygonEye(ctx, ox + CELL_WIDTH - 18, cy - 1, 2);
    }

    // Type 3: Angel Fish - tall diamond with large fins
    private drawAngelFish(ctx: CanvasRenderingContext2D, ox: number, oy: number) {
        const cy = oy + CELL_HEIGHT / 2;

        ctx.fillStyle = this.createAngularGradient(ctx, ox, oy);
        ctx.beginPath();
        ctx.moveTo(ox + CELL_WIDTH - 10, cy);
        ctx.lineTo(ox + CELL_WIDTH * 0.55, cy - 10);
        ctx.lineTo(ox + CELL_WIDTH * 0.4, cy - 8);
        ctx.lineTo(ox + 16, cy);
        ctx.lineTo(ox + CELL_WIDTH * 0.4, cy + 8);
        ctx.lineTo(ox + CELL_WIDTH * 0.55, cy + 10);
        ctx.closePath();
        ctx.fill();

        // Large dorsal fin
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.moveTo(ox + CELL_WIDTH * 0.55, cy - 10);
        ctx.lineTo(ox + CELL_WIDTH * 0.5, cy - CELL_HEIGHT / 2 + 1);
        ctx.lineTo(ox + CELL_WIDTH * 0.35, cy - 7);
        ctx.closePath();
        ctx.fill();

        // Large ventral fin
        ctx.beginPath();
        ctx.moveTo(ox + CELL_WIDTH * 0.55, cy + 10);
        ctx.lineTo(ox + CELL_WIDTH * 0.45, cy + CELL_HEIGHT / 2 - 1);
        ctx.lineTo(ox + CELL_WIDTH * 0.35, cy + 7);
        ctx.closePath();
        ctx.fill();

        // Tail
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.beginPath();
        ctx.moveTo(ox + 16, cy);
        ctx.lineTo(ox + 4, cy - 10);
        ctx.lineTo(ox + 10, cy);
        ctx.lineTo(ox + 4, cy + 10);
        ctx.closePath();
        ctx.fill();

        this.drawPolygonEye(ctx, ox + CELL_WIDTH - 18, cy - 2, 2.5);
    }

    private createAngularGradient(ctx: CanvasRenderingContext2D, ox: number, _oy: number): CanvasGradient {
        const grd = ctx.createLinearGradient(ox, 0, ox + CELL_WIDTH, 0);
        grd.addColorStop(0, 'rgba(255,255,255,0.45)');
        grd.addColorStop(0.25, 'rgba(255,255,255,0.75)');
        grd.addColorStop(0.5, 'rgba(255,255,255,0.95)');
        grd.addColorStop(0.75, 'rgba(255,255,255,0.85)');
        grd.addColorStop(1, 'rgba(255,255,255,0.6)');
        return grd;
    }

    private drawPolygonEye(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
        // Dark hexagonal eye
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
            const px = x + Math.cos(angle) * r;
            const py = y + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();

        // Highlight - small triangle
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.beginPath();
        ctx.moveTo(x - r * 0.3, y - r * 0.5);
        ctx.lineTo(x + r * 0.2, y - r * 0.3);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.fill();
    }

    update(workerBuffer: Float32Array): void {
        // Copy worker data (stride=7) to instance buffer (stride=8)
        for (let i = 0; i < this.fishCount; i++) {
            const srcOffset = i * WORKER_STRIDE;
            const dstOffset = i * INSTANCE_STRIDE;

            // aInstanceTransform: x, y, scale, rotation
            this.instanceData[dstOffset + 0] = workerBuffer[srcOffset + 0]; // x
            this.instanceData[dstOffset + 1] = workerBuffer[srcOffset + 1]; // y
            this.instanceData[dstOffset + 2] = workerBuffer[srcOffset + 2]; // scale
            this.instanceData[dstOffset + 3] = workerBuffer[srcOffset + 3]; // rotation

            // aInstanceData: hue, phase, fishType, reserved
            this.instanceData[dstOffset + 4] = workerBuffer[srcOffset + 4]; // hue
            this.instanceData[dstOffset + 5] = workerBuffer[srcOffset + 5]; // animationPhase
            this.instanceData[dstOffset + 6] = workerBuffer[srcOffset + 6]; // fishType
            this.instanceData[dstOffset + 7] = 0; // reserved
        }

        // Upload updated instance data to GPU
        this.instanceBuffer.update();
    }

    override destroy(): void {
        this.mesh.destroy();
        super.destroy();
    }
}
