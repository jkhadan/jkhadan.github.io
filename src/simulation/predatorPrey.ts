import { CreatureState, CreatureType } from './types';

// Interaction types
export enum InteractionType {
    NONE = 'NONE',
    SEPARATION = 'SEP',
    AVOID = 'AVOID',
    FLEE = 'FLEE',
    CHASE = 'CHASE',
    LURE = 'LURE',
}

// Interaction matrix: [source][target] = interaction
// Describes how source creature reacts to target creature
export const INTERACTION_MATRIX: Record<number, Record<number, InteractionType>> = {
    // Fish interactions
    [CreatureType.FISH_DART]: {
        [CreatureType.FISH_DART]: InteractionType.SEPARATION,
        [CreatureType.FISH_TROPICAL]: InteractionType.SEPARATION,
        [CreatureType.FISH_SCHOOLING]: InteractionType.SEPARATION,
        [CreatureType.FISH_ANGEL]: InteractionType.SEPARATION,
        [CreatureType.JELLYFISH]: InteractionType.AVOID,
        [CreatureType.SEA_TURTLE]: InteractionType.AVOID,
        [CreatureType.SHARK]: InteractionType.FLEE,
        [CreatureType.OCTOPUS]: InteractionType.NONE,
        [CreatureType.ANGLER_FISH]: InteractionType.LURE,
    },
    [CreatureType.FISH_TROPICAL]: {
        [CreatureType.FISH_DART]: InteractionType.SEPARATION,
        [CreatureType.FISH_TROPICAL]: InteractionType.SEPARATION,
        [CreatureType.FISH_SCHOOLING]: InteractionType.SEPARATION,
        [CreatureType.FISH_ANGEL]: InteractionType.SEPARATION,
        [CreatureType.JELLYFISH]: InteractionType.AVOID,
        [CreatureType.SEA_TURTLE]: InteractionType.AVOID,
        [CreatureType.SHARK]: InteractionType.FLEE,
        [CreatureType.OCTOPUS]: InteractionType.NONE,
        [CreatureType.ANGLER_FISH]: InteractionType.LURE,
    },
    [CreatureType.FISH_SCHOOLING]: {
        [CreatureType.FISH_DART]: InteractionType.SEPARATION,
        [CreatureType.FISH_TROPICAL]: InteractionType.SEPARATION,
        [CreatureType.FISH_SCHOOLING]: InteractionType.SEPARATION,
        [CreatureType.FISH_ANGEL]: InteractionType.SEPARATION,
        [CreatureType.JELLYFISH]: InteractionType.AVOID,
        [CreatureType.SEA_TURTLE]: InteractionType.AVOID,
        [CreatureType.SHARK]: InteractionType.FLEE,
        [CreatureType.OCTOPUS]: InteractionType.NONE,
        [CreatureType.ANGLER_FISH]: InteractionType.LURE,
    },
    [CreatureType.FISH_ANGEL]: {
        [CreatureType.FISH_DART]: InteractionType.SEPARATION,
        [CreatureType.FISH_TROPICAL]: InteractionType.SEPARATION,
        [CreatureType.FISH_SCHOOLING]: InteractionType.SEPARATION,
        [CreatureType.FISH_ANGEL]: InteractionType.SEPARATION,
        [CreatureType.JELLYFISH]: InteractionType.AVOID,
        [CreatureType.SEA_TURTLE]: InteractionType.AVOID,
        [CreatureType.SHARK]: InteractionType.FLEE,
        [CreatureType.OCTOPUS]: InteractionType.NONE,
        [CreatureType.ANGLER_FISH]: InteractionType.LURE,
    },
    // Jellyfish interactions
    [CreatureType.JELLYFISH]: {
        [CreatureType.JELLYFISH]: InteractionType.SEPARATION,
        [CreatureType.SEA_TURTLE]: InteractionType.FLEE,
    },
    // Sea Turtle interactions
    [CreatureType.SEA_TURTLE]: {
        [CreatureType.JELLYFISH]: InteractionType.CHASE,
        [CreatureType.SEA_TURTLE]: InteractionType.SEPARATION,
        [CreatureType.SHARK]: InteractionType.AVOID,
    },
    // Shark interactions
    [CreatureType.SHARK]: {
        [CreatureType.FISH_DART]: InteractionType.CHASE,
        [CreatureType.FISH_TROPICAL]: InteractionType.CHASE,
        [CreatureType.FISH_SCHOOLING]: InteractionType.CHASE,
        [CreatureType.FISH_ANGEL]: InteractionType.CHASE,
        [CreatureType.SEA_TURTLE]: InteractionType.AVOID,
        [CreatureType.SHARK]: InteractionType.SEPARATION,
    },
    // Octopus interactions
    [CreatureType.OCTOPUS]: {
        [CreatureType.OCTOPUS]: InteractionType.SEPARATION,
        [CreatureType.SEA_TURTLE]: InteractionType.FLEE,
        [CreatureType.SHARK]: InteractionType.FLEE,
    },
    // Angler Fish interactions
    [CreatureType.ANGLER_FISH]: {
        [CreatureType.ANGLER_FISH]: InteractionType.SEPARATION,
    },
};

