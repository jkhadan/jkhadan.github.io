import * as PIXI from 'pixi.js';

interface FishSprite extends PIXI.Sprite {
    hue: number;
    baseScale: number;
    fishType: number;
}

// Muted color palette configuration
const COLOR_CONFIG = {
    // Per-type hue biases (0-1 range)
    typeHueBias: [
        { base: 0.55, range: 0.1 },  // DART: Teals/cyans
        { base: 0.08, range: 0.08 }, // TROPICAL: Warm corals/oranges
        { base: 0.35, range: 0.1 },  // SCHOOLING: Sage greens
        { base: 0.6, range: 0.15 },  // ANGEL: Slate blues
    ],
    saturation: { min: 0.3, max: 0.45 },
    value: { min: 0.7, max: 0.85 },
};

const CELL_WIDTH = 64;
const CELL_HEIGHT = 32;

export class FishRenderer extends PIXI.Container {
    private fishSprites: FishSprite[] = [];
    private fishCount: number;
    private fishTextures: PIXI.Texture[] = [];

    constructor(count: number) {
        super();
        this.fishCount = count;

        // Create fish texture atlas
        const { frames } = this.createFishAtlas();
        this.fishTextures = frames;

        // Pre-create all fish sprites
        for (let i = 0; i < count; i++) {
            const fishType = Math.floor(Math.random() * 4);
            const sprite = new PIXI.Sprite(this.fishTextures[fishType]) as FishSprite;
            sprite.anchor.set(0.5);
            sprite.hue = Math.random();
            sprite.baseScale = 0.8 + Math.random() * 0.4;
            sprite.fishType = fishType;

            // Apply initial muted tint
            sprite.tint = this.getMutedColor(sprite.hue, fishType);

            // Start with scale of 0 until we get data
            sprite.scale.set(0);

            this.fishSprites.push(sprite);
            this.addChild(sprite);
        }
    }

    private createFishAtlas(): { baseTexture: PIXI.Texture; frames: PIXI.Texture[] } {
        const canvas = document.createElement('canvas');
        canvas.width = CELL_WIDTH * 2;  // 128px wide (2 columns)
        canvas.height = CELL_HEIGHT * 2; // 64px tall (2 rows)
        const ctx = canvas.getContext('2d')!;

        // Draw each fish type in its cell
        this.drawDartFish(ctx, 0, 0);
        this.drawTropicalFish(ctx, CELL_WIDTH, 0);
        this.drawSchoolingFish(ctx, 0, CELL_HEIGHT);
        this.drawAngelFish(ctx, CELL_WIDTH, CELL_HEIGHT);

        const baseTexture = PIXI.Texture.from(canvas);

        // Create frame textures for each fish type
        const frames = [
            new PIXI.Texture({ source: baseTexture.source, frame: new PIXI.Rectangle(0, 0, CELL_WIDTH, CELL_HEIGHT) }),
            new PIXI.Texture({ source: baseTexture.source, frame: new PIXI.Rectangle(CELL_WIDTH, 0, CELL_WIDTH, CELL_HEIGHT) }),
            new PIXI.Texture({ source: baseTexture.source, frame: new PIXI.Rectangle(0, CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT) }),
            new PIXI.Texture({ source: baseTexture.source, frame: new PIXI.Rectangle(CELL_WIDTH, CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT) }),
        ];

        return { baseTexture, frames };
    }

    // Type 0: Dart Fish - sleek elongated arrow
    private drawDartFish(ctx: CanvasRenderingContext2D, ox: number, oy: number) {
        const cy = oy + CELL_HEIGHT / 2;

        ctx.fillStyle = this.createAngularGradient(ctx, ox, oy);
        ctx.beginPath();
        // Elongated arrow pointing right
        ctx.moveTo(ox + CELL_WIDTH - 4, cy);       // Nose
        ctx.lineTo(ox + CELL_WIDTH * 0.6, cy - 8); // Upper forward
        ctx.lineTo(ox + CELL_WIDTH * 0.3, cy - 6); // Upper mid
        ctx.lineTo(ox + 8, cy - 4);                // Upper rear
        ctx.lineTo(ox + 2, cy);                    // Tail notch
        ctx.lineTo(ox + 8, cy + 4);                // Lower rear
        ctx.lineTo(ox + CELL_WIDTH * 0.3, cy + 6); // Lower mid
        ctx.lineTo(ox + CELL_WIDTH * 0.6, cy + 8); // Lower forward
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

        // Eye
        this.drawPolygonEye(ctx, ox + CELL_WIDTH - 14, cy - 2, 2.5);
    }

