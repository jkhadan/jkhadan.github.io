import {
    CreatureState,
    CreatureType,
    BehaviorState,
    SimulationParams,
    CREATURE_PARAMS,
    DEPTH_ZONES,
    CREATURE_ALLOWED_ZONES,
    isFishType,
} from './types';
import { HeterogeneousSpatialGrid, GridEntity } from './heterogeneousSpatialGrid';
import { updateBehaviorState, applyZoneBoundaryForce, getDefaultBehaviorState } from './behaviorStates';
import { getInteraction, InteractionType, INTERACTION_PARAMS, seekTarget, fleeFrom } from './predatorPrey';
import { Obstacle } from '../utils/domObstacles';

// Tuned defaults
let params: SimulationParams = {
    width: 800,
    height: 600,
    fishCount: 100,
    visualRange: 75,
    protectedRange: 35,
    separationFactor: 0.45,
    alignmentFactor: 0.04,
    cohesionFactor: 0.005,
    maxSpeed: 2.5,
    minSpeed: 0.5,
    turnFactor: 0.1,
    mouseFleeRadius: 180,
    mouseFleeWeight: 1.25,
    mouseSpeedBoost: 5,
};

let creatures: CreatureState[] = [];
let grid: HeterogeneousSpatialGrid | null = null;
let obstacles: Obstacle[] = [];
let mouse = { x: -1000, y: -1000, active: false };
let paused = false;

// Output stride: 12 floats per creature
const OUTPUT_STRIDE = 12;

// Creature counts by type
let creatureCounts: Record<CreatureType, number> = {
    [CreatureType.FISH_DART]: 0,
    [CreatureType.FISH_TROPICAL]: 0,
    [CreatureType.FISH_SCHOOLING]: 0,
    [CreatureType.FISH_ANGEL]: 0,
    [CreatureType.JELLYFISH]: 0,
    [CreatureType.SEA_TURTLE]: 0,
    [CreatureType.SHARK]: 0,
    [CreatureType.OCTOPUS]: 0,
    [CreatureType.ANGLER_FISH]: 0,
};

// Track creature index ranges for efficient lookup
let creatureRanges: Record<CreatureType, { start: number; count: number }> = {} as any;

function init(config: {
    width: number;
    height: number;
    creatureCounts: Record<number, number>;
}) {
    params.width = config.width;
    params.height = config.height;

    // Store counts
    creatureCounts = config.creatureCounts as Record<CreatureType, number>;

    // Create spatial grid
    grid = new HeterogeneousSpatialGrid(params.width, params.height, params.visualRange);

    creatures = [];
    let currentIndex = 0;

    // Spawn creatures by type
    const typeOrder: CreatureType[] = [
        CreatureType.FISH_DART,
        CreatureType.FISH_TROPICAL,
        CreatureType.FISH_SCHOOLING,
        CreatureType.FISH_ANGEL,
        CreatureType.JELLYFISH,
        CreatureType.SEA_TURTLE,
        CreatureType.SHARK,
        CreatureType.OCTOPUS,
        CreatureType.ANGLER_FISH,
    ];

    for (const type of typeOrder) {
        const count = creatureCounts[type] || 0;
        creatureRanges[type] = { start: currentIndex, count };

        for (let i = 0; i < count; i++) {
            creatures.push(spawnCreature(type));
        }
        currentIndex += count;
    }

    // Start simulation loop
    setInterval(tick, 1000 / 60);
}

function spawnCreature(type: CreatureType): CreatureState {
    const creatureParams = CREATURE_PARAMS[type];

    // Determine spawn zone based on allowed zones
    const allowedZones = CREATURE_ALLOWED_ZONES[type] || ['ALL'];
    let minY = 0;
    let maxY = params.height;

    if (!allowedZones.includes('ALL')) {
        minY = params.height;
        maxY = 0;
        for (const zoneName of allowedZones) {
            const zone = DEPTH_ZONES[zoneName];
            if (zone) {
                minY = Math.min(minY, zone.min * params.height);
                maxY = Math.max(maxY, zone.max * params.height);
            }
        }
    }

    // Random position within allowed zone
    const x = Math.random() * params.width;
    const y = minY + Math.random() * (maxY - minY);

    // Random initial velocity
    const angle = Math.random() * Math.PI * 2;
    const speed = creatureParams.minSpeed + Math.random() * (creatureParams.maxSpeed - creatureParams.minSpeed) * 0.3;

    // Scale with variance
    const scale = creatureParams.baseScale + (Math.random() - 0.5) * 2 * creatureParams.scaleVariance;

    return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rotation: angle,
        animationPhase: Math.random() * Math.PI * 2,
        hue: Math.random(),
        scale,
        creatureType: type,
        behaviorState: getDefaultBehaviorState(type),
        stateTimer: 0,
        targetId: -1,
    };
}

