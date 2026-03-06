import { CreatureState, BehaviorState, CreatureType, DEPTH_ZONES, CREATURE_ALLOWED_ZONES } from './types';
import { Obstacle } from '../utils/domObstacles';
import { GridEntity } from './heterogeneousSpatialGrid';

export interface StateTransitionResult {
    newState: BehaviorState;
    targetId: number;
}

// Hysteresis thresholds to prevent state flickering
const FLEE_TRIGGER_DISTANCE = 100;
const FLEE_SAFE_DISTANCE = 150; // 50% gap
const CHASE_TRIGGER_DISTANCE = 180;
const CHASE_GIVE_UP_DISTANCE = 280;

export function updateBehaviorState(
    creature: CreatureState,
    _creatureIndex: number,
    nearbyCreatures: GridEntity[],
    obstacles: Obstacle[],
    _viewportHeight: number,
    dt: number
): StateTransitionResult {
    creature.stateTimer += dt;

    switch (creature.creatureType) {
        case CreatureType.JELLYFISH:
            return updateJellyfishState(creature, nearbyCreatures);

        case CreatureType.SEA_TURTLE:
            return updateTurtleState(creature, nearbyCreatures);

        case CreatureType.SHARK:
            return updateSharkState(creature, nearbyCreatures);

        case CreatureType.OCTOPUS:
            return updateOctopusState(creature, nearbyCreatures, obstacles);

        case CreatureType.ANGLER_FISH:
            return updateAnglerState(creature, nearbyCreatures);

        default:
            // Fish use existing flocking behavior, but may update flee state
            return updateFishState(creature, nearbyCreatures);
    }
}

function updateFishState(
    creature: CreatureState,
    nearby: GridEntity[]
): StateTransitionResult {
    // Check for predator threats (sharks)
    const shark = nearby.find(n => n.type === CreatureType.SHARK);

    if (shark) {
        const dist = Math.hypot(creature.x - shark.x, creature.y - shark.y);

        if (creature.behaviorState !== BehaviorState.FLEEING && dist < FLEE_TRIGGER_DISTANCE) {
            return { newState: BehaviorState.FLEEING, targetId: shark.index };
        }

        if (creature.behaviorState === BehaviorState.FLEEING && dist > FLEE_SAFE_DISTANCE) {
            return { newState: BehaviorState.IDLE, targetId: -1 };
        }
    } else if (creature.behaviorState === BehaviorState.FLEEING) {
        return { newState: BehaviorState.IDLE, targetId: -1 };
    }

    return { newState: creature.behaviorState || BehaviorState.IDLE, targetId: creature.targetId };
}

function updateJellyfishState(
    creature: CreatureState,
    nearby: GridEntity[]
): StateTransitionResult {
    // Check for turtle threats
    const turtle = nearby.find(n => n.type === CreatureType.SEA_TURTLE);

    if (turtle) {
        const dist = Math.hypot(creature.x - turtle.x, creature.y - turtle.y);

        if (creature.behaviorState === BehaviorState.DRIFTING && dist < FLEE_TRIGGER_DISTANCE) {
            return { newState: BehaviorState.FLEEING, targetId: turtle.index };
        }

        if (creature.behaviorState === BehaviorState.FLEEING && dist > FLEE_SAFE_DISTANCE) {
            return { newState: BehaviorState.DRIFTING, targetId: -1 };
        }
    } else if (creature.behaviorState === BehaviorState.FLEEING) {
        return { newState: BehaviorState.DRIFTING, targetId: -1 };
    }

    return { newState: creature.behaviorState || BehaviorState.DRIFTING, targetId: creature.targetId };
}

