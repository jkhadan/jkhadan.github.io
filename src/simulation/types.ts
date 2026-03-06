// Original fish types (keeping for backwards compatibility)
export enum FishType {
    DART = 0,
    TROPICAL = 1,
    SCHOOLING = 2,
    ANGEL = 3,
}

// Extended creature types for the ecosystem
export enum CreatureType {
    // Existing fish types
    FISH_DART = 0,
    FISH_TROPICAL = 1,
    FISH_SCHOOLING = 2,
    FISH_ANGEL = 3,
    // New creature types
    JELLYFISH = 10,
    SEA_TURTLE = 20,
    SHARK = 30,
    OCTOPUS = 40,
    ANGLER_FISH = 50,
}

// Map old FishType to CreatureType for compatibility
export const FISH_TYPE_TO_CREATURE: Record<FishType, CreatureType> = {
    [FishType.DART]: CreatureType.FISH_DART,
    [FishType.TROPICAL]: CreatureType.FISH_TROPICAL,
    [FishType.SCHOOLING]: CreatureType.FISH_SCHOOLING,
    [FishType.ANGEL]: CreatureType.FISH_ANGEL,
};

// Creature categories for spatial grid optimization
export enum CreatureCategory {
    SMALL = 'small',     // Fish
    MEDIUM = 'medium',   // Jellyfish, Octopus
    LARGE = 'large',     // Turtle, Shark, Angler
}

export const CREATURE_CATEGORY_MAP: Record<CreatureType, CreatureCategory> = {
    [CreatureType.FISH_DART]: CreatureCategory.SMALL,
    [CreatureType.FISH_TROPICAL]: CreatureCategory.SMALL,
    [CreatureType.FISH_SCHOOLING]: CreatureCategory.SMALL,
    [CreatureType.FISH_ANGEL]: CreatureCategory.SMALL,
    [CreatureType.JELLYFISH]: CreatureCategory.MEDIUM,
    [CreatureType.SEA_TURTLE]: CreatureCategory.LARGE,
    [CreatureType.SHARK]: CreatureCategory.LARGE,
    [CreatureType.OCTOPUS]: CreatureCategory.MEDIUM,
    [CreatureType.ANGLER_FISH]: CreatureCategory.LARGE,
};

// Check if a creature type is a fish (for flocking behavior)
export const isFishType = (type: CreatureType): boolean => {
    return type >= CreatureType.FISH_DART && type <= CreatureType.FISH_ANGEL;
};

// Behavior states for state machine
export enum BehaviorState {
    IDLE = 0,
    FLEEING = 1,
    CHASING = 2,
    PATROLLING = 3,
    RESTING = 4,
    LUNGING = 5,
    COOLDOWN = 6,
    DRIFTING = 7,
    WANDERING = 8,
}

// Original fish state (keeping for backwards compatibility with existing worker)
export interface FishState {
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    animationPhase: number;
    hue: number;
    scale: number;
    fishType: FishType;
}

// Extended creature state (stride 12 floats)
export interface CreatureState {
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    animationPhase: number;
    hue: number;
    scale: number;
    creatureType: CreatureType;
    behaviorState: BehaviorState;
    stateTimer: number;      // Time in current state
    targetId: number;        // ID of target creature (-1 if none)
}

// Depth zones as percentage of viewport height
export interface DepthZone {
    min: number;  // 0.0 - 1.0
    max: number;  // 0.0 - 1.0
}

export const DEPTH_ZONES: Record<string, DepthZone> = {
    SHALLOW: { min: 0.0, max: 0.25 },
    MEDIUM: { min: 0.25, max: 0.60 },
    DEEP: { min: 0.60, max: 1.0 },
    ALL: { min: 0.0, max: 1.0 },
};

