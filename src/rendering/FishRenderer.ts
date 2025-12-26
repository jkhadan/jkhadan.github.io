import * as PIXI from 'pixi.js';

interface FishSprite extends PIXI.Sprite {
    hue: number;
    baseScale: number;
}

export class FishRenderer extends PIXI.Container {
    private fishSprites: FishSprite[] = [];
    private fishCount: number;
    private baseTexture: PIXI.Texture;

    constructor(count: number) {
        super();
        this.fishCount = count;

        // Create fish texture
        this.baseTexture = this.createFishTexture();

        // Pre-create all fish sprites
        for (let i = 0; i < count; i++) {
            const sprite = new PIXI.Sprite(this.baseTexture) as FishSprite;
            sprite.anchor.set(0.5);
            sprite.hue = Math.random();
            sprite.baseScale = 0.8 + Math.random() * 0.4;

            // Apply initial random tint based on hue
            sprite.tint = this.hsvToRgb(sprite.hue, 0.7, 1.0);

            // Start with scale of 0 until we get data
            sprite.scale.set(0);

            this.fishSprites.push(sprite);
            this.addChild(sprite);
        }
    }

    private createFishTexture(): PIXI.Texture {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 32;
        const ctx = canvas.getContext('2d')!;

        // Fish body gradient
        const grd = ctx.createLinearGradient(0, 0, 64, 0);
        grd.addColorStop(0, 'rgba(255,255,255,0.3)');
        grd.addColorStop(0.3, 'rgba(255,255,255,0.9)');
        grd.addColorStop(0.6, 'rgba(255,255,255,1)');
        grd.addColorStop(1, 'rgba(255,255,255,0.7)');
        ctx.fillStyle = grd;

        // Fish body shape - pointed head on right, tail on left
        ctx.beginPath();
        ctx.moveTo(64, 16); // Head point
        ctx.quadraticCurveTo(48, 4, 20, 8);  // Top curve
        ctx.lineTo(0, 16);  // Tail point
        ctx.lineTo(20, 24); // Bottom back
        ctx.quadraticCurveTo(48, 28, 64, 16); // Bottom curve back to head
        ctx.closePath();
        ctx.fill();

        // Tail fin
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.beginPath();
        ctx.moveTo(8, 16);
        ctx.lineTo(0, 6);
        ctx.lineTo(0, 26);
        ctx.closePath();
        ctx.fill();

        // Dorsal fin
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.moveTo(30, 8);
        ctx.lineTo(38, 2);
        ctx.lineTo(45, 8);
        ctx.closePath();
        ctx.fill();

        // Eye
        ctx.fillStyle = 'rgba(0,0,0,0.9)';
        ctx.beginPath();
        ctx.arc(54, 14, 3, 0, Math.PI * 2);
        ctx.fill();

        // Eye highlight
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.beginPath();
        ctx.arc(55, 13, 1.5, 0, Math.PI * 2);
        ctx.fill();

        return PIXI.Texture.from(canvas);
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
        const STRIDE = 6;

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

            sprite.position.set(x, y);
            sprite.rotation = rotation;

            // Base scale factor to make fish visible (texture is 64x32)
            const baseSize = 0.6;

            // Add subtle "breathing" animation using phase
            const breathe = 1 + Math.sin(phase * 2) * 0.05;
            sprite.scale.set(baseSize * scale * breathe);

            // Update tint if hue changed significantly
            if (Math.abs(sprite.hue - hue) > 0.01) {
                sprite.hue = hue;
                sprite.tint = this.hsvToRgb(hue, 0.7, 1.0);
            }
        }
    }
}