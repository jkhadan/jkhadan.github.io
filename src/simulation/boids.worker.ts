import { FishState, FishType, SimulationParams } from './types';
import { SpatialGrid } from './spatialGrid';
import { applyForces } from './forces';
import { Obstacle } from '../utils/domObstacles';

// Tuned defaults for visible separation and dynamic fleeing
let params: SimulationParams = {
    width: 800,
    height: 600,
    fishCount: 100,
    visualRange: 75,           // Slightly increased for better flocking awareness
    protectedRange: 35,        // INCREASED from 10 - fish start separating much earlier
    separationFactor: 0.45,    // INCREASED from 0.1 - much stronger push apart
    alignmentFactor: 0.04,     // Slightly reduced to prevent tight schooling
    cohesionFactor: 0.005,     // REDUCED from 0.01 - less pull toward center
    maxSpeed: 2.5,             // Slightly increased base speed
    minSpeed: 0.5,
    turnFactor: 0.1,
    mouseFleeRadius: 180,      // Slightly larger flee zone
    mouseFleeWeight: 1.25,      // Stronger flee response
    mouseSpeedBoost: 5,      // NEW: Fish swim up to 5x faster when fleeing mouse
};

let fish: FishState[] = [];
let grid: SpatialGrid | null = null;
let obstacles: Obstacle[] = [];
let mouse = { x: -1000, y: -1000, active: false };
let paused = false;

const STRIDE = 7;

function init(config: Partial<SimulationParams>) {
    params = { ...params, ...config };

    if (!grid) {
        grid = new SpatialGrid(params.width, params.height, params.visualRange);
    } else {
        grid.resize(params.width, params.height);
    }

    fish = [];

    // Spawn fish with better initial distribution to avoid immediate bunching
    const cols = Math.ceil(Math.sqrt(params.fishCount * (params.width / params.height)));
    const rows = Math.ceil(params.fishCount / cols);
    const cellWidth = params.width / cols;
    const cellHeight = params.height / rows;

    for (let i = 0; i < params.fishCount; i++) {
        // Grid-based initial positions with jitter for natural look
        const col = i % cols;
        const row = Math.floor(i / cols);
        const jitterX = (Math.random() - 0.5) * cellWidth * 0.8;
        const jitterY = (Math.random() - 0.5) * cellHeight * 0.8;

        const scale = 0.8 + Math.random() * 0.4;

        // Assign fish type based on scale for natural size grouping
        let fishType: FishType;
        if (scale < 0.9) {
            fishType = FishType.SCHOOLING;
        } else if (scale < 1.0) {
            fishType = FishType.DART;
        } else if (scale < 1.1) {
            fishType = FishType.TROPICAL;
        } else {
            fishType = FishType.ANGEL;
        }

        fish.push({
            x: (col + 0.5) * cellWidth + jitterX,
            y: (row + 0.5) * cellHeight + jitterY,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            rotation: Math.random() * Math.PI * 2,
            animationPhase: Math.random() * Math.PI * 2,
            hue: Math.random(),
            scale,
            fishType,
        });
    }
}

function tick() {
    if (!grid || paused) return;
    grid.clear();

    fish.forEach((f, i) => grid!.add(i, f.x, f.y));

    const outputBuffer = new Float32Array(params.fishCount * STRIDE);

    for (let i = 0; i < fish.length; i++) {
        const f = fish[i];
        const neighbors = grid.getNeighbors(f.x, f.y, params.visualRange);

        applyForces(f, i, fish, neighbors, mouse, obstacles, params);

        const offset = i * STRIDE;
        outputBuffer[offset + 0] = f.x;
        outputBuffer[offset + 1] = f.y;
        outputBuffer[offset + 2] = f.scale;
        outputBuffer[offset + 3] = f.rotation;
        outputBuffer[offset + 4] = f.hue;
        outputBuffer[offset + 5] = f.animationPhase;
        outputBuffer[offset + 6] = f.fishType;
    }

    self.postMessage({ type: 'update', buffer: outputBuffer }, [outputBuffer.buffer] as any);
}

self.onmessage = (e: MessageEvent) => {
    const { type, payload } = e.data;

    switch (type) {
        case 'init':
            init(payload);
            setInterval(tick, 1000 / 60);
            break;
        case 'resize':
            params.width = payload.width;
            params.height = payload.height;
            if (grid) grid.resize(params.width, params.height);
            break;
        case 'obstacles':
            obstacles = payload;
            break;
        case 'mouse':
            mouse = payload;
            break;
        case 'pause':
            paused = true;
            break;
        case 'resume':
            paused = false;
            break;
    }
};