function updateTurtleState(
    creature: CreatureState,
    nearby: GridEntity[]
): StateTransitionResult {
    // Look for jellyfish prey
    const jellyfish = nearby.filter(n => n.type === CreatureType.JELLYFISH);

    if (creature.behaviorState === BehaviorState.PATROLLING && jellyfish.length > 0) {
        // Find closest jellyfish
        let closest = jellyfish[0];
        let closestDist = Math.hypot(creature.x - closest.x, creature.y - closest.y);

        for (const j of jellyfish) {
            const dist = Math.hypot(creature.x - j.x, creature.y - j.y);
            if (dist < closestDist) {
                closest = j;
                closestDist = dist;
            }
        }

        if (closestDist < CHASE_TRIGGER_DISTANCE) {
            return { newState: BehaviorState.CHASING, targetId: closest.index };
        }
    }

    if (creature.behaviorState === BehaviorState.CHASING) {
        const target = nearby.find(n => n.index === creature.targetId);
        if (!target) {
            return { newState: BehaviorState.PATROLLING, targetId: -1 };
        }

        const dist = Math.hypot(creature.x - target.x, creature.y - target.y);
        if (dist > CHASE_GIVE_UP_DISTANCE) {
            return { newState: BehaviorState.PATROLLING, targetId: -1 };
        }
    }

    return { newState: creature.behaviorState || BehaviorState.PATROLLING, targetId: creature.targetId };
}

function updateSharkState(
    creature: CreatureState,
    nearby: GridEntity[]
): StateTransitionResult {
    const fishTypes = [
        CreatureType.FISH_DART,
        CreatureType.FISH_TROPICAL,
        CreatureType.FISH_SCHOOLING,
        CreatureType.FISH_ANGEL,
    ];

    // Cooldown handling
    if (creature.behaviorState === BehaviorState.COOLDOWN) {
        if (creature.stateTimer > 4.0) {
            // 4 second cooldown
            creature.stateTimer = 0;
            return { newState: BehaviorState.PATROLLING, targetId: -1 };
        }
        return { newState: BehaviorState.COOLDOWN, targetId: creature.targetId };
    }

    // Lunge duration
    if (creature.behaviorState === BehaviorState.LUNGING) {
        if (creature.stateTimer > 0.4) {
            // 0.4 second lunge
            creature.stateTimer = 0;
            return { newState: BehaviorState.COOLDOWN, targetId: -1 };
        }
        return { newState: BehaviorState.LUNGING, targetId: creature.targetId };
    }

    // Look for fish
    const fish = nearby.filter(n => fishTypes.includes(n.type));

    if (fish.length > 0 && creature.behaviorState !== BehaviorState.CHASING) {
        const closest = fish.reduce((prev, curr) => {
            const prevDist = Math.hypot(creature.x - prev.x, creature.y - prev.y);
            const currDist = Math.hypot(creature.x - curr.x, creature.y - curr.y);
            return currDist < prevDist ? curr : prev;
        });

        const dist = Math.hypot(creature.x - closest.x, creature.y - closest.y);

        if (dist < 180) {
            return { newState: BehaviorState.CHASING, targetId: closest.index };
        }
    }

    if (creature.behaviorState === BehaviorState.CHASING) {
        const target = nearby.find(n => n.index === creature.targetId);

        if (!target) {
            return { newState: BehaviorState.PATROLLING, targetId: -1 };
        }

        const dist = Math.hypot(creature.x - target.x, creature.y - target.y);

        // Close enough to lunge
        if (dist < 50) {
            creature.stateTimer = 0;
            return { newState: BehaviorState.LUNGING, targetId: creature.targetId };
        }

        // Give up if too far
        if (dist > CHASE_GIVE_UP_DISTANCE) {
            return { newState: BehaviorState.PATROLLING, targetId: -1 };
        }
    }

    return { newState: creature.behaviorState || BehaviorState.PATROLLING, targetId: creature.targetId };
}

