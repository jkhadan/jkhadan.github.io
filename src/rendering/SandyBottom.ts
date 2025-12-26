import * as PIXI from 'pixi.js';

interface Pebble {
    x: number;
    y: number;
    radiusX: number;
    radiusY: number;
    rotation: number;
    color: number;
}

interface Shell {
    x: number;
    y: number;
    scale: number;
    rotation: number;
    type: 'spiral' | 'clam';
}

export class SandyBottom extends PIXI.Container {
    private sandSprite: PIXI.TilingSprite;
    private decorationsContainer: PIXI.Container;
    private pebbles: Pebble[] = [];
    private shells: Shell[] = [];
    private sandHeight = 120;

    constructor(width: number, height: number) {
        super();

        // Create sand gradient texture
        const sandCanvas = document.createElement('canvas');
        sandCanvas.width = 256;
        sandCanvas.height = this.sandHeight;
        const ctx = sandCanvas.getContext('2d')!;

        // Sand gradient from lighter to darker
        const gradient = ctx.createLinearGradient(0, 0, 0, this.sandHeight);
        gradient.addColorStop(0, 'rgba(194, 178, 128, 0.0)');
        gradient.addColorStop(0.2, 'rgba(194, 178, 128, 0.6)');
        gradient.addColorStop(0.5, 'rgba(174, 158, 108, 0.85)');
        gradient.addColorStop(1, 'rgba(139, 119, 73, 1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, this.sandHeight);

        // Add noise/grain texture
        for (let i = 0; i < 3000; i++) {
            const x = Math.random() * 256;
            const y = Math.random() * this.sandHeight;
            const alpha = 0.05 + Math.random() * 0.1;
            const brightness = Math.random() > 0.5 ? 255 : 0;
            ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${alpha})`;
            ctx.fillRect(x, y, 1, 1);
        }

        const sandTexture = PIXI.Texture.from(sandCanvas);
        this.sandSprite = new PIXI.TilingSprite({
            texture: sandTexture,
            width: width,
            height: this.sandHeight
        });
        this.sandSprite.y = height - this.sandHeight;
        this.addChild(this.sandSprite);

        // Create decorations container
        this.decorationsContainer = new PIXI.Container();
        this.addChild(this.decorationsContainer);

        // Generate decorations
        this.generatePebbles(width, height);
        this.generateShells(width, height);
        this.createDecorations();
    }

    private generatePebbles(width: number, height: number) {
        const pebbleColors = [
            0x808080, 0x696969, 0xa9a9a9, 0x8b7355, 0x6b5b4f, 0x4a4a4a,
        ];

        const pebbleCount = Math.floor(width / 20);
        for (let i = 0; i < pebbleCount; i++) {
            this.pebbles.push({
                x: Math.random() * width,
                y: height - 10 - Math.random() * 50,
                radiusX: 3 + Math.random() * 8,
                radiusY: 2 + Math.random() * 5,
                rotation: Math.random() * Math.PI,
                color: pebbleColors[Math.floor(Math.random() * pebbleColors.length)]
            });
        }
    }

    private generateShells(width: number, height: number) {
        const shellCount = Math.floor(width / 150);
        for (let i = 0; i < shellCount; i++) {
            this.shells.push({
                x: Math.random() * width,
                y: height - 20 - Math.random() * 40,
                scale: 0.5 + Math.random() * 0.8,
                rotation: Math.random() * Math.PI * 2,
                type: Math.random() > 0.5 ? 'spiral' : 'clam'
            });
        }
    }

    private createDecorations() {
        this.decorationsContainer.removeChildren();

        // Draw pebbles
        for (const pebble of this.pebbles) {
            const g = new PIXI.Graphics();
            g.position.set(pebble.x, pebble.y);
            g.rotation = pebble.rotation;

            // Shadow
            g.ellipse(1, 1, pebble.radiusX, pebble.radiusY);
            g.fill({ color: 0x000000, alpha: 0.2 });

            // Body
            g.ellipse(0, 0, pebble.radiusX, pebble.radiusY);
            g.fill({ color: pebble.color, alpha: 0.9 });

            // Highlight
            g.ellipse(-pebble.radiusX * 0.3, -pebble.radiusY * 0.3, pebble.radiusX * 0.3, pebble.radiusY * 0.3);
            g.fill({ color: 0xffffff, alpha: 0.2 });

            this.decorationsContainer.addChild(g);
        }

        // Draw shells
        for (const shell of this.shells) {
            const g = new PIXI.Graphics();
            g.position.set(shell.x, shell.y);
            g.rotation = shell.rotation;
            g.scale.set(shell.scale);

            if (shell.type === 'spiral') {
                this.drawSpiralShell(g);
            } else {
                this.drawClamShell(g);
            }

            this.decorationsContainer.addChild(g);
        }
    }

    private drawSpiralShell(g: PIXI.Graphics) {
        const shellColor = 0xfff8dc;
        const shellDark = 0xd2b48c;

        g.ellipse(0, 0, 12, 8);
        g.fill({ color: shellColor, alpha: 0.9 });
        g.stroke({ color: shellDark, width: 1, alpha: 0.5 });

        g.arc(2, 0, 5, 0, Math.PI * 1.5);
        g.stroke({ color: shellDark, width: 1, alpha: 0.6 });

        g.arc(3, 0, 3, 0, Math.PI);
        g.stroke({ color: shellDark, width: 1, alpha: 0.4 });
    }

    private drawClamShell(g: PIXI.Graphics) {
        const shellColor = 0xffe4c4;
        const shellDark = 0xcd853f;

        g.moveTo(0, 8);
        for (let i = 0; i <= 7; i++) {
            const angle = (Math.PI / 7) * i - Math.PI / 2;
            g.lineTo(Math.cos(angle) * 10, Math.sin(angle) * 10 + 8);
        }
        g.closePath();
        g.fill({ color: shellColor, alpha: 0.9 });

        for (let i = 1; i < 7; i++) {
            const angle = (Math.PI / 7) * i - Math.PI / 2;
            g.moveTo(0, 8);
            g.lineTo(Math.cos(angle) * 9, Math.sin(angle) * 9 + 8);
            g.stroke({ color: shellDark, width: 0.5, alpha: 0.5 });
        }
    }

    resize(width: number, height: number) {
        this.sandSprite.width = width;
        this.sandSprite.y = height - this.sandHeight;

        this.pebbles = [];
        this.shells = [];
        this.generatePebbles(width, height);
        this.generateShells(width, height);
        this.createDecorations();
    }
}