function tick() {
    if (!grid || paused) return;

    const dt = 1 / 60;

    // Clear and rebuild spatial grid
    grid.clear();
    for (let i = 0; i < creatures.length; i++) {
        const c = creatures[i];
        grid.add(i, c.x, c.y, c.creatureType);
    }

    // Update all creatures
    for (let i = 0; i < creatures.length; i++) {
        const creature = creatures[i];
        const creatureParams = CREATURE_PARAMS[creature.creatureType];

        // Get nearby creatures
        const nearby = grid.queryNearby(creature.x, creature.y, creatureParams.visualRange);

        // Update behavior state
        const stateResult = updateBehaviorState(creature, i, nearby, obstacles, params.height, dt);
        creature.behaviorState = stateResult.newState;
        creature.targetId = stateResult.targetId;

        // Apply forces based on creature type
        if (isFishType(creature.creatureType)) {
            applyFishForces(creature, i, nearby);
        } else {
            applyCreatureForces(creature, i, nearby);
        }

        // Apply zone boundary forces
        const zoneForce = applyZoneBoundaryForce(creature, params.height);
        creature.vx += zoneForce.fx;
        creature.vy += zoneForce.fy;

        // Apply mouse flee (all creatures) with speed boost
        let isFleeingMouse = false;
        if (mouse.active) {
            const dx = creature.x - mouse.x;
            const dy = creature.y - mouse.y;
            const distSq = dx * dx + dy * dy;
            const fleeRadius = params.mouseFleeRadius * (isFishType(creature.creatureType) ? 1 : 1.5);

            if (distSq < fleeRadius * fleeRadius && distSq > 1) {
                isFleeingMouse = true;
                const dist = Math.sqrt(distSq);
                const fleeFactor = 1 - dist / fleeRadius;
                // Stronger flee force (2x multiplier)
                const force = fleeFactor * fleeFactor * params.mouseFleeWeight * 2.0;
                creature.vx += (dx / dist) * force;
                creature.vy += (dy / dist) * force;
            }
        }

        // Speed limits - allow higher speed when fleeing mouse
        const speed = Math.sqrt(creature.vx * creature.vx + creature.vy * creature.vy);
        const effectiveMaxSpeed = isFleeingMouse ? creatureParams.maxSpeed * 1.8 : creatureParams.maxSpeed;
        if (speed > effectiveMaxSpeed) {
            creature.vx = (creature.vx / speed) * effectiveMaxSpeed;
            creature.vy = (creature.vy / speed) * effectiveMaxSpeed;
        } else if (speed < creatureParams.minSpeed && speed > 0) {
            creature.vx = (creature.vx / speed) * creatureParams.minSpeed;
            creature.vy = (creature.vy / speed) * creatureParams.minSpeed;
        }

        // Update position
        creature.x += creature.vx;
        creature.y += creature.vy;

        // Screen wrapping
        const margin = 100;
        if (creature.x < -margin) creature.x = params.width + margin;
        if (creature.x > params.width + margin) creature.x = -margin;
        if (creature.y < -margin) creature.y = params.height + margin;
        if (creature.y > params.height + margin) creature.y = -margin;

        // Rotation (smooth interpolation with constraints for certain creatures)
        let targetAngle = Math.atan2(creature.vy, creature.vx);

        // Jellyfish should stay mostly upright (dome up, tentacles down)
        // Rotation of PI flips the texture so dome is at top
        if (creature.creatureType === CreatureType.JELLYFISH) {
            // Moderate tilt based on horizontal movement for more natural motion
            const horizontalBias = creature.vx * 0.4;
            targetAngle = Math.PI + horizontalBias;
        }

        // Angler fish should stay mostly horizontal, facing left or right based on movement
        if (creature.creatureType === CreatureType.ANGLER_FISH) {
            // Determine facing direction based on velocity
            const facingLeft = creature.vx < 0;
            const baseAngle = facingLeft ? Math.PI : 0;

            // Calculate vertical tilt from velocity, limit to ±30 degrees
            const verticalTilt = Math.atan2(creature.vy, Math.abs(creature.vx) + 0.01);
            const maxTilt = Math.PI / 6;
            const clampedTilt = Math.max(-maxTilt, Math.min(maxTilt, verticalTilt));

            targetAngle = baseAngle + (facingLeft ? -clampedTilt : clampedTilt);
        }

        let angleDiff = targetAngle - creature.rotation;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        creature.rotation += angleDiff * creatureParams.turnRate;

        // Gentle self-righting for angler fish (only when not fleeing mouse)
        if (creature.creatureType === CreatureType.ANGLER_FISH && !isFleeingMouse) {
            // Normalize rotation to [-PI, PI]
            while (creature.rotation > Math.PI) creature.rotation -= Math.PI * 2;
            while (creature.rotation < -Math.PI) creature.rotation += Math.PI * 2;

            // Determine desired horizontal angle based on movement direction
            const targetHorizontal = creature.vx < 0 ? Math.PI : 0;

            // Calculate difference to target horizontal
            let diff = targetHorizontal - creature.rotation;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;

            // Gently correct if significantly off (more than 60 degrees from target)
            if (Math.abs(diff) > Math.PI / 3) {
                creature.rotation += diff * 0.03; // Gentle correction toward horizontal
            }
        }

        // Animation phase
        const normalizedSpeed = speed / creatureParams.maxSpeed;
        creature.animationPhase += 0.1 + normalizedSpeed * 0.2;
    }

    // Create output buffer
    const outputBuffer = new Float32Array(creatures.length * OUTPUT_STRIDE);

    for (let i = 0; i < creatures.length; i++) {
        const c = creatures[i];
        const offset = i * OUTPUT_STRIDE;

        outputBuffer[offset + 0] = c.x;
        outputBuffer[offset + 1] = c.y;
        outputBuffer[offset + 2] = c.vx;
        outputBuffer[offset + 3] = c.vy;
        outputBuffer[offset + 4] = c.rotation;
        outputBuffer[offset + 5] = c.animationPhase;
        outputBuffer[offset + 6] = c.hue;
        outputBuffer[offset + 7] = c.scale;
        outputBuffer[offset + 8] = c.creatureType;
        outputBuffer[offset + 9] = c.behaviorState;
        outputBuffer[offset + 10] = c.stateTimer;
        outputBuffer[offset + 11] = c.targetId;
    }

    // Send to main thread
    self.postMessage(
        {
            type: 'update',
            buffer: outputBuffer,
            creatureRanges,
        },
        [outputBuffer.buffer] as any
    );
}

