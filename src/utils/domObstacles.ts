import { useEffect } from 'react';

export interface Obstacle {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    shape: 'rect' | 'circle';
}

class ObstacleManager {
    private elements: Map<string, HTMLElement> = new Map();
    private cachedObstacles: Obstacle[] = [];
    private dirty = false;
    private scrollY = 0;

    constructor() {
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', this.flagDirty);
            window.addEventListener('scroll', this.updateScroll, { passive: true });
            this.updateScroll();
        }
    }

    private flagDirty = () => {
        this.dirty = true;
    };

    private updateScroll = () => {
        this.scrollY = window.scrollY;
        this.dirty = true; // Obstable positions relative to viewport/world usually change or need re-calc? 
        // Actually, if we map to "world" coordinates (absolute), then scroll affects viewport but elements stay in world.
        // If fish are in world space (0 to document height), then obstacles should be in world space.
        // getBoundingClientRect is viewport relative. element.offsetTop is relative to parent.
        // Best: getBoundingClientRect + scrollY = Absolute World Y.
    };

    register(id: string, element: HTMLElement) {
        this.elements.set(id, element);
        this.flagDirty();
    }

    unregister(id: string) {
        this.elements.delete(id);
        this.flagDirty();
    }

    getObstacles(): Obstacle[] {
        if (this.dirty) {
            this.recalculate();
        }
        return this.cachedObstacles;
    }

    private recalculate() {
        const newObstacles: Obstacle[] = [];
        this.scrollY = window.scrollY; // ensure fresh

        for (const [id, el] of this.elements) {
            const rect = el.getBoundingClientRect();
            // Only care if it has size
            if (rect.width > 0 && rect.height > 0) {
                newObstacles.push({
                    id,
                    x: rect.left, // World and Viewport X are same usually if no horizontal scroll
                    y: rect.top + this.scrollY, // Convert to World Y
                    width: rect.width,
                    height: rect.height,
                    shape: 'rect', // Default, logic can enhance later
                });
            }
        }
        this.cachedObstacles = newObstacles;
        this.dirty = false;
    }
}

export const obstacleManager = new ObstacleManager();

// Hook for components to register themselves
export const useObstacle = (id: string, ref: React.RefObject<HTMLElement>) => {
    useEffect(() => {
        if (ref.current) {
            obstacleManager.register(id, ref.current);
        }
        return () => {
            obstacleManager.unregister(id);
        };
    }, [id, ref]);
};
