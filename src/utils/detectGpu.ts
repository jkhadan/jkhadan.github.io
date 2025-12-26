import { getGPUTier } from 'detect-gpu';

export type GpuTier = 0 | 1 | 2 | 3;

export interface QualitySettings {
    fishCount: number;
    resolution: number; // 1 = full, 0.5 = half
    enableAdvancedEffects: boolean; // bloom, caustics
    enableShadows: boolean;
}

const QUALITY_PRESETS: Record<GpuTier, QualitySettings> = {
    3: { // High End (RTX 3080, M2)
        fishCount: 500,
        resolution: 1,
        enableAdvancedEffects: true,
        enableShadows: true,
    },
    2: { // Mid Range (GTX 1060, iPhone 14)
        fishCount: 300,
        resolution: 1,
        enableAdvancedEffects: true,
        enableShadows: false,
    },
    1: { // Low End (Integrated Graphics)
        fishCount: 100,
        resolution: 0.75,
        enableAdvancedEffects: false,
        enableShadows: false,
    },
    0: { // Fallback / Very Old
        fishCount: 30,
        resolution: 0.5,
        enableAdvancedEffects: false,
        enableShadows: false,
    }
};

let cachedTier: GpuTier | null = null;

export const detectGpuTier = async (): Promise<GpuTier> => {
    if (cachedTier !== null) return cachedTier;

    try {
        const tierResult = await getGPUTier();
        // detect-gpu returns tier as number 0-3
        const tier = (tierResult.tier !== undefined ? tierResult.tier : 1) as GpuTier;
        // Cap at 3, min 0
        cachedTier = Math.max(0, Math.min(3, tier)) as GpuTier;
    } catch (e) {
        console.warn('GPU detection failed, defaulting to Tier 1', e);
        cachedTier = 1;
    }

    return cachedTier;
};

export const getQualitySettings = (tier: GpuTier): QualitySettings => {
    return QUALITY_PRESETS[tier];
};
