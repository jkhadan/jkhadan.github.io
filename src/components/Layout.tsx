import React from 'react';
import { PixiStage } from '../rendering/PixiStage';
import { useReducedMotion } from '../accessibility/ReducedMotion';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const reducedMotion = useReducedMotion();

    return (
        <>
            <div style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
                {/* Static fallback if reduced motion, or always render Pixi logic which handles it? 
             Plan says "Reduced motion mode replaces entire animated system with single beautiful static underwater image." */}
                {reducedMotion ? (
                    <div style={{
                        width: '100%', height: '100%',
                        background: 'url(/static-underwater.jpg) center/cover no-repeat', // Need this asset or gradient fallback
                        backgroundColor: '#0B132B'
                    }} />
                ) : (
                    <PixiStage />
                )}
            </div>

            {/* Content Overlay */}
            <main style={{ position: 'relative', zIndex: 1 }}>
                {children}
            </main>

            {/* Global Vignette/Scrim if needed */}
            <div style={{
                position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2,
                background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0, 6, 15, 0.6) 100%)'
            }} />
        </>
    );
};
