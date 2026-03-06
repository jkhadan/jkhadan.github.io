import { GpuTier } from '../utils/detectGpu';
import { CreatureType } from '../simulation/types';

export interface CreatureCounts {
    [CreatureType.FISH_DART]: number;
    [CreatureType.FISH_TROPICAL]: number;
    [CreatureType.FISH_SCHOOLING]: number;
    [CreatureType.FISH_ANGEL]: number;
    [CreatureType.JELLYFISH]: number;
    [CreatureType.SEA_TURTLE]: number;
    [CreatureType.SHARK]: number;
    [CreatureType.OCTOPUS]: number;
    [CreatureType.ANGLER_FISH]: number;
}

// Fish are the main focus, other creatures are rare ambient additions
export const CREATURE_COUNTS: Record<GpuTier, CreatureCounts> = {
    0: {
        [CreatureType.FISH_DART]: 8,
        [CreatureType.FISH_TROPICAL]: 8,
        [CreatureType.FISH_SCHOOLING]: 10,
        [CreatureType.FISH_ANGEL]: 4,
        [CreatureType.JELLYFISH]: 2,
        [CreatureType.SEA_TURTLE]: 1,
        [CreatureType.SHARK]: 1,
        [CreatureType.OCTOPUS]: 0,
        [CreatureType.ANGLER_FISH]: 1,
    },
    1: {
        [CreatureType.FISH_DART]: 25,
        [CreatureType.FISH_TROPICAL]: 25,
        [CreatureType.FISH_SCHOOLING]: 35,
        [CreatureType.FISH_ANGEL]: 15,
        [CreatureType.JELLYFISH]: 3,
        [CreatureType.SEA_TURTLE]: 1,
        [CreatureType.SHARK]: 1,
        [CreatureType.OCTOPUS]: 1,
        [CreatureType.ANGLER_FISH]: 1,
    },
    2: {
        [CreatureType.FISH_DART]: 75,
        [CreatureType.FISH_TROPICAL]: 75,
        [CreatureType.FISH_SCHOOLING]: 100,
        [CreatureType.FISH_ANGEL]: 50,
        [CreatureType.JELLYFISH]: 5,
        [CreatureType.SEA_TURTLE]: 2,
        [CreatureType.SHARK]: 1,
        [CreatureType.OCTOPUS]: 2,
        [CreatureType.ANGLER_FISH]: 2,
    },
    3: {
        [CreatureType.FISH_DART]: 125,
        [CreatureType.FISH_TROPICAL]: 125,
        [CreatureType.FISH_SCHOOLING]: 175,
        [CreatureType.FISH_ANGEL]: 75,
        [CreatureType.JELLYFISH]: 8,
        [CreatureType.SEA_TURTLE]: 3,
        [CreatureType.SHARK]: 2,
        [CreatureType.OCTOPUS]: 3,
        [CreatureType.ANGLER_FISH]: 3,
    },
};

export const getCreatureCounts = (tier: GpuTier): CreatureCounts => {
    return CREATURE_COUNTS[tier];
};

export const getTotalCreatureCount = (tier: GpuTier): number => {
    const counts = CREATURE_COUNTS[tier];
    return Object.values(counts).reduce((a, b) => a + b, 0);
};

export const getFishOnlyCount = (tier: GpuTier): number => {
    const counts = CREATURE_COUNTS[tier];
    return (
        counts[CreatureType.FISH_DART] +
        counts[CreatureType.FISH_TROPICAL] +
        counts[CreatureType.FISH_SCHOOLING] +
        counts[CreatureType.FISH_ANGEL]
    );
};

// Get counts for a specific creature category
export const getCreatureCountByType = (tier: GpuTier, type: CreatureType): number => {
    return CREATURE_COUNTS[tier][type] ?? 0;
};
