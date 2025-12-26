import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useObstacle } from '../utils/domObstacles';
import { FaGithub, FaLinkedin, FaEnvelope, FaChevronDown } from 'react-icons/fa';
import { heroTitles, heroTagline, heroName, heroHeadshot, heroSocialLinks, heroCta } from '../data/hero';

const iconMap: Record<string, React.ReactNode> = {
    'FaGithub': <FaGithub />,
    'FaLinkedin': <FaLinkedin />,
    'FaEnvelope': <FaEnvelope />
};

export const Hero: React.FC = () => {
    const titleRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const headshotRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
    const [bubbleState, setBubbleState] = useState<'forming' | 'stable' | 'popping'>('forming');

    useObstacle('hero-title', titleRef);
    useObstacle('hero-cta', ctaRef);
    useObstacle('hero-headshot', headshotRef);

    useEffect(() => {
        // Trigger entrance animation
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Title cycling logic
    const cycleTitle = useCallback(() => {
        setBubbleState('popping');

        setTimeout(() => {
            setCurrentTitleIndex((prev) => (prev + 1) % heroTitles.length);
            setBubbleState('forming');
            
            setTimeout(() => {
                setBubbleState('stable');
            }, 600);
        }, 400);
    }, []);

    useEffect(() => {
        // Initial stabilization
        const initialTimer = setTimeout(() => {
            setBubbleState('stable');
        }, 800);

        // Cycling interval
        const interval = setInterval(cycleTitle, 4000);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    }, [cycleTitle]);

    const scrollToSection = () => {
        document.getElementById(heroCta.targetSection)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section
            id="hero"
            style={{
                minHeight: '100dvh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: 'clamp(60px, 10vw, 80px) 16px clamp(80px, 15vw, 120px)',
                position: 'relative',
                boxSizing: 'border-box',
                overflow: 'hidden'
            }}
        >
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 1; }
                }
                @keyframes gentleBob {
                    0%, 100% { 
                        transform: translateY(0) scale(1);
                    }
                    25% { 
                        transform: translateY(-3px) scale(1.01);
                    }
                    50% { 
                        transform: translateY(-5px) scale(1.02);
                    }
                    75% { 
                        transform: translateY(-2px) scale(1.01);
                    }
                }
                @keyframes bubbleForm {
                    0% {
                        opacity: 0;
                        transform: scale(0.3) translateY(20px);
                        filter: blur(8px);
                    }
                    50% {
                        opacity: 0.8;
                        transform: scale(1.1) translateY(-5px);
                        filter: blur(2px);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                        filter: blur(0px);
                    }
                }
                @keyframes bubblePop {
                    0% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    30% {
                        opacity: 0.9;
                        transform: scale(1.15);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(1.5);
                        filter: blur(10px);
                    }
                }
                @keyframes bubbleWobble {
                    0%, 100% { 
                        transform: translateY(0) rotate(-0.5deg);
                        border-radius: 50px 52px 48px 50px;
                    }
                    25% { 
                        transform: translateY(-2px) rotate(0.3deg);
                        border-radius: 52px 48px 50px 52px;
                    }
                    50% { 
                        transform: translateY(-4px) rotate(-0.3deg);
                        border-radius: 48px 50px 52px 48px;
                    }
                    75% { 
                        transform: translateY(-1px) rotate(0.5deg);
                        border-radius: 50px 52px 50px 48px;
                    }
                }
                @keyframes bubbleShine {
                    0%, 100% {
                        background-position: -100% 0%;
                    }
                    50% {
                        background-position: 200% 0%;
                    }
                }
                @keyframes headshotFloat {
                    0%, 100% { 
                        transform: translateY(0);
                        box-shadow: 0 8px 30px rgba(91, 192, 190, 0.3), 0 0 60px rgba(91, 192, 190, 0.15);
                    }
                    50% { 
                        transform: translateY(-8px);
                        box-shadow: 0 16px 40px rgba(91, 192, 190, 0.4), 0 0 80px rgba(91, 192, 190, 0.2);
                    }
                }
                @keyframes ripple {
                    0% {
                        transform: scale(1);
                        opacity: 0.4;
                    }
                    100% {
                        transform: scale(1.5);
                        opacity: 0;
                    }
                }
                .headshot-container::before {
                    content: '';
                    position: absolute;
                    inset: -4px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #5BC0BE 0%, #6FFFE9 50%, #5BC0BE 100%);
                    background-size: 200% 200%;
                    animation: shimmer 3s ease-in-out infinite;
                    z-index: -1;
                }
                .headshot-container::after {
                    content: '';
                    position: absolute;
                    inset: -8px;
                    border-radius: 50%;
                    border: 2px solid rgba(91, 192, 190, 0.3);
                    animation: ripple 3s ease-out infinite;
                }
                .bubble-title-container {
                    position: relative;
                    display: inline-block;
                    padding: clamp(8px, 2vw, 12px) clamp(16px, 4vw, 32px);
                    background: linear-gradient(135deg,
                        rgba(91, 192, 190, 0.15) 0%,
                        rgba(111, 255, 233, 0.1) 50%,
                        rgba(91, 192, 190, 0.15) 100%
                    );
                    border: 1px solid rgba(91, 192, 190, 0.3);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    overflow: hidden;
                    max-width: 90vw;
                }
                .bubble-title-container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 50%;
                    height: 100%;
                    background: linear-gradient(90deg, 
                        transparent, 
                        rgba(255, 255, 255, 0.1), 
                        transparent
                    );
                    animation: bubbleShine 4s ease-in-out infinite;
                }
                .bubble-title-container::after {
                    content: '';
                    position: absolute;
                    top: 4px;
                    left: 15%;
                    width: 70%;
                    height: 6px;
                    background: linear-gradient(90deg, 
                        transparent 0%, 
                        rgba(255, 255, 255, 0.2) 50%, 
                        transparent 100%
                    );
                    border-radius: 50%;
                    filter: blur(1px);
                }
            `}</style>

            {/* Decorative elements - hidden on mobile to prevent overflow */}
            <div style={{
                position: 'absolute',
                width: 'min(400px, 80vw)',
                height: 'min(400px, 80vw)',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(91, 192, 190, 0.08) 0%, transparent 70%)',
                top: '20%',
                left: '10%',
                pointerEvents: 'none',
                animation: 'float 6s ease-in-out infinite'
            }} />
            <div style={{
                position: 'absolute',
                width: 'min(300px, 60vw)',
                height: 'min(300px, 60vw)',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(111, 255, 233, 0.05) 0%, transparent 70%)',
                bottom: '20%',
                right: '15%',
                pointerEvents: 'none',
                animation: 'float 8s ease-in-out infinite reverse'
            }} />

            {/* Main content */}
            <div
                ref={titleRef}
                style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                    transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                {/* Headshot */}
                <div
                    ref={headshotRef}
                    className="headshot-container"
                    style={{
                        width: 'clamp(120px, 25vw, 160px)',
                        height: 'clamp(120px, 25vw, 160px)',
                        borderRadius: '50%',
                        marginBottom: 'clamp(20px, 4vw, 32px)',
                        position: 'relative',
                        animation: isVisible ? 'headshotFloat 4s ease-in-out infinite' : 'none',
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s'
                    }}
                >
                    {/* Headshot image - replace src with your actual headshot path */}
                    <div style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(91, 192, 190, 0.3) 0%, rgba(11, 19, 43, 0.9) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        border: '3px solid rgba(91, 192, 190, 0.5)'
                    }}>
                        <img
                            src={heroHeadshot.src}
                            alt={heroHeadshot.alt}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '50%'
                            }}
                            onError={(e) => {
                                // Fallback to initials if image fails to load
                                e.currentTarget.style.display = 'none';
                                if (e.currentTarget.parentElement) {
                                    e.currentTarget.parentElement.innerHTML = `
                                        <span style="font-size: 3rem; font-weight: 700; color: #6FFFE9; letter-spacing: 0.1em;">${heroHeadshot.fallbackInitials}</span>
                                    `;
                                }
                            }}
                        />
                    </div>
                    
                    {/* Bubble decorations around headshot */}
                    <div style={{
                        position: 'absolute',
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(91, 192, 190, 0.3))',
                        top: 10,
                        right: 10,
                        animation: 'float 3s ease-in-out infinite'
                    }} />
                    <div style={{
                        position: 'absolute',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.7), rgba(91, 192, 190, 0.2))',
                        bottom: 20,
                        left: 5,
                        animation: 'float 4s ease-in-out infinite 0.5s'
                    }} />
                    <div style={{
                        position: 'absolute',
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), rgba(91, 192, 190, 0.2))',
                        top: '50%',
                        right: -5,
                        animation: 'float 3.5s ease-in-out infinite 1s'
                    }} />
                </div>

                {/* Name */}
                <h1 style={{
                    fontSize: 'clamp(3rem, 10vw, 5rem)',
                    fontWeight: 700,
                    margin: '0 0 24px',
                    background: 'linear-gradient(180deg, #9BEFF6 0%, #004E7C 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: 'none',
                    letterSpacing: '-0.02em'
                }}>
                    {heroName}
                </h1>

                {/* Animated Bubble Title */}
                <div
                    className="bubble-title-container"
                    style={{
                        animation: bubbleState === 'forming' 
                            ? 'bubbleForm 0.6s ease-out forwards'
                            : bubbleState === 'popping'
                            ? 'bubblePop 0.4s ease-in forwards'
                            : 'bubbleWobble 4s ease-in-out infinite',
                        marginBottom: 32,
                        borderRadius: '50px',
                        opacity: isVisible ? 1 : 0,
                        transition: bubbleState === 'stable' ? 'none' : 'opacity 0.3s ease'
                    }}
                >
                    <p style={{
                        fontSize: 'clamp(0.75rem, 2.5vw, 1.1rem)',
                        letterSpacing: 'clamp(0.1em, 1vw, 0.2em)',
                        color: '#2D7A78',
                        margin: 0,
                        textTransform: 'uppercase',
                        fontWeight: 500,
                        textAlign: 'center'
                    }}>
                        {heroTitles[currentTitleIndex]}
                    </p>
                </div>

                {/* Tagline */}
                <p style={{
                    fontSize: '1.1rem',
                    maxWidth: 600,
                    margin: '0 auto 40px',
                    color: '#2D7A78',
                    lineHeight: 1.6,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s'
                }}>
                    {heroTagline.line1}
                    {' '}{heroTagline.line2}
                </p>
            </div>

            {/* CTA and Social Links */}
            <div
                ref={ctaRef}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 32,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s'
                }}
            >
                {/* Primary CTA */}
                <button
                    onClick={scrollToSection}
                    style={{
                        padding: '16px 40px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#2D7A78',
                        background: 'linear-gradient(135deg, #5BC0BE 0%, #6FFFE9 100%)',
                        border: 'none',
                        borderRadius: 30,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 20px rgba(91, 192, 190, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(91, 192, 190, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(91, 192, 190, 0.3)';
                    }}
                >
                    {heroCta.text}
                </button>

                {/* Social Links */}
                <div style={{
                    display: 'flex',
                    gap: 16
                }}>
                    {heroSocialLinks.map((social, i) => (
                        <a
                            key={i}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.label}
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'rgba(91, 192, 190, 0.1)',
                                border: '1px solid rgba(91, 192, 190, 0.2)',
                                color: '#2D7A78',
                                fontSize: '1.2rem',
                                transition: 'all 0.3s ease',
                                textDecoration: 'none'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(91, 192, 190, 0.2)';
                                e.currentTarget.style.borderColor = 'rgba(91, 192, 190, 0.4)';
                                e.currentTarget.style.transform = 'translateY(-3px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(91, 192, 190, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(91, 192, 190, 0.2)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            {iconMap[social.iconKey]}
                        </a>
                    ))}
                </div>
            </div>

            {/* Scroll indicator - Stays in hero section */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 30,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    opacity: isVisible ? 0.6 : 0,
                    transition: 'opacity 0.8s ease 1s',
                    cursor: 'pointer',
                    animation: 'pulse 2s ease-in-out infinite'
                }}
                onClick={scrollToSection}
            >
                <span style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    color: '#000000ff'
                }}>
                    Scroll
                </span>
                <FaChevronDown style={{
                    color: '#000000ff',
                    animation: 'float 2s ease-in-out infinite'
                }} />
            </div>
        </section>
    );
};

export default Hero;