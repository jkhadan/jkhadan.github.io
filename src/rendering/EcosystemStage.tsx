import { Application } from 'pixi.js';
import React, { useEffect, useRef } from 'react';
import { InstancedFishRenderer } from './InstancedFishRenderer';
import { JellyfishRenderer } from './JellyfishRenderer';
import { SharkRenderer } from './SharkRenderer';
import { SeaTurtleRenderer } from './SeaTurtleRenderer';
import { OctopusRenderer } from './OctopusRenderer';
import { AnglerFishRenderer } from './AnglerFishRenderer';
import { Environment } from './Environment';
import { InstancedBubbles } from './InstancedBubbles';
import { Seaweed } from './Seaweed';
import { SandyBottom } from './SandyBottom';
import EcosystemWorker from '../simulation/ecosystem.worker?worker';
import { detectGpuTier } from '../utils/detectGpu';
import { getCreatureCounts, getFishOnlyCount } from '../config/creatureCounts';
import { CreatureType } from '../simulation/types';
import { obstacleManager } from '../utils/domObstacles';

// Worker output stride
const OUTPUT_STRIDE = 12;

interface CreatureRanges {
    [key: number]: { start: number; count: number };
}

export const EcosystemStage: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<Application | null>(null);
    const workerRef = useRef<Worker | null>(null);
    const cleanupRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        let destroyed = false;

        // Renderers
        let fishRenderer: InstancedFishRenderer | null = null;
        let jellyfishRenderer: JellyfishRenderer | null = null;
        let sharkRenderer: SharkRenderer | null = null;
        let turtleRenderer: SeaTurtleRenderer | null = null;
        let octopusRenderer: OctopusRenderer | null = null;
        let anglerRenderer: AnglerFishRenderer | null = null;

        // Environment
        let environment: Environment;
        let bubbles: InstancedBubbles;
        let seaweed: Seaweed;
        let sandyBottom: SandyBottom;

        const init = async () => {
            const tier = await detectGpuTier();
            const creatureCounts = getCreatureCounts(tier);
            const fishCount = getFishOnlyCount(tier);

            console.log('GPU Tier:', tier, 'Creature counts:', creatureCounts);

            if (destroyed) return;

            // Get quality settings for resolution
            const resolution = tier >= 2 ? 1 : tier === 1 ? 0.75 : 0.5;

            const app = new Application();
            await app.init({
                resizeTo: window,
                backgroundAlpha: 0,
                resolution,
                autoDensity: true,
                antialias: tier >= 2,
                preference: 'webgl',
            });

            if (destroyed) {
                app.destroy();
                return;
            }
            containerRef.current!.appendChild(app.canvas as HTMLCanvasElement);
            appRef.current = app;

            const width = app.screen.width;
            const height = Math.max(document.body.scrollHeight, window.innerHeight * 2);

            console.log('Canvas size:', width, 'x', height);

            // Background environment (gradient + caustics)
            environment = new Environment(width, height);
            app.stage.addChild(environment);

            // Sandy bottom with pebbles and shells
            sandyBottom = new SandyBottom(width, height);
            app.stage.addChild(sandyBottom);

            // Animated seaweed at the bottom
            const seaweedCount = Math.max(20, Math.floor(fishCount / 10));
            seaweed = new Seaweed(width, height, seaweedCount);
            app.stage.addChild(seaweed);

            // Create creature renderers
            // Fish (all 4 types combined for instanced rendering)
            if (fishCount > 0) {
                fishRenderer = new InstancedFishRenderer(fishCount);
                app.stage.addChild(fishRenderer);
            }

            // Jellyfish
            const jellyfishCount = creatureCounts[CreatureType.JELLYFISH];
            if (jellyfishCount > 0) {
                jellyfishRenderer = new JellyfishRenderer(jellyfishCount);
                app.stage.addChild(jellyfishRenderer);
            }

            // Sea Turtles
            const turtleCount = creatureCounts[CreatureType.SEA_TURTLE];
            if (turtleCount > 0) {
                turtleRenderer = new SeaTurtleRenderer(turtleCount);
                app.stage.addChild(turtleRenderer);
            }

            // Sharks
            const sharkCount = creatureCounts[CreatureType.SHARK];
            if (sharkCount > 0) {
                sharkRenderer = new SharkRenderer(sharkCount);
                app.stage.addChild(sharkRenderer);
            }

            // Octopus
            const octopusCount = creatureCounts[CreatureType.OCTOPUS];
            if (octopusCount > 0) {
                octopusRenderer = new OctopusRenderer(octopusCount);
                app.stage.addChild(octopusRenderer);
            }

            // Angler Fish
            const anglerCount = creatureCounts[CreatureType.ANGLER_FISH];
            if (anglerCount > 0) {
                anglerRenderer = new AnglerFishRenderer(anglerCount);
                app.stage.addChild(anglerRenderer);
            }

            // Bubbles on top
            bubbles = new InstancedBubbles(width, height, Math.floor(fishCount / 5));
            app.stage.addChild(bubbles);

            // Initialize ecosystem worker
            workerRef.current = new EcosystemWorker();
            workerRef.current.postMessage({
                type: 'init',
                payload: {
                    width,
                    height,
                    creatureCounts,
                },
            });

            workerRef.current.onmessage = (e) => {
                const { type, buffer, creatureRanges: ranges } = e.data;

                if (type === 'update') {
                    const deltaTime = 1; // Approximate delta time

                    // Update fish renderer with fish data
                    // Fish types are 0-3, need to extract and reformat for existing renderer
                    if (fishRenderer && fishCount > 0) {
                        const fishBuffer = extractFishBuffer(buffer, ranges, fishCount);
                        fishRenderer.update(fishBuffer);
                    }

                    // Update other creature renderers
                    if (jellyfishRenderer && ranges[CreatureType.JELLYFISH]) {
                        const range = ranges[CreatureType.JELLYFISH];
                        jellyfishRenderer.update(buffer, range.start, deltaTime);
                    }

                    if (turtleRenderer && ranges[CreatureType.SEA_TURTLE]) {
                        const range = ranges[CreatureType.SEA_TURTLE];
                        turtleRenderer.update(buffer, range.start, deltaTime);
                    }

                    if (sharkRenderer && ranges[CreatureType.SHARK]) {
                        const range = ranges[CreatureType.SHARK];
                        sharkRenderer.update(buffer, range.start, deltaTime);
                    }

                    if (octopusRenderer && ranges[CreatureType.OCTOPUS]) {
                        const range = ranges[CreatureType.OCTOPUS];
                        octopusRenderer.update(buffer, range.start, deltaTime);
                    }

                    if (anglerRenderer && ranges[CreatureType.ANGLER_FISH]) {
                        const range = ranges[CreatureType.ANGLER_FISH];
                        anglerRenderer.update(buffer, range.start, deltaTime);
                    }
                }
            };

            // Extract fish data into format expected by InstancedFishRenderer
            function extractFishBuffer(
                buffer: Float32Array,
                ranges: CreatureRanges,
                totalFishCount: number
            ): Float32Array {
                // InstancedFishRenderer expects stride of 7: x, y, scale, rotation, hue, phase, fishType
                const fishBuffer = new Float32Array(totalFishCount * 7);
                let fishIndex = 0;

                const fishTypes = [
                    CreatureType.FISH_DART,
                    CreatureType.FISH_TROPICAL,
                    CreatureType.FISH_SCHOOLING,
                    CreatureType.FISH_ANGEL,
                ];

                for (const fishType of fishTypes) {
                    const range = ranges[fishType];
                    if (!range) continue;

                    for (let i = 0; i < range.count; i++) {
                        const srcOffset = (range.start + i) * OUTPUT_STRIDE;
                        const dstOffset = fishIndex * 7;

                        fishBuffer[dstOffset + 0] = buffer[srcOffset + 0]; // x
                        fishBuffer[dstOffset + 1] = buffer[srcOffset + 1]; // y
                        fishBuffer[dstOffset + 2] = buffer[srcOffset + 7]; // scale
                        fishBuffer[dstOffset + 3] = buffer[srcOffset + 4]; // rotation
                        fishBuffer[dstOffset + 4] = buffer[srcOffset + 6]; // hue
                        fishBuffer[dstOffset + 5] = buffer[srcOffset + 5]; // animationPhase
                        fishBuffer[dstOffset + 6] = fishType; // fishType (0-3)

                        fishIndex++;
                    }
                }

                return fishBuffer;
            }

            // Mouse tracking
            const mouseHandler = (e: MouseEvent) => {
                workerRef.current?.postMessage({
                    type: 'mouse',
                    payload: { x: e.clientX, y: e.clientY + window.scrollY, active: true },
                });
            };
            window.addEventListener('mousemove', mouseHandler);

            // Animation loop
            app.ticker.add((ticker) => {
                const scrollY = window.scrollY;
                app.stage.position.y = -scrollY;
                environment.update(ticker.deltaTime);
                seaweed.update(ticker.deltaTime);
                bubbles.update(ticker.deltaTime);
            });

            // Resize handling
            const resizeHandler = () => {
                const w = window.innerWidth;
                const h = Math.max(document.documentElement.scrollHeight, window.innerHeight);
                environment.resize(w, h);
                sandyBottom.resize(w, h);
                seaweed.resize(w, h);
                bubbles.resize(w, h);
                workerRef.current?.postMessage({
                    type: 'resize',
                    payload: { width: w, height: h },
                });

                const obstacles = obstacleManager.getObstacles();
                workerRef.current?.postMessage({
                    type: 'obstacles',
                    payload: obstacles,
                });
            };
            window.addEventListener('resize', resizeHandler);

            // Initial resize after a short delay to ensure DOM is ready
            setTimeout(() => resizeHandler(), 500);

            // Pause simulation when tab is not visible
            const visibilityHandler = () => {
                if (document.hidden) {
                    workerRef.current?.postMessage({ type: 'pause' });
                    app.ticker.stop();
                } else {
                    workerRef.current?.postMessage({ type: 'resume' });
                    app.ticker.start();
                }
            };
            document.addEventListener('visibilitychange', visibilityHandler);

            // Store cleanup function for event listeners
            cleanupRef.current = () => {
                document.removeEventListener('visibilitychange', visibilityHandler);
                window.removeEventListener('resize', resizeHandler);
                window.removeEventListener('mousemove', mouseHandler);
            };
        };

        init();

        return () => {
            destroyed = true;
            cleanupRef.current?.();
            appRef.current?.destroy(true, { children: true });
            workerRef.current?.terminate();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none',
            }}
        />
    );
};
