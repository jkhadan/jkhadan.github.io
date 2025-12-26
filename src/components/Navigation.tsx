import React, { useState, useEffect, useRef } from 'react';

interface NavigationProps {
    onOpenAllProjects: () => void;
}

const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'clubs', label: 'Involvement' },
    { id: 'contact', label: 'Contact' },
];

const NAV_HEIGHT = 64;

export const Navigation: React.FC<NavigationProps> = ({ onOpenAllProjects }) => {
    const [scrolled, setScrolled] = useState(false);
    const [active, setActive] = useState('hero');
    const [menuOpen, setMenuOpen] = useState(false);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;

                    // Only update scrolled state with some hysteresis to prevent flickering
                    if (currentScrollY > 80) {
                        setScrolled(true);
                    } else if (currentScrollY < 30) {
                        setScrolled(false);
                    }

                    // Scrollspy logic with viewport-relative threshold
                    const threshold = Math.min(150, window.innerHeight * 0.2);
                    let current = 'hero';
                    for (const section of sections) {
                        const el = document.getElementById(section.id);
                        if (el) {
                            const rect = el.getBoundingClientRect();
                            if (rect.top <= threshold && rect.bottom > threshold) {
                                current = section.id;
                            }
                        }
                    }
                    setActive(current);

                    lastScrollY.current = currentScrollY;
                    ticking.current = false;
                });
                ticking.current = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setMenuOpen(false);
    };

    const handleNavClick = (id: string) => {
        if (id === 'all-projects') {
            onOpenAllProjects();
            setMenuOpen(false);
        } else {
            scrollTo(id);
        }
    };

    // All navigation items including the modal trigger
    const allNavItems = [
        ...sections,
        { id: 'all-projects', label: 'All Work' }
    ];

    return (
        <>
            <style>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @media (max-width: 900px) {
                    .nav-links {
                        display: none !important;
                    }
                    .mobile-menu-btn {
                        display: flex !important;
                    }
                }
            `}</style>
            
            <nav
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: NAV_HEIGHT,
                    background: scrolled
                        ? 'rgba(11, 19, 43, 0.95)'
                        : 'linear-gradient(to bottom, rgba(11, 19, 43, 0.8), transparent)',
                    backdropFilter: scrolled ? 'blur(12px)' : 'none',
                    WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
                    transition: 'background 0.3s ease, backdrop-filter 0.3s ease',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: scrolled ? '1px solid rgba(91, 192, 190, 0.1)' : 'none',
                    boxSizing: 'border-box'
                }}
            >
                {/* Logo */}
                <button
                    onClick={() => scrollTo('hero')}
                    style={{
                        position: 'absolute',
                        left: 24,
                        background: 'none',
                        border: 'none',
                        color: '#6FFFE9',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        letterSpacing: '0.05em'
                    }}
                >
                    JK
                </button>

                {/* Desktop Navigation Links */}
                <ul 
                    className="nav-links"
                    style={{ 
                        display: 'flex', 
                        gap: 32, 
                        listStyle: 'none', 
                        padding: 0, 
                        margin: 0 
                    }}
                >
                    {allNavItems.map(s => (
                        <li key={s.id}>
                            <button
                                onClick={() => handleNavClick(s.id)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '0.85rem',
                                    color: active === s.id ? '#6FFFE9' : 'rgba(255, 255, 255, 0.6)',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    padding: '8px 0',
                                    position: 'relative',
                                    transition: 'color 0.3s ease',
                                    fontWeight: active === s.id ? 600 : 400
                                }}
                                onMouseEnter={(e) => {
                                    if (active !== s.id) {
                                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (active !== s.id) {
                                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                                    }
                                }}
                            >
                                {s.label}
                                {active === s.id && (
                                    <span style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: 2,
                                        background: 'linear-gradient(90deg, transparent, #6FFFE9, transparent)',
                                        borderRadius: 1
                                    }} />
                                )}
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{
                        display: 'none',
                        position: 'absolute',
                        right: 24,
                        width: 40,
                        height: 40,
                        background: 'rgba(91, 192, 190, 0.1)',
                        border: '1px solid rgba(91, 192, 190, 0.2)',
                        borderRadius: 8,
                        cursor: 'pointer',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: 4
                    }}
                >
                    <span style={{
                        width: 18,
                        height: 2,
                        background: '#6FFFE9',
                        borderRadius: 1,
                        transition: 'all 0.3s ease',
                        transform: menuOpen ? 'rotate(45deg) translateY(6px)' : 'none'
                    }} />
                    <span style={{
                        width: 18,
                        height: 2,
                        background: '#6FFFE9',
                        borderRadius: 1,
                        opacity: menuOpen ? 0 : 1,
                        transition: 'all 0.3s ease'
                    }} />
                    <span style={{
                        width: 18,
                        height: 2,
                        background: '#6FFFE9',
                        borderRadius: 1,
                        transition: 'all 0.3s ease',
                        transform: menuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none'
                    }} />
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            {menuOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: NAV_HEIGHT,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(11, 19, 43, 0.98)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        zIndex: 999,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        paddingTop: 40,
                        gap: 8,
                        animation: 'slideDown 0.3s ease-out',
                        overflowY: 'auto'
                    }}
                    onClick={() => setMenuOpen(false)}
                >
                    {allNavItems.map((s, i) => (
                        <button
                            key={s.id}
                            onClick={() => handleNavClick(s.id)}
                            style={{
                                background: active === s.id ? 'rgba(91, 192, 190, 0.15)' : 'none',
                                border: 'none',
                                borderRadius: 8,
                                fontSize: '1rem',
                                color: active === s.id ? '#6FFFE9' : 'rgba(255, 255, 255, 0.7)',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                padding: '14px 32px',
                                fontWeight: active === s.id ? 600 : 400,
                                animation: `slideDown 0.3s ease-out ${i * 0.03}s both`,
                                width: '80%',
                                maxWidth: 300,
                                textAlign: 'center'
                            }}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            )}
        </>
    );
};

export default Navigation;