// Interaction parameters
export const INTERACTION_PARAMS: Record<InteractionType, { distance: number; strength: number }> = {
    [InteractionType.NONE]: { distance: 0, strength: 0 },
    [InteractionType.SEPARATION]: { distance: 40, strength: 0.12 },
    [InteractionType.AVOID]: { distance: 120, strength: 0.35 },
    [InteractionType.FLEE]: { distance: 180, strength: 0.5 },
    [InteractionType.CHASE]: { distance: 220, strength: 0.25 },
    [InteractionType.LURE]: { distance: 120, strength: -0.18 }, // Negative = attraction
};

export function getInteraction(sourceType: CreatureType, targetType: CreatureType): InteractionType {
    const sourceInteractions = INTERACTION_MATRIX[sourceType];
    if (!sourceInteractions) return InteractionType.NONE;
    return sourceInteractions[targetType] || InteractionType.NONE;
}

export function applyPredatorPreyForce(
    creature: CreatureState,
    target: CreatureState,
    interaction: InteractionType
): { fx: number; fy: number } {
    const params = INTERACTION_PARAMS[interaction];
    if (params.strength === 0) return { fx: 0, fy: 0 };

    const dx = creature.x - target.x;
    const dy = creature.y - target.y;
    const distSq = dx * dx + dy * dy;
    const dist = Math.sqrt(distSq);

    if (dist > params.distance || dist < 0.001) return { fx: 0, fy: 0 };

    // Force magnitude: inverse linear falloff
    const normalizedDist = dist / params.distance;
    const magnitude = (1 - normalizedDist) * params.strength;

    // Direction: positive strength = repel, negative = attract
    const dirX = dx / dist;
    const dirY = dy / dist;

    return {
        fx: dirX * magnitude,
        fy: dirY * magnitude,
    };
}

// Pursuit prediction for predators (sharks, turtles)
export function predictTargetPosition(
    predator: CreatureState,
    prey: CreatureState,
    predatorSpeed: number = 3.0
): { x: number; y: number } {
    const dx = prey.x - predator.x;
    const dy = prey.y - predator.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Estimate time to intercept based on predator max speed
    const T = dist / predatorSpeed;

    // Predict where prey will be (with 80% accuracy to allow some escape)
    return {
        x: prey.x + prey.vx * T * 0.8,
        y: prey.y + prey.vy * T * 0.8,
    };
}

// Calculate steering force toward a target position
export function seekTarget(
    creature: CreatureState,
    targetX: number,
    targetY: number,
    maxSpeed: number,
    weight: number = 1.0
): { fx: number; fy: number } {
    const dx = targetX - creature.x;
    const dy = targetY - creature.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 0.001) return { fx: 0, fy: 0 };

    // Desired velocity toward target
    const desiredVx = (dx / dist) * maxSpeed;
    const desiredVy = (dy / dist) * maxSpeed;

    // Steering = desired - current
    return {
        fx: (desiredVx - creature.vx) * weight,
        fy: (desiredVy - creature.vy) * weight,
    };
}

// Calculate fleeing force away from a threat
export function fleeFrom(
    creature: CreatureState,
    threatX: number,
    threatY: number,
    fleeRadius: number,
    maxSpeed: number,
    weight: number = 1.0
): { fx: number; fy: number } {
    const dx = creature.x - threatX;
    const dy = creature.y - threatY;
    const distSq = dx * dx + dy * dy;

    if (distSq > fleeRadius * fleeRadius) return { fx: 0, fy: 0 };

    const dist = Math.sqrt(distSq);
    if (dist < 0.001) {
        // If exactly at threat position, flee in random direction
        const angle = Math.random() * Math.PI * 2;
        return {
            fx: Math.cos(angle) * maxSpeed * weight,
            fy: Math.sin(angle) * maxSpeed * weight,
        };
    }

    // Flee strength increases as distance decreases
    const urgency = 1 - dist / fleeRadius;
    const fleeVx = (dx / dist) * maxSpeed * urgency;
    const fleeVy = (dy / dist) * maxSpeed * urgency;

    return {
        fx: (fleeVx - creature.vx) * weight,
        fy: (fleeVy - creature.vy) * weight,
    };
}

// Check if a predator should initiate a lunge attack
export function shouldLunge(
    predator: CreatureState,
    prey: CreatureState,
    lungeRange: number = 50
): boolean {
    const dx = prey.x - predator.x;
    const dy = prey.y - predator.y;
    const distSq = dx * dx + dy * dy;

    return distSq < lungeRange * lungeRange;
}

// Calculate combined forces from multiple nearby creatures
export function calculateCombinedForces(
    creature: CreatureState,
    nearbyCreatures: CreatureState[],
    nearbyIndices: number[]
): { fx: number; fy: number } {
    let totalFx = 0;
    let totalFy = 0;

    for (let i = 0; i < nearbyCreatures.length; i++) {
        const target = nearbyCreatures[i];
        if (nearbyIndices[i] === -1) continue; // Skip self

        const interaction = getInteraction(creature.creatureType, target.creatureType);
        const force = applyPredatorPreyForce(creature, target, interaction);

        totalFx += force.fx;
        totalFy += force.fy;
    }

    return { fx: totalFx, fy: totalFy };
}