export const CREATURE_ALLOWED_ZONES: Record<CreatureType, string[]> = {
    [CreatureType.FISH_DART]: ['ALL'],
    [CreatureType.FISH_TROPICAL]: ['ALL'],
    [CreatureType.FISH_SCHOOLING]: ['ALL'],
    [CreatureType.FISH_ANGEL]: ['ALL'],
    [CreatureType.JELLYFISH]: ['SHALLOW'],
    [CreatureType.SEA_TURTLE]: ['MEDIUM'],
    [CreatureType.SHARK]: ['MEDIUM'],
    [CreatureType.OCTOPUS]: ['SHALLOW', 'MEDIUM'],
    [CreatureType.ANGLER_FISH]: ['DEEP'],
};

// Creature-specific parameters
export interface CreatureParams {
    baseScale: number;
    scaleVariance: number;
    maxSpeed: number;
    minSpeed: number;
    turnRate: number;
    visualRange: number;
    protectedRange: number;
}

export const CREATURE_PARAMS: Record<CreatureType, CreatureParams> = {
    [CreatureType.FISH_DART]: {
        baseScale: 0.9,
        scaleVariance: 0.2,
        maxSpeed: 3.0,
        minSpeed: 0.8,
        turnRate: 0.15,
        visualRange: 75,
        protectedRange: 35,
    },
    [CreatureType.FISH_TROPICAL]: {
        baseScale: 1.0,
        scaleVariance: 0.2,
        maxSpeed: 2.5,
        minSpeed: 0.5,
        turnRate: 0.12,
        visualRange: 75,
        protectedRange: 35,
    },
    [CreatureType.FISH_SCHOOLING]: {
        baseScale: 0.8,
        scaleVariance: 0.15,
        maxSpeed: 2.8,
        minSpeed: 0.6,
        turnRate: 0.18,
        visualRange: 100,
        protectedRange: 30,
    },
    [CreatureType.FISH_ANGEL]: {
        baseScale: 1.1,
        scaleVariance: 0.25,
        maxSpeed: 2.0,
        minSpeed: 0.4,
        turnRate: 0.10,
        visualRange: 75,
        protectedRange: 40,
    },
    [CreatureType.JELLYFISH]: {
        baseScale: 0.8,
        scaleVariance: 0.3,
        maxSpeed: 0.8,
        minSpeed: 0.2,
        turnRate: 0.03,
        visualRange: 60,
        protectedRange: 50,
    },
    [CreatureType.SEA_TURTLE]: {
        baseScale: 1.4,
        scaleVariance: 0.3,
        maxSpeed: 1.5,
        minSpeed: 0.3,
        turnRate: 0.05,
        visualRange: 150,
        protectedRange: 80,
    },
    [CreatureType.SHARK]: {
        baseScale: 1.6,
        scaleVariance: 0.3,
        maxSpeed: 3.5,
        minSpeed: 1.0,
        turnRate: 0.08,
        visualRange: 200,
        protectedRange: 100,
    },
    [CreatureType.OCTOPUS]: {
        baseScale: 1.0,
        scaleVariance: 0.25,
        maxSpeed: 1.2,
        minSpeed: 0.1,
        turnRate: 0.10,
        visualRange: 80,
        protectedRange: 60,
    },
    [CreatureType.ANGLER_FISH]: {
        baseScale: 1.3,
        scaleVariance: 0.2,
        maxSpeed: 0.6,
        minSpeed: 0.1,
        turnRate: 0.04,
        visualRange: 120,
        protectedRange: 70,
    },
};

// Original simulation parameters
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
    mouseSpeedBoost: number;
}

// Extended ecosystem parameters
export interface EcosystemParams extends SimulationParams {
    // Predator-prey parameters
    sharkIntimidationRadius: number;
    anglerLureRadius: number;
    turtleDetectionRadius: number;

    // Depth zone parameters
    zoneBoundaryMargin: number;
    zoneBoundaryRepulsion: number;
}

export const DEFAULT_ECOSYSTEM_PARAMS: Partial<EcosystemParams> = {
    sharkIntimidationRadius: 180,
    anglerLureRadius: 120,
    turtleDetectionRadius: 150,
    zoneBoundaryMargin: 60,
    zoneBoundaryRepulsion: 0.15,
};
