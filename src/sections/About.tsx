import React, { useRef } from 'react';
import { useObstacle } from '../utils/domObstacles';
import { FaCode, FaCloud, FaGraduationCap, FaMapMarkerAlt } from 'react-icons/fa';
import { highlights, quickInfo, aboutIntro, lookingFor } from '../data/about';

const iconMap: Record<string, React.ReactNode> = {
    'FaCode': <FaCode />,
    'FaCloud': <FaCloud />,
    'FaGraduationCap': <FaGraduationCap />,
    'FaMapMarkerAlt': <FaMapMarkerAlt />
};

export const About: React.FC = () => {
    const cardRef = useRef<HTMLDivElement>(null);
    useObstacle('about-card', cardRef);

    return (
        <section id="about" style={{ padding: '100px 20px' }}>
            <h2 style={{
                textAlign: 'center',
                marginBottom: 60,
                fontSize: '2.5rem',
                background: 'linear-gradient(135deg, #E0F7FA 0%, #6FFFE9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                About Me
            </h2>

            <div
                ref={cardRef}
                className="glass-panel"
                style={{
                    maxWidth: 1000,
                    margin: '0 auto',
                    padding: 'clamp(24px, 5vw, 48px)',
                    borderRadius: 'clamp(16px, 3vw, 24px)',
                    background: 'linear-gradient(135deg, rgba(11, 19, 43, 0.85) 0%, rgba(20, 35, 65, 0.85) 100%)',
                    border: '1px solid rgba(91, 192, 190, 0.2)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Decorative glow */}
                <div style={{
                    position: 'absolute',
                    top: -100,
                    right: -100,
                    width: 300,
                    height: 300,
                    background: 'radial-gradient(circle, rgba(91, 192, 190, 0.1) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: -80,
                    left: -80,
                    width: 200,
                    height: 200,
                    background: 'radial-gradient(circle, rgba(111, 255, 233, 0.08) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }} />

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 32,
                    position: 'relative',
                    zIndex: 1
                }}>
                    {/* Main intro text */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
                        gap: 32,
                        alignItems: 'center'
                    }}>
                        <div>
                            <p style={{
                                fontSize: '1.1rem',
                                lineHeight: 1.8,
                                color: 'rgba(255, 255, 255, 0.85)',
                                marginBottom: 20
                            }}>
                                I'm a <span style={{ color: '#6FFFE9', fontWeight: 500 }}>{aboutIntro.title}</span> passionate
                                about building robust, scalable applications that solve real-world problems. Currently pursuing
                                Computer Science at Northeastern University, I combine academic rigor with hands-on industry experience.
                            </p>
                            <p style={{
                                fontSize: '1rem',
                                lineHeight: 1.8,
                                color: 'rgba(255, 255, 255, 0.75)'
                            }}>
                                {aboutIntro.secondParagraph}
                            </p>
                        </div>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12
                        }}>
                            {quickInfo.map((info, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    padding: '14px 20px',
                                    borderRadius: 12,
                                    background: 'rgba(91, 192, 190, 0.1)',
                                    border: '1px solid rgba(91, 192, 190, 0.2)'
                                }}>
                                    <span style={{ color: '#5BC0BE', fontSize: '1.1rem' }}>{iconMap[info.iconKey]}</span>
                                    <span style={{ color: '#E0F7FA' }}>{info.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Highlights */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
                        gap: 16,
                        marginTop: 16
                    }}>
                        {highlights.map((highlight, index) => (
                            <div
                                key={index}
                                style={{
                                    padding: 24,
                                    borderRadius: 16,
                                    background: 'rgba(91, 192, 190, 0.05)',
                                    border: '1px solid rgba(91, 192, 190, 0.15)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(91, 192, 190, 0.1)';
                                    e.currentTarget.style.borderColor = 'rgba(91, 192, 190, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(91, 192, 190, 0.05)';
                                    e.currentTarget.style.borderColor = 'rgba(91, 192, 190, 0.15)';
                                }}
                            >
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 12,
                                    background: 'rgba(91, 192, 190, 0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 16,
                                    color: '#6FFFE9',
                                    fontSize: '1.3rem'
                                }}>
                                    {iconMap[highlight.iconKey]}
                                </div>
                                <h3 style={{
                                    margin: '0 0 8px 0',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    color: '#E0F7FA'
                                }}>
                                    {highlight.title}
                                </h3>
                                <p style={{
                                    margin: 0,
                                    fontSize: '0.9rem',
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    lineHeight: 1.5
                                }}>
                                    {highlight.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* What I'm Looking For */}
                    <div style={{
                        marginTop: 16,
                        padding: 24,
                        borderRadius: 16,
                        background: 'linear-gradient(135deg, rgba(91, 192, 190, 0.1) 0%, rgba(111, 255, 233, 0.05) 100%)',
                        borderLeft: '4px solid #5BC0BE'
                    }}>
                        <h3 style={{
                            margin: '0 0 12px 0',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            color: '#5BC0BE'
                        }}>
                            {lookingFor.title}
                        </h3>
                        <p style={{
                            margin: 0,
                            fontSize: '0.95rem',
                            color: 'rgba(255, 255, 255, 0.8)',
                            lineHeight: 1.7
                        }}>
                            {lookingFor.content}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;