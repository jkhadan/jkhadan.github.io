import { Application } from 'pixi.js';
import React, { useEffect, useRef } from 'react';
import { FishRenderer } from './FishRenderer';
import { Environment } from './Environment';
import { Bubbles } from './Bubbles';
import { Seaweed } from './Seaweed';
import { SandyBottom } from './SandyBottom';
import BoidsWorker from '../simulation/boids.worker?worker';
import { detectGpuTier, getQualitySettings } from '../utils/detectGpu';
import { obstacleManager } from '../utils/domObstacles';

export const PixiStage: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<Application | null>(null);
    const workerRef = useRef<Worker | null>(null);
    const cleanupRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        let destroyed = false;
        let fishRenderer: FishRenderer;
        let environment: Environment;
        let bubbles: Bubbles;
        let seaweed: Seaweed;
        let sandyBottom: SandyBottom;

        const init = async () => {
            const tier = await detectGpuTier();
            const quality = getQualitySettings(tier);

            console.log('GPU Tier:', tier, 'Fish count:', quality.fishCount);

            if (destroyed) return;

            const app = new Application();
            await app.init({
                resizeTo: window,
                backgroundAlpha: 0,
                resolution: quality.resolution,
                autoDensity: true,
                antialias: true,
                preference: 'webgl'
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
            const seaweedCount = Math.max(20, Math.floor(quality.fishCount / 10));
            seaweed = new Seaweed(width, height, seaweedCount);
            app.stage.addChild(seaweed);

            // Fish
            fishRenderer = new FishRenderer(quality.fishCount);
            app.stage.addChild(fishRenderer);

            // Bubbles on top
            bubbles = new Bubbles(width, height, Math.floor(quality.fishCount / 5));
            app.stage.addChild(bubbles);

            // Initialize web worker
            workerRef.current = new BoidsWorker();
            workerRef.current.postMessage({
                type: 'init',
                payload: {
                    width,
                    height,
                    fishCount: quality.fishCount
                }
            });

            workerRef.current.onmessage = (e) => {
                const { type, buffer } = e.data;
                if (type === 'update') {
                    fishRenderer.update(buffer);
                }
            };

            // Mouse tracking
            const mouseHandler = (e: MouseEvent) => {
                workerRef.current?.postMessage({
                    type: 'mouse',
                    payload: { x: e.clientX, y: e.clientY + window.scrollY, active: true }
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
                    payload: { width: w, height: h }
                });

                const obstacles = obstacleManager.getObstacles();
                workerRef.current?.postMessage({
                    type: 'obstacles',
                    payload: obstacles
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
                pointerEvents: 'none'
            }}
        />
    );
};