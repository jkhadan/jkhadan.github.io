import * as PIXI from 'pixi.js';

interface SeaweedBlade {
    x: number;
    baseY: number;
    height: number;
    segments: number;
    phase: number;
    speed: number;
    color: number;
    width: number;
}

export class Seaweed extends PIXI.Container {
    private blades: SeaweedBlade[] = [];
    private graphics: PIXI.Graphics;
    private time = 0;
    private viewportHeight: number;

    constructor(width: number, height: number, count: number = 40) {
        super();
        this.viewportHeight = height;
        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);

        // Color palette for seaweed - various greens
        const colors = [
            0x2d5a27, // Dark green
            0x3d7a3d, // Medium green
            0x1a4d1a, // Forest green
            0x4a7c59, // Sage green
            0x228b22, // Forest green bright
        ];

        // Spawn seaweed clusters along the bottom
        for (let i = 0; i < count; i++) {
            // Cluster seaweed in groups
            const clusterX = Math.random() * width;
            const bladesInCluster = 2 + Math.floor(Math.random() * 4);

            for (let j = 0; j < bladesInCluster; j++) {
                const blade: SeaweedBlade = {
                    x: clusterX + (Math.random() - 0.5) * 30,
                    baseY: height,
                    height: 80 + Math.random() * 180,
                    segments: 8 + Math.floor(Math.random() * 6),
                    phase: Math.random() * Math.PI * 2,
                    speed: 0.3 + Math.random() * 0.4,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    width: 3 + Math.random() * 4,
                };
                this.blades.push(blade);
            }
        }

        this.draw();
    }

    private draw() {
        this.graphics.clear();

        for (const blade of this.blades) {
            this.drawBlade(blade);
        }
    }

    private drawBlade(blade: SeaweedBlade) {
        const segmentHeight = blade.height / blade.segments;

        // Build points for the blade with sway
        const leftPoints: { x: number; y: number }[] = [];
        const rightPoints: { x: number; y: number }[] = [];

        for (let i = 0; i <= blade.segments; i++) {
            const t = i / blade.segments;
            const y = blade.baseY - i * segmentHeight;

            // Sway increases toward the top using easing
            const swayAmount = Math.pow(t, 2) * 25;
            const sway = Math.sin(this.time * blade.speed + blade.phase + t * 2) * swayAmount;

            // Width tapers toward the top
            const widthAtPoint = blade.width * (1 - t * 0.7);

            leftPoints.push({ x: blade.x + sway - widthAtPoint, y });
            rightPoints.push({ x: blade.x + sway + widthAtPoint, y });
        }

        // Draw filled blade shape
        this.graphics.beginPath();
        this.graphics.moveTo(leftPoints[0].x, leftPoints[0].y);

        // Left edge going up with curves
        for (let i = 1; i < leftPoints.length; i++) {
            const prev = leftPoints[i - 1];
            const curr = leftPoints[i];
            const cpX = (prev.x + curr.x) / 2;
            const cpY = (prev.y + curr.y) / 2;
            this.graphics.quadraticCurveTo(prev.x, prev.y, cpX, cpY);
        }
        this.graphics.lineTo(leftPoints[leftPoints.length - 1].x, leftPoints[leftPoints.length - 1].y);

        // Top point
        const topPoint = {
            x: (leftPoints[leftPoints.length - 1].x + rightPoints[rightPoints.length - 1].x) / 2,
            y: leftPoints[leftPoints.length - 1].y - 5
        };
        this.graphics.lineTo(topPoint.x, topPoint.y);
        this.graphics.lineTo(rightPoints[rightPoints.length - 1].x, rightPoints[rightPoints.length - 1].y);

        // Right edge going down with curves
        for (let i = rightPoints.length - 2; i >= 0; i--) {
            const prev = rightPoints[i + 1];
            const curr = rightPoints[i];
            const cpX = (prev.x + curr.x) / 2;
            const cpY = (prev.y + curr.y) / 2;
            this.graphics.quadraticCurveTo(prev.x, prev.y, cpX, cpY);
        }

        this.graphics.closePath();
        this.graphics.fill({ color: blade.color, alpha: 0.85 });

        // Add a subtle highlight/vein down the center
        this.graphics.setStrokeStyle({ width: 1, color: 0x90EE90, alpha: 0.3 });
        this.graphics.beginPath();
        this.graphics.moveTo(blade.x, blade.baseY);
        for (let i = 1; i <= blade.segments; i++) {
            const t = i / blade.segments;
            const y = blade.baseY - i * segmentHeight;
            const swayAmount = Math.pow(t, 2) * 25;
            const sway = Math.sin(this.time * blade.speed + blade.phase + t * 2) * swayAmount;
            this.graphics.lineTo(blade.x + sway, y);
        }
        this.graphics.stroke();
    }

    resize(_width: number, height: number) {
        // Adjust blade positions for new height
        const heightDiff = height - this.viewportHeight;
        for (const blade of this.blades) {
            blade.baseY += heightDiff;
        }
        this.viewportHeight = height;
    }

    update(delta: number) {
        this.time += delta * 0.02;
        this.draw();
    }
}