function updateOctopusState(
    creature: CreatureState,
    nearby: GridEntity[],
    obstacles: Obstacle[]
): StateTransitionResult {
    // Check for threats
    const threats = nearby.filter(
        n => n.type === CreatureType.SHARK || n.type === CreatureType.SEA_TURTLE
    );

    if (threats.length > 0) {
        const closest = threats[0];
        const dist = Math.hypot(creature.x - closest.x, creature.y - closest.y);

        if (dist < FLEE_TRIGGER_DISTANCE) {
            return { newState: BehaviorState.FLEEING, targetId: closest.index };
        }
    }

    if (creature.behaviorState === BehaviorState.FLEEING && threats.length === 0) {
        return { newState: BehaviorState.WANDERING, targetId: -1 };
    }

    // Resting behavior (attach to obstacles periodically)
    if (creature.behaviorState === BehaviorState.RESTING) {
        if (creature.stateTimer > 5.0) {
            // Rest for 5 seconds
            creature.stateTimer = 0;
            return { newState: BehaviorState.WANDERING, targetId: -1 };
        }
        return { newState: BehaviorState.RESTING, targetId: creature.targetId };
    }

    // Check if near obstacle to potentially rest
    if (creature.behaviorState === BehaviorState.WANDERING && Math.random() < 0.002) {
        for (const obs of obstacles) {
            const cx = obs.x + obs.width / 2;
            const cy = obs.y + obs.height / 2;
            const dist = Math.hypot(creature.x - cx, creature.y - cy);

            if (dist < 80) {
                creature.stateTimer = 0;
                return { newState: BehaviorState.RESTING, targetId: -1 };
            }
        }
    }

    return { newState: creature.behaviorState || BehaviorState.WANDERING, targetId: creature.targetId };
}

function updateAnglerState(
    creature: CreatureState,
    nearby: GridEntity[]
): StateTransitionResult {
    const fishTypes = [
        CreatureType.FISH_DART,
        CreatureType.FISH_TROPICAL,
        CreatureType.FISH_SCHOOLING,
        CreatureType.FISH_ANGEL,
    ];

    // Digesting cooldown
    if (creature.behaviorState === BehaviorState.COOLDOWN) {
        if (creature.stateTimer > 5.0) {
            creature.stateTimer = 0;
            return { newState: BehaviorState.IDLE, targetId: -1 };
        }
        return { newState: BehaviorState.COOLDOWN, targetId: -1 };
    }

    // Lunge duration
    if (creature.behaviorState === BehaviorState.LUNGING) {
        if (creature.stateTimer > 0.3) {
            creature.stateTimer = 0;
            return { newState: BehaviorState.COOLDOWN, targetId: -1 };
        }
        return { newState: BehaviorState.LUNGING, targetId: creature.targetId };
    }

    // Look for lured fish (very close)
    const fish = nearby.filter(n => fishTypes.includes(n.type));

    for (const f of fish) {
        const dist = Math.hypot(creature.x - f.x, creature.y - f.y);
        if (dist < 40) {
            // Lunge range
            creature.stateTimer = 0;
            return { newState: BehaviorState.LUNGING, targetId: f.index };
        }
    }

    return { newState: creature.behaviorState || BehaviorState.IDLE, targetId: creature.targetId };
}

// Depth zone boundary force
export function applyZoneBoundaryForce(
    creature: CreatureState,
    viewportHeight: number
): { fx: number; fy: number } {
    const allowedZones = CREATURE_ALLOWED_ZONES[creature.creatureType];
    if (!allowedZones || allowedZones.includes('ALL')) {
        return { fx: 0, fy: 0 };
    }

    // Find combined zone boundaries
    let minY = viewportHeight;
    let maxY = 0;

    for (const zoneName of allowedZones) {
        const zone = DEPTH_ZONES[zoneName];
        if (zone) {
            minY = Math.min(minY, zone.min * viewportHeight);
            maxY = Math.max(maxY, zone.max * viewportHeight);
        }
    }

    const boundaryMargin = 60;
    const repulsionStrength = 0.15;
    let fy = 0;

    if (creature.y < minY + boundaryMargin) {
        const penetration = minY + boundaryMargin - creature.y;
        fy = penetration * repulsionStrength;
    }

    if (creature.y > maxY - boundaryMargin) {
        const penetration = creature.y - (maxY - boundaryMargin);
        fy = -penetration * repulsionStrength;
    }

    return { fx: 0, fy };
}

// Get the default behavior state for a creature type
export function getDefaultBehaviorState(type: CreatureType): BehaviorState {
    switch (type) {
        case CreatureType.JELLYFISH:
            return BehaviorState.DRIFTING;
        case CreatureType.SEA_TURTLE:
        case CreatureType.SHARK:
            return BehaviorState.PATROLLING;
        case CreatureType.OCTOPUS:
            return BehaviorState.WANDERING;
        case CreatureType.ANGLER_FISH:
            return BehaviorState.IDLE;
        default:
            return BehaviorState.IDLE;
    }
}