function applyFishForces(fish: CreatureState, index: number, nearby: GridEntity[]) {
    let sepX = 0, sepY = 0;
    let alignX = 0, alignY = 0;
    let cohX = 0, cohY = 0;
    let avgVX = 0, avgVY = 0;
    let avgX = 0, avgY = 0;
    let flockCount = 0;

    const effectiveProtectedRange = params.protectedRange * fish.scale;

    for (const neighbor of nearby) {
        if (neighbor.index === index) continue;

        const other = creatures[neighbor.index];
        const dx = fish.x - other.x;
        const dy = fish.y - other.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        // Check interaction type
        const interaction = getInteraction(fish.creatureType, other.creatureType);

        if (interaction === InteractionType.FLEE) {
            // Strong flee from predators
            const fleeParams = INTERACTION_PARAMS[InteractionType.FLEE];
            if (dist < fleeParams.distance && dist > 0.001) {
                const urgency = 1 - dist / fleeParams.distance;
                const fleeForce = urgency * urgency * fleeParams.strength;
                fish.vx += (dx / dist) * fleeForce;
                fish.vy += (dy / dist) * fleeForce;
            }
            continue;
        }

        if (interaction === InteractionType.LURE) {
            // Only attracted when angler is in IDLE state (attract mode)
            // Flee when angler is LUNGING or just finished lunging (COOLDOWN)
            if (other.behaviorState === BehaviorState.LUNGING || other.behaviorState === BehaviorState.COOLDOWN) {
                // Flee from lunging/cooldown angler
                const fleeRadius = 150;
                if (dist < fleeRadius && dist > 0.001) {
                    const urgency = 1 - dist / fleeRadius;
                    const fleeForce = urgency * urgency * 0.6; // Strong flee
                    fish.vx += (dx / dist) * fleeForce;
                    fish.vy += (dy / dist) * fleeForce;
                }
            } else if (other.behaviorState === BehaviorState.IDLE) {
                // Attracted to angler lure only in attract mode
                const lureParams = INTERACTION_PARAMS[InteractionType.LURE];
                if (dist < lureParams.distance && dist > 30) {
                    const attraction = (1 - dist / lureParams.distance) * Math.abs(lureParams.strength);
                    fish.vx -= (dx / dist) * attraction;
                    fish.vy -= (dy / dist) * attraction;
                }
            }
            continue;
        }

        if (interaction === InteractionType.AVOID) {
            // Avoid large creatures
            const avoidParams = INTERACTION_PARAMS[InteractionType.AVOID];
            if (dist < avoidParams.distance && dist > 0.001) {
                const avoidForce = (1 - dist / avoidParams.distance) * avoidParams.strength;
                fish.vx += (dx / dist) * avoidForce;
                fish.vy += (dy / dist) * avoidForce;
            }
            continue;
        }

        // For creatures with NONE interaction (like octopus), still apply collision avoidance
        if (interaction === InteractionType.NONE || interaction === InteractionType.SEPARATION) {
            const otherParams = CREATURE_PARAMS[other.creatureType];
            const collisionRange = (effectiveProtectedRange + otherParams.protectedRange * other.scale) * 0.5;
            if (dist < collisionRange && dist > 0.001) {
                const normalizedDist = dist / collisionRange;
                const collisionForce = Math.pow(1 - normalizedDist, 2) * 0.12;
                fish.vx += (dx / dist) * collisionForce;
                fish.vy += (dy / dist) * collisionForce;
            }
        }

        // Only flock with same species or similar fish
        if (!isFishType(other.creatureType)) continue;

        if (dist < params.visualRange) {
            // Separation
            const combinedProtectedRange = effectiveProtectedRange + params.protectedRange * other.scale * 0.5;
            if (dist < combinedProtectedRange && dist > 0.001) {
                const normalizedDist = dist / combinedProtectedRange;
                const forceMagnitude = Math.pow(1 - normalizedDist, 2);

                const criticalRange = combinedProtectedRange * 0.3;
                let emergencyBoost = 1.0;
                if (dist < criticalRange) {
                    emergencyBoost = 1.0 + 3.0 * Math.pow(1 - dist / criticalRange, 3);
                }

                const totalForce = forceMagnitude * emergencyBoost;
                sepX += (dx / dist) * totalForce;
                sepY += (dy / dist) * totalForce;
            }

            // Alignment & Cohesion
            avgVX += other.vx;
            avgVY += other.vy;
            avgX += other.x;
            avgY += other.y;
            flockCount++;
        }
    }

    // Apply separation
    fish.vx += sepX * params.separationFactor;
    fish.vy += sepY * params.separationFactor;

    // Apply alignment and cohesion
    if (flockCount > 0) {
        avgVX /= flockCount;
        avgVY /= flockCount;
        alignX = (avgVX - fish.vx) * params.alignmentFactor;
        alignY = (avgVY - fish.vy) * params.alignmentFactor;

        const cohesionDamping = flockCount > 10 ? 0.7 : 1.0;
        avgX /= flockCount;
        avgY /= flockCount;
        cohX = (avgX - fish.x) * params.cohesionFactor * cohesionDamping;
        cohY = (avgY - fish.y) * params.cohesionFactor * cohesionDamping;

        fish.vx += alignX + cohX;
        fish.vy += alignY + cohY;
    }

    // Obstacle avoidance
    for (const obs of obstacles) {
        const closestX = Math.max(obs.x, Math.min(fish.x, obs.x + obs.width));
        const closestY = Math.max(obs.y, Math.min(fish.y, obs.y + obs.height));
        const dx = fish.x - closestX;
        const dy = fish.y - closestY;
        const distSq = dx * dx + dy * dy;
        const buffer = 60;

        if (distSq < buffer * buffer) {
            const dist = Math.sqrt(distSq);
            const d = dist > 0.1 ? dist : 0.1;
            const strength = (1 - d / buffer) * 0.8;
            fish.vx += (dx / d) * strength;
            fish.vy += (dy / d) * strength;
        }
    }

    // Screen edge turning
    const margin = 100;
    if (fish.x < margin) fish.vx += params.turnFactor;
    if (fish.x > params.width - margin) fish.vx -= params.turnFactor;
    if (fish.y < margin) fish.vy += params.turnFactor;
    if (fish.y > params.height - margin) fish.vy -= params.turnFactor;
}

