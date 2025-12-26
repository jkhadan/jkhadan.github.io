import { useState, useEffect } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export const isReducedMotion = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(QUERY).matches;
};

export const useReducedMotion = (): boolean => {
    const [matches, setMatches] = useState(isReducedMotion());

    useEffect(() => {
        const mediaQuery = window.matchMedia(QUERY);
        const handleChange = (e: MediaQueryListEvent) => setMatches(e.matches);

        // Modern browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
        // Fallback for older browsers
        else {
            mediaQuery.addListener(handleChange);
            return () => mediaQuery.removeListener(handleChange);
        }
    }, []);

    return matches;
};
