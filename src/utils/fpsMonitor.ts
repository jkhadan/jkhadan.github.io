export class FpsMonitor {
    private frames = 0;
    private lastTime = 0;
    private fps = 60;
    private callback: ((fps: number) => void) | null = null;
    private active = false;

    constructor(callback?: (fps: number) => void) {
        if (callback) this.callback = callback;
    }

    start() {
        this.active = true;
        this.lastTime = performance.now();
        this.frames = 0;
        this.loop();
    }

    stop() {
        this.active = false;
    }

    private loop = () => {
        if (!this.active) return;

        this.frames++;
        const time = performance.now();

        if (time >= this.lastTime + 1000) {
            this.fps = (this.frames * 1000) / (time - this.lastTime);
            this.lastTime = time;
            this.frames = 0;
            if (this.callback) this.callback(Math.round(this.fps));
        }

        requestAnimationFrame(this.loop);
    };

    getFps() {
        return this.fps;
    }
}