function applyCreatureForces(creature: CreatureState, index: number, nearby: GridEntity[]) {
    const creatureParams = CREATURE_PARAMS[creature.creatureType];

    // Apply behavior-specific forces
    switch (creature.behaviorState) {
        case BehaviorState.CHASING:
            if (creature.targetId >= 0 && creature.targetId < creatures.length) {
                const target = creatures[creature.targetId];
                // Pursuit with prediction
                const predictionTime = 0.5;
                const predictedX = target.x + target.vx * predictionTime;
                const predictedY = target.y + target.vy * predictionTime;

                const seek = seekTarget(creature, predictedX, predictedY, creatureParams.maxSpeed, 0.15);
                creature.vx += seek.fx;
                creature.vy += seek.fy;
            }
            break;

        case BehaviorState.FLEEING:
            if (creature.targetId >= 0 && creature.targetId < creatures.length) {
                const threat = creatures[creature.targetId];
                const flee = fleeFrom(creature, threat.x, threat.y, 200, creatureParams.maxSpeed, 0.2);
                creature.vx += flee.fx;
                creature.vy += flee.fy;
            }
            break;

        case BehaviorState.LUNGING:
            // Burst forward
            const lungeSpeed = creatureParams.maxSpeed * 2;
            creature.vx = Math.cos(creature.rotation) * lungeSpeed;
            creature.vy = Math.sin(creature.rotation) * lungeSpeed;
            break;

        case BehaviorState.RESTING:
            // Slow to a stop
            creature.vx *= 0.95;
            creature.vy *= 0.95;
            break;

        case BehaviorState.DRIFTING:
            // Jellyfish: gentle pulsing movement
            const pulsePhase = creature.animationPhase;
            const pulseForce = Math.sin(pulsePhase * 0.1) * 0.02;
            creature.vy -= pulseForce; // Slight upward drift
            creature.vx += (Math.random() - 0.5) * 0.01; // Random horizontal drift
            break;

        case BehaviorState.PATROLLING:
        case BehaviorState.WANDERING:
        default:
            // Random wandering with gentle turns
            if (Math.random() < 0.02) {
                const turnAmount = (Math.random() - 0.5) * 0.3;
                const currentAngle = Math.atan2(creature.vy, creature.vx);
                const newAngle = currentAngle + turnAmount;
                const currentSpeed = Math.sqrt(creature.vx * creature.vx + creature.vy * creature.vy);
                creature.vx = Math.cos(newAngle) * currentSpeed;
                creature.vy = Math.sin(newAngle) * currentSpeed;
            }
            break;
    }

    // Separation from ALL creatures (collision avoidance)
    for (const neighbor of nearby) {
        if (neighbor.index === index) continue;

        const other = creatures[neighbor.index];
        const dx = creature.x - other.x;
        const dy = creature.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Use combined protected range based on both creature sizes
        const otherParams = CREATURE_PARAMS[other.creatureType];
        const combinedRange = (creatureParams.protectedRange + otherParams.protectedRange) * 0.6;

        if (dist < combinedRange && dist > 0.001) {
            // Stronger separation force for closer distances
            const normalizedDist = dist / combinedRange;
            const force = Math.pow(1 - normalizedDist, 2) * 0.15;
            creature.vx += (dx / dist) * force;
            creature.vy += (dy / dist) * force;
        }
    }

    // Obstacle avoidance (less urgent than fish)
    for (const obs of obstacles) {
        const closestX = Math.max(obs.x, Math.min(creature.x, obs.x + obs.width));
        const closestY = Math.max(obs.y, Math.min(creature.y, obs.y + obs.height));
        const dx = creature.x - closestX;
        const dy = creature.y - closestY;
        const distSq = dx * dx + dy * dy;
        const buffer = 80;

        if (distSq < buffer * buffer) {
            const dist = Math.sqrt(distSq);
            const d = dist > 0.1 ? dist : 0.1;
            const strength = (1 - d / buffer) * 0.5;
            creature.vx += (dx / d) * strength;
            creature.vy += (dy / d) * strength;
        }
    }

    // Screen edge turning (gentler for large creatures)
    const margin = 150;
    const turnStrength = params.turnFactor * 0.5;
    if (creature.x < margin) creature.vx += turnStrength;
    if (creature.x > params.width - margin) creature.vx -= turnStrength;
    if (creature.y < margin) creature.vy += turnStrength;
    if (creature.y > params.height - margin) creature.vy -= turnStrength;
}

// Message handler
self.onmessage = (e: MessageEvent) => {
    const { type, payload } = e.data;

    switch (type) {
        case 'init':
            init(payload);
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
