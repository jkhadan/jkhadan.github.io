export interface FishState {
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    animationPhase: number;
    hue: number;
    scale: number;
}

export interface SimulationParams {
    width: number;
    height: number;
    fishCount: number;
    visualRange: number;
    protectedRange: number;
    separationFactor: number;
    alignmentFactor: number;
    cohesionFactor: number;
    maxSpeed: number;
    minSpeed: number;
    turnFactor: number;
    mouseFleeRadius: number;
    mouseFleeWeight: number;
    mouseSpeedBoost: number; // Multiplier for max speed when fleeing mouse (e.g., 2.0 = 2x speed)
}