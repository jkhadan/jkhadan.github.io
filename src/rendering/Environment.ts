import * as PIXI from 'pixi.js';

export class Environment extends PIXI.Container {
    private gradient: PIXI.Sprite;
    private caustics: PIXI.TilingSprite;
    private time = 0;

    constructor(width: number, height: number) {
        super();

        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 512;
        const ctx = canvas.getContext('2d')!;
        const grd = ctx.createLinearGradient(0, 0, 0, 512);
        grd.addColorStop(0, '#E0F7FA');
        grd.addColorStop(0.2, '#5BC0BE');
        grd.addColorStop(0.5, '#3A506B');
        grd.addColorStop(0.8, '#1C2541');
        grd.addColorStop(1.0, '#0B132B');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 1, 512);

        const gradTexture = PIXI.Texture.from(canvas);
        this.gradient = new PIXI.Sprite(gradTexture);
        this.gradient.width = width;
        this.gradient.height = height;
        this.addChild(this.gradient);

        const cauCanvas = document.createElement('canvas');
        cauCanvas.width = 256;
        cauCanvas.height = 256;
        const cCtx = cauCanvas.getContext('2d')!;
        cCtx.fillStyle = '#000';
        cCtx.fillRect(0, 0, 256, 256);
        cCtx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 30; i++) {
            cCtx.beginPath();
            cCtx.arc(Math.random() * 256, Math.random() * 256, Math.random() * 50 + 20, 0, Math.PI * 2);
            cCtx.strokeStyle = 'rgba(255,255,255,0.05)';
            cCtx.stroke();
        }

        const cauTexture = PIXI.Texture.from(cauCanvas);
        this.caustics = new PIXI.TilingSprite({ texture: cauTexture, width, height });
        this.caustics.blendMode = 'add';
        this.caustics.alpha = 0.3;
        this.addChild(this.caustics);
    }

    resize(width: number, height: number) {
        this.gradient.width = width;
        this.gradient.height = height;
        this.caustics.width = width;
        this.caustics.height = height;
    }

    update(delta: number) {
        this.time += delta;
        this.caustics.tilePosition.x += 0.5 * delta;
        this.caustics.tilePosition.y += 0.2 * delta;
    }
}
