import React, { useRef } from 'react';
import { useObstacle } from '../utils/domObstacles';
import { FaEnvelope, FaLinkedin, FaGithub, FaMapMarkerAlt } from 'react-icons/fa';
import { contactMethods, contactLocation, contactIntro } from '../data/contact';

const iconMap: Record<string, React.ReactNode> = {
    'FaEnvelope': <FaEnvelope />,
    'FaLinkedin': <FaLinkedin />,
    'FaGithub': <FaGithub />,
    'FaMapMarkerAlt': <FaMapMarkerAlt />
};

export const Contact: React.FC = () => {
    const cardRef = useRef<HTMLDivElement>(null);
    useObstacle('contact-card', cardRef);

    return (
        <section 
            id="contact" 
            style={{ 
                padding: '100px 20px 150px',
                position: 'relative'
            }}
        >
            <style>{`
                @keyframes checkmark {
                    0% { transform: scale(0); opacity: 0; }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>

            {/* Decorative background elements */}
            <div style={{
                position: 'absolute',
                width: 'min(500px, 80vw)',
                height: 'min(500px, 80vw)',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(91, 192, 190, 0.06) 0%, transparent 70%)',
                top: '10%',
                left: '-10%',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                width: 'min(400px, 70vw)',
                height: 'min(400px, 70vw)',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(111, 255, 233, 0.04) 0%, transparent 70%)',
                bottom: '10%',
                right: '-5%',
                pointerEvents: 'none'
            }} />

            <h2 style={{
                textAlign: 'center',
                marginBottom: 20,
                fontSize: '2.5rem',
                background: 'linear-gradient(135deg, #E0F7FA 0%, #6FFFE9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                {contactIntro.title}
            </h2>

            <p style={{
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.6)',
                maxWidth: 600,
                margin: '0 auto 60px',
                fontSize: '1.05rem',
                lineHeight: 1.6
            }}>
                {contactIntro.subtitle}
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
                gap: 32,
                maxWidth: 1000,
                margin: '0 auto'
            }}>
                {/* Contact Information Card */}
                <div
                    ref={cardRef}
                    style={{
                        padding: 'clamp(24px, 5vw, 36px)',
                        borderRadius: 'clamp(16px, 3vw, 24px)',
                        background: 'linear-gradient(135deg, rgba(11, 19, 43, 0.85) 0%, rgba(20, 35, 65, 0.85) 100%)',
                        border: '1px solid rgba(91, 192, 190, 0.2)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)'
                    }}
                >
                    <h3 style={{
                        margin: '0 0 24px',
                        fontSize: '1.3rem',
                        color: '#E0F7FA',
                        fontWeight: 600
                    }}>
                        Let's Connect
                    </h3>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        marginBottom: 28,
                        padding: '16px 20px',
                        borderRadius: 12,
                        background: 'rgba(91, 192, 190, 0.08)',
                        border: '1px solid rgba(91, 192, 190, 0.15)'
                    }}>
                        <FaMapMarkerAlt style={{ color: '#5BC0BE', fontSize: '1.2rem' }} />
                        <div>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                                {contactLocation.label}
                            </p>
                            <p style={{ margin: 0, color: '#E0F7FA', fontWeight: 500 }}>
                                {contactLocation.value}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {contactMethods.map((method, i) => (
                            <a
                                key={i}
                                href={method.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 16,
                                    padding: '16px 20px',
                                    borderRadius: 12,
                                    background: 'rgba(91, 192, 190, 0.05)',
                                    border: '1px solid rgba(91, 192, 190, 0.15)',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(91, 192, 190, 0.12)';
                                    e.currentTarget.style.borderColor = 'rgba(91, 192, 190, 0.3)';
                                    e.currentTarget.style.transform = 'translateX(4px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(91, 192, 190, 0.05)';
                                    e.currentTarget.style.borderColor = 'rgba(91, 192, 190, 0.15)';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }}
                            >
                                <div style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 10,
                                    background: 'rgba(91, 192, 190, 0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#6FFFE9',
                                    fontSize: '1.2rem',
                                    flexShrink: 0
                                }}>
                                    {iconMap[method.iconKey]}
                                </div>
                                <div>
                                    <p style={{
                                        margin: 0,
                                        fontSize: '0.8rem',
                                        color: 'rgba(255, 255, 255, 0.5)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        {method.label}
                                    </p>
                                    <p style={{
                                        margin: '4px 0 0',
                                        color: '#E0F7FA',
                                        fontSize: '0.95rem'
                                    }}>
                                        {method.value}
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;