import * as PIXI from 'pixi.js';

interface Bubble {
    sprite: PIXI.Sprite;
    x: number;
    y: number;
    speed: number;
    wobble: number;
    size: number;
}

export class Bubbles extends PIXI.Container {
    private bubbles: Bubble[] = [];
    private viewportWidth: number;
    private viewportHeight: number;
    private texture: PIXI.Texture;

    constructor(width: number, height: number, count: number) {
        super();
        this.viewportWidth = width;
        this.viewportHeight = height;

        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d')!;
        const grad = ctx.createRadialGradient(16, 16, 2, 16, 16, 14);
        grad.addColorStop(0, 'rgba(255,255,255,0.1)');
        grad.addColorStop(0.8, 'rgba(255,255,255,0.4)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);
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

        this.texture = PIXI.Texture.from(canvas);

        for (let i = 0; i < count; i++) {
            this.spawn(true);
        }
    }

    private spawn(randomY = false) {
        const sprite = new PIXI.Sprite(this.texture);
        sprite.anchor.set(0.5);
        sprite.blendMode = 'add';

        const size = 0.5 + Math.random() * 1.5;
        sprite.scale.set(size * 0.5);

        const b: Bubble = {
            sprite,
            x: Math.random() * this.viewportWidth,
            y: randomY ? Math.random() * this.viewportHeight : this.viewportHeight + 50,
            speed: 0.5 + Math.random() * 1.5,
            wobble: Math.random() * Math.PI * 2,
            size
        };

        sprite.x = b.x;
        sprite.y = b.y;
        sprite.alpha = 0.3 + Math.random() * 0.4;

        this.bubbles.push(b);
        this.addChild(sprite);
    }

    resize(width: number, height: number) {
        this.viewportWidth = width;
        this.viewportHeight = height;
    }

    update(delta: number) {
        this.bubbles.forEach((b) => {
            b.y -= b.speed * delta;
            b.wobble += 0.05 * delta;

            const wobbleX = Math.sin(b.wobble) * 20 * delta * 0.05;
            b.sprite.x = b.x + wobbleX;
            b.sprite.y = b.y;

            if (b.y < -50) {
                b.y = this.viewportHeight + 50;
                b.x = Math.random() * this.viewportWidth;
            }
        });
    }
}
