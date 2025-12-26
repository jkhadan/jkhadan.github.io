import { FishState, SimulationParams } from './types';
import { Obstacle } from '../utils/domObstacles';

export const applyForces = (
    fish: FishState,
    index: number,
    allFish: FishState[],
    neighbors: number[],
    mouse: { x: number; y: number; active: boolean },
    obstacles: Obstacle[],
    params: SimulationParams
) => {
    let avgVX = 0,
        avgVY = 0;
    let avgX = 0,
        avgY = 0;
    let count = 0;

    let sepX = 0,
        sepY = 0;
    let alignX = 0,
        alignY = 0;
    let cohX = 0,
        cohY = 0;

    // Scale-aware protected range: larger fish need more space
    const effectiveProtectedRange = params.protectedRange * fish.scale;

    for (const i of neighbors) {
        if (i === index) continue;

        const other = allFish[i];
        const dx = fish.x - other.x;
        const dy = fish.y - other.y;
        const distSq = dx * dx + dy * dy;

        // Combined protected range considering both fish sizes
        const combinedProtectedRange =
            effectiveProtectedRange + params.protectedRange * other.scale * 0.5;

        if (distSq < params.visualRange * params.visualRange) {
            const dist = Math.sqrt(distSq);

            // IMPROVED SEPARATION: Exponential force that ramps up sharply at close range
            if (dist < combinedProtectedRange && dist > 0.001) {
                // Normalized distance (0 = touching, 1 = at edge of protected range)
                const normalizedDist = dist / combinedProtectedRange;

                // Exponential falloff: force increases dramatically as fish get closer
                // Using (1 - normalizedDist)^2 for smooth but strong response
                const forceMagnitude = Math.pow(1 - normalizedDist, 2);

                // Additional strong push when VERY close (prevents overlap)
                const criticalRange = combinedProtectedRange * 0.3;
                let emergencyBoost = 1.0;
                if (dist < criticalRange) {
                    // Cubic ramp for emergency separation
                    emergencyBoost = 1.0 + 3.0 * Math.pow(1 - dist / criticalRange, 3);
                }

                const totalForce = forceMagnitude * emergencyBoost;
                sepX += (dx / dist) * totalForce;
                sepY += (dy / dist) * totalForce;
            }

            // Alignment & Cohesion accumulation
            avgVX += other.vx;
            avgVY += other.vy;
            avgX += other.x;
            avgY += other.y;
            count++;
        }
    }

    // Apply Flocking Forces
    if (count > 0) {
        // Alignment
        avgVX /= count;
        avgVY /= count;
        alignX = (avgVX - fish.vx) * params.alignmentFactor;
        alignY = (avgVY - fish.vy) * params.alignmentFactor;

        // Cohesion - slightly reduced when many neighbors to prevent bunching
        const cohesionDamping = count > 10 ? 0.7 : 1.0;
        avgX /= count;
        avgY /= count;
        cohX = (avgX - fish.x) * params.cohesionFactor * cohesionDamping;
        cohY = (avgY - fish.y) * params.cohesionFactor * cohesionDamping;
    }

    // Apply separation (scaled)
    sepX *= params.separationFactor;
    sepY *= params.separationFactor;

    fish.vx += sepX + alignX + cohX;
    fish.vy += sepY + alignY + cohY;

    // Track mouse proximity for speed boost
    let mouseProximityFactor = 0; // 0 = far away, 1 = very close

    // Mouse Repulsion with proximity tracking
    if (mouse.active) {
        const dx = fish.x - mouse.x;
        const dy = fish.y - mouse.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < params.mouseFleeRadius * params.mouseFleeRadius && distSq > 1) {
            const dist = Math.sqrt(distSq);

            // Calculate proximity factor (1 when at mouse, 0 at edge of flee radius)
            mouseProximityFactor = 1 - dist / params.mouseFleeRadius;

            // Flee force scales with proximity (quadratic for snappier response)
            const fleeFactor = mouseProximityFactor * mouseProximityFactor;
            const force = fleeFactor * params.mouseFleeWeight;

            fish.vx += (dx / dist) * force;
            fish.vy += (dy / dist) * force;
        }
    }

    // Obstacle Avoidance
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

    // Screen Edge Turning
    const margin = 100;
    if (fish.x < margin) fish.vx += params.turnFactor;
    if (fish.x > params.width - margin) fish.vx -= params.turnFactor;
    if (fish.y < margin) fish.vy += params.turnFactor;
    if (fish.y > params.height - margin) fish.vy -= params.turnFactor;

    // DYNAMIC SPEED LIMITS based on mouse proximity
    // When mouse is close, allow fish to swim faster (more panicked flee)
    const speedBoostMultiplier = 1 + mouseProximityFactor * (params.mouseSpeedBoost - 1);
    const effectiveMaxSpeed = params.maxSpeed * speedBoostMultiplier;
    const effectiveMinSpeed = params.minSpeed * (1 + mouseProximityFactor * 0.5); // Slight min speed boost too

    // Speed Limit with dynamic max
    const speed = Math.sqrt(fish.vx * fish.vx + fish.vy * fish.vy);
    if (speed > effectiveMaxSpeed) {
        fish.vx = (fish.vx / speed) * effectiveMaxSpeed;
        fish.vy = (fish.vy / speed) * effectiveMaxSpeed;
    } else if (speed < effectiveMinSpeed && speed > 0) {
        fish.vx = (fish.vx / speed) * effectiveMinSpeed;
        fish.vy = (fish.vy / speed) * effectiveMinSpeed;
    }

    // Update Position
    fish.x += fish.vx;
    fish.y += fish.vy;

    // Safety wrap
    if (fish.x < -100) fish.x = params.width + 100;
    if (fish.x > params.width + 100) fish.x = -100;
    if (fish.y < -100) fish.y = params.height + 100;
    if (fish.y > params.height + 100) fish.y = -100;

    // Rotation (smooth interpolation for more natural movement)
    const targetAngle = Math.atan2(fish.vy, fish.vx);

    // Simple angle interpolation (handles wraparound)
    let angleDiff = targetAngle - fish.rotation;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    // Faster rotation when fleeing mouse
    const rotationSpeed = 0.15 + mouseProximityFactor * 0.25;
    fish.rotation += angleDiff * rotationSpeed;

    // Animation Phase (faster tail wag when swimming fast or fleeing)
    const normalizedSpeed = speed / effectiveMaxSpeed;
    const panicWiggle = mouseProximityFactor * 0.15;
    fish.animationPhase += 0.1 + normalizedSpeed * 0.2 + panicWiggle;
};