    // Type 1: Tropical Fish - angular with prominent fins
    private drawTropicalFish(ctx: CanvasRenderingContext2D, ox: number, oy: number) {
        const cy = oy + CELL_HEIGHT / 2;

        ctx.fillStyle = this.createAngularGradient(ctx, ox, oy);
        ctx.beginPath();
        // Angular hexagonal body
        ctx.moveTo(ox + CELL_WIDTH - 8, cy);           // Nose
        ctx.lineTo(ox + CELL_WIDTH * 0.65, cy - 10);   // Upper front
        ctx.lineTo(ox + CELL_WIDTH * 0.35, cy - 8);    // Upper mid
        ctx.lineTo(ox + 12, cy);                       // Tail base
        ctx.lineTo(ox + CELL_WIDTH * 0.35, cy + 8);    // Lower mid
        ctx.lineTo(ox + CELL_WIDTH * 0.65, cy + 10);   // Lower front
        ctx.closePath();
        ctx.fill();

        // Dorsal fin - sharp triangle
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
        // Compact rounded hexagon
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
        // Tall diamond body
        ctx.moveTo(ox + CELL_WIDTH - 10, cy);          // Nose
        ctx.lineTo(ox + CELL_WIDTH * 0.55, cy - 10);   // Upper front
        ctx.lineTo(ox + CELL_WIDTH * 0.4, cy - 8);     // Upper mid
        ctx.lineTo(ox + 16, cy);                       // Tail base
        ctx.lineTo(ox + CELL_WIDTH * 0.4, cy + 8);     // Lower mid
        ctx.lineTo(ox + CELL_WIDTH * 0.55, cy + 10);   // Lower front
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

    // Helper: Angular gradient for low-poly aesthetic
    private createAngularGradient(ctx: CanvasRenderingContext2D, ox: number, _oy: number): CanvasGradient {
        const grd = ctx.createLinearGradient(ox, 0, ox + CELL_WIDTH, 0);
        grd.addColorStop(0, 'rgba(255,255,255,0.45)');
        grd.addColorStop(0.25, 'rgba(255,255,255,0.75)');
        grd.addColorStop(0.5, 'rgba(255,255,255,0.95)');
        grd.addColorStop(0.75, 'rgba(255,255,255,0.85)');
        grd.addColorStop(1, 'rgba(255,255,255,0.6)');
        return grd;
    }

    // Helper: Polygonal eye (hexagon instead of circle)
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

    private getMutedColor(baseHue: number, fishType: number): number {
        const bias = COLOR_CONFIG.typeHueBias[fishType] || COLOR_CONFIG.typeHueBias[0];

        // Blend base hue with type bias
        const biasedHue = (bias.base + (baseHue - 0.5) * bias.range + 1) % 1;

        // Randomize saturation and value within muted range
        const sat = COLOR_CONFIG.saturation.min + (baseHue * 0.5) * (COLOR_CONFIG.saturation.max - COLOR_CONFIG.saturation.min);
        const val = COLOR_CONFIG.value.min + ((1 - baseHue) * 0.7) * (COLOR_CONFIG.value.max - COLOR_CONFIG.value.min);

        return this.hsvToRgb(biasedHue, sat, val);
    }

    private hsvToRgb(h: number, s: number, v: number): number {
        let r: number, g: number, b: number;
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
            default: r = 0; g = 0; b = 0;
        }

        return (Math.round(r * 255) << 16) + (Math.round(g * 255) << 8) + Math.round(b * 255);
    }

    update(data: Float32Array) {
        const STRIDE = 7;

        for (let i = 0; i < this.fishCount; i++) {
            const sprite = this.fishSprites[i];
            if (!sprite) continue;

            const offset = i * STRIDE;
            const x = data[offset + 0];
            const y = data[offset + 1];
            const scale = data[offset + 2];
            const rotation = data[offset + 3];
            const hue = data[offset + 4];
            const phase = data[offset + 5];
            const fishType = data[offset + 6];

            sprite.position.set(x, y);
            sprite.rotation = rotation;

            // Update texture if fish type changed (should only happen once at init)
            if (sprite.fishType !== fishType) {
                sprite.fishType = fishType;
                sprite.texture = this.fishTextures[fishType];
            }

            // Base scale factor to make fish visible (texture is 64x32)
            const baseSize = 0.6;

            // Add subtle "breathing" animation using phase
            const breathe = 1 + Math.sin(phase * 2) * 0.05;
            sprite.scale.set(baseSize * scale * breathe);

            // Update tint if hue changed significantly
            if (Math.abs(sprite.hue - hue) > 0.01) {
                sprite.hue = hue;
                sprite.tint = this.getMutedColor(hue, fishType);
            }
        }
    }
}
