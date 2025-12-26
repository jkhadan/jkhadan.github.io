import React, { useState, useRef } from 'react';
import { useObstacle } from '../utils/domObstacles';
import { Modal } from '../components/Modal';
import { experiences, type Experience as ExperienceData } from '../data/experience';
import { techIconMap } from '../utils/techIcons';

const TimelineCard: React.FC<{
    experience: ExperienceData;
    index: number;
    onClick: () => void;
    isMobile: boolean;
}> = ({ experience, index, onClick, isMobile }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    useObstacle(`exp-${experience.id}`, cardRef);
    const isLeft = index % 2 === 0;

    // Mobile layout - simple vertical list
    if (isMobile) {
        return (
            <div
                onClick={onClick}
                style={{
                    display: 'flex',
                    marginBottom: 20,
                    cursor: 'pointer',
                    position: 'relative',
                    paddingLeft: 32
                }}
            >
                {/* Timeline Node */}
                <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 24,
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #5BC0BE, #6FFFE9)',
                    border: '2px solid #0B132B',
                    boxShadow: '0 0 12px rgba(91, 192, 190, 0.5)',
                    zIndex: 2
                }} />

                {/* Card */}
                <div
                    ref={cardRef}
                    className="glass-panel experience-card"
                    style={{
                        padding: 20,
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, rgba(11, 19, 43, 0.8) 0%, rgba(20, 35, 65, 0.8) 100%)',
                        border: '1px solid rgba(91, 192, 190, 0.2)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        width: '100%',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                        {/* Company Logo */}
                        <div style={{
                            width: 44,
                            height: 44,
                            borderRadius: 10,
                            background: 'rgba(255, 255, 255, 0.9)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            overflow: 'hidden'
                        }}>
                            <img
                                src={experience.logo}
                                alt={`${experience.company} logo`}
                                style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement!.innerHTML = `<span style="font-size: 18px; font-weight: bold; color: #0B132B">${experience.company.charAt(0)}</span>`;
                                }}
                            />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h3 style={{
                                margin: 0,
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                color: '#E0F7FA',
                                lineHeight: 1.3
                            }}>
                                {experience.position}
                            </h3>
                            <p style={{
                                margin: '2px 0 0',
                                fontSize: '0.85rem',
                                color: '#5BC0BE',
                                fontWeight: 500
                            }}>
                                {experience.company}
                            </p>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 8,
                        marginBottom: 10,
                        fontSize: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.6)'
                    }}>
                        <span>{experience.period}</span>
                        <span>•</span>
                        <span>{experience.location}</span>
                    </div>

                    <p style={{
                        margin: 0,
                        fontSize: '0.85rem',
                        color: 'rgba(255, 255, 255, 0.75)',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {experience.description}
                    </p>

                    {/* Preview Tech Tags */}
                    <div style={{
                        display: 'flex',
                        gap: 6,
                        marginTop: 12,
                        flexWrap: 'wrap'
                    }}>
                        {experience.details.technologies.slice(0, 3).map((tech, i) => (
                            <span key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                padding: '3px 8px',
                                borderRadius: 16,
                                background: 'rgba(91, 192, 190, 0.15)',
                                border: '1px solid rgba(91, 192, 190, 0.2)',
                                fontSize: '0.7rem',
                                color: '#6FFFE9'
                            }}>
                                {techIconMap[tech] && <span style={{ fontSize: '0.8rem' }}>{techIconMap[tech]}</span>}
                                {tech}
                            </span>
                        ))}
                        {experience.details.technologies.length > 3 && (
                            <span style={{
                                padding: '3px 8px',
                                borderRadius: 16,
                                background: 'rgba(91, 192, 190, 0.1)',
                                fontSize: '0.7rem',
                                color: 'rgba(111, 255, 233, 0.7)'
                            }}>
                                +{experience.details.technologies.length - 3}
                            </span>
                        )}
                    </div>

                    {/* Tap indicator */}
                    <div style={{
                        position: 'absolute',
                        bottom: 10,
                        right: 12,
                        fontSize: '0.7rem',
                        color: 'rgba(91, 192, 190, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                    }}>
                        <span>Tap for details</span>
                        <span>→</span>
                    </div>
                </div>
            </div>
        );
    }

    // Desktop layout - alternating timeline
    return (
        <div
            onClick={onClick}
            style={{
                display: 'flex',
                justifyContent: isLeft ? 'flex-end' : 'flex-start',
                paddingLeft: isLeft ? 0 : 'calc(50% + 40px)',
                paddingRight: isLeft ? 'calc(50% + 40px)' : 0,
                marginBottom: 40,
                cursor: 'pointer',
                position: 'relative'
            }}
        >
            {/* Timeline Node */}
            <div style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #5BC0BE, #6FFFE9)',
                border: '3px solid #0B132B',
                boxShadow: '0 0 20px rgba(91, 192, 190, 0.5)',
                zIndex: 2
            }} />

            {/* Card - this is the actual obstacle */}
            <div
                ref={cardRef}
                className="glass-panel experience-card"
                style={{
                    padding: 24,
                    borderRadius: 16,
                    background: 'linear-gradient(135deg, rgba(11, 19, 43, 0.8) 0%, rgba(20, 35, 65, 0.8) 100%)',
                    border: '1px solid rgba(91, 192, 190, 0.2)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    maxWidth: 450,
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(91, 192, 190, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(91, 192, 190, 0.4)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'rgba(91, 192, 190, 0.2)';
                }}
            >
                {/* Glow Effect */}
                <div style={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 100,
                    height: 100,
                    background: 'radial-gradient(circle, rgba(91, 192, 190, 0.15) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
                    {/* Company Logo */}
                    <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: 12,
                        background: 'rgba(255, 255, 255, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        overflow: 'hidden'
                    }}>
                        <img 
                            src={experience.logo} 
                            alt={`${experience.company} logo`}
                            style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML = `<span style="font-size: 24px; font-weight: bold; color: #0B132B">${experience.company.charAt(0)}</span>`;
                            }}
                        />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                            margin: 0,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            color: '#E0F7FA',
                            lineHeight: 1.3
                        }}>
                            {experience.position}
                        </h3>
                        <p style={{
                            margin: '4px 0 0',
                            fontSize: '0.95rem',
                            color: '#5BC0BE',
                            fontWeight: 500
                        }}>
                            {experience.company}
                        </p>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    gap: 16,
                    marginBottom: 12,
                    fontSize: '0.85rem',
                    color: 'rgba(255, 255, 255, 0.6)'
                }}>
                    <span>{experience.period}</span>
                    <span>•</span>
                    <span>{experience.location}</span>
                </div>

                <p style={{
                    margin: 0,
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 0.75)',
                    lineHeight: 1.5
                }}>
                    {experience.description}
                </p>

                {/* Preview Tech Tags */}
                <div style={{
                    display: 'flex',
                    gap: 8,
                    marginTop: 16,
                    flexWrap: 'wrap'
                }}>
                    {experience.details.technologies.slice(0, 4).map((tech, i) => (
                        <span key={i} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '4px 10px',
                            borderRadius: 20,
                            background: 'rgba(91, 192, 190, 0.15)',
                            border: '1px solid rgba(91, 192, 190, 0.2)',
                            fontSize: '0.75rem',
                            color: '#6FFFE9'
                        }}>
                            {techIconMap[tech] && <span style={{ fontSize: '0.9rem' }}>{techIconMap[tech]}</span>}
                            {tech}
                        </span>
                    ))}
                    {experience.details.technologies.length > 4 && (
                        <span style={{
                            padding: '4px 10px',
                            borderRadius: 20,
                            background: 'rgba(91, 192, 190, 0.1)',
                            fontSize: '0.75rem',
                            color: 'rgba(111, 255, 233, 0.7)'
                        }}>
                            +{experience.details.technologies.length - 4} more
                        </span>
                    )}
                </div>

                {/* Click indicator */}
                <div style={{
                    position: 'absolute',
                    bottom: 12,
                    right: 12,
                    fontSize: '0.75rem',
                    color: 'rgba(91, 192, 190, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                }}>
                    <span>View details</span>
                    <span>→</span>
                </div>
            </div>
        </div>
    );
};

export const Experience: React.FC = () => {
    const [selectedExperience, setSelectedExperience] = useState<ExperienceData | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    // Detect mobile viewport
    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <section id="experience" ref={sectionRef} style={{ padding: '100px 20px' }}>
            <h2 style={{
                textAlign: 'center',
                marginBottom: 60,
                fontSize: '2.5rem',
                background: 'linear-gradient(135deg, #E0F7FA 0%, #6FFFE9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: 'none'
            }}>
                Experience
            </h2>

            {/* Timeline Container */}
            <div style={{
                position: 'relative',
                maxWidth: isMobile ? 600 : 1200,
                margin: '0 auto'
            }}>
                {/* Timeline Line - left on mobile, center on desktop */}
                <div style={{
                    position: 'absolute',
                    left: isMobile ? 6 : '50%',
                    transform: isMobile ? 'none' : 'translateX(-50%)',
                    width: isMobile ? 2 : 3,
                    height: '100%',
                    background: 'linear-gradient(to bottom, rgba(91, 192, 190, 0.5) 0%, rgba(91, 192, 190, 0.1) 100%)',
                    borderRadius: 2
                }} />

                {experiences.map((exp, index) => (
                    <TimelineCard
                        key={exp.id}
                        experience={exp}
                        index={index}
                        onClick={() => setSelectedExperience(exp)}
                        isMobile={isMobile}
                    />
                ))}
            </div>

            {/* Experience Detail Modal */}
            <Modal
                isOpen={!!selectedExperience}
                onClose={() => setSelectedExperience(null)}
                title={selectedExperience?.position || ''}
                subtitle={selectedExperience?.company}
                size="lg"
                hideHeaderBar={true}
                centerSubtitle={true}
                headerIcon={
                    selectedExperience && (
                        <img
                            src={selectedExperience.logo}
                            alt=""
                            style={{ width: 40, height: 40, objectFit: 'contain' }}
                        />
                    )
                }
            >
                {selectedExperience && (
                    <div style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                        {/* Meta Info */}
                        <div style={{
                            display: 'flex',
                            gap: 24,
                            marginBottom: 24,
                            paddingBottom: 20,
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <div>
                                <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.85rem' }}>Period</span>
                                <p style={{ margin: '4px 0 0', color: '#6FFFE9' }}>{selectedExperience.period}</p>
                            </div>
                            <div>
                                <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.85rem' }}>Location</span>
                                <p style={{ margin: '4px 0 0', color: '#6FFFE9' }}>{selectedExperience.location}</p>
                            </div>
                        </div>

                        {/* Achievements - XYZ Style */}
                        <div style={{ marginBottom: 28 }}>
                            <h4 style={{ 
                                color: '#5BC0BE', 
                                margin: '0 0 16px 0',
                                fontSize: '1rem',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8
                            }}>
                                <span style={{ fontSize: '1.2rem' }}>🏆</span>
                                Key Achievements
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {selectedExperience.details.achievements.map((achievement, i) => (
                                    <div key={i} style={{
                                        padding: '12px 16px',
                                        background: 'rgba(91, 192, 190, 0.08)',
                                        borderLeft: '3px solid #5BC0BE',
                                        borderRadius: '0 8px 8px 0',
                                        fontSize: '0.9rem',
                                        lineHeight: 1.5
                                    }}>
                                        {achievement}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Responsibilities */}
                        <div style={{ marginBottom: 28 }}>
                            <h4 style={{ 
                                color: '#5BC0BE', 
                                margin: '0 0 16px 0',
                                fontSize: '1rem',
                                fontWeight: 600
                            }}>
                                Responsibilities
                            </h4>
                            <ul style={{
                                margin: 0,
                                paddingLeft: 20,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8
                            }}>
                                {selectedExperience.details.responsibilities.map((resp, i) => (
                                    <li key={i} style={{
                                        fontSize: '0.9rem',
                                        lineHeight: 1.5,
                                        color: 'rgba(255, 255, 255, 0.8)'
                                    }}>
                                        {resp}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Tech Stack */}
                        <div>
                            <h4 style={{ 
                                color: '#5BC0BE', 
                                margin: '0 0 16px 0',
                                fontSize: '1rem',
                                fontWeight: 600
                            }}>
                                Technologies Used
                            </h4>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 10
                            }}>
                                {selectedExperience.details.technologies.map((tech, i) => (
                                    <span key={i} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        padding: '8px 14px',
                                        borderRadius: 24,
                                        background: 'rgba(91, 192, 190, 0.15)',
                                        border: '1px solid rgba(91, 192, 190, 0.25)',
                                        fontSize: '0.85rem',
                                        color: '#E0F7FA'
                                    }}>
                                        {techIconMap[tech] && (
                                            <span style={{ fontSize: '1.1rem', color: '#6FFFE9' }}>
                                                {techIconMap[tech]}
                                            </span>
                                        )}
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Projects if any */}
                        {selectedExperience.details.projects && selectedExperience.details.projects.length > 0 && (
                            <div style={{ marginTop: 28 }}>
                                <h4 style={{ 
                                    color: '#5BC0BE', 
                                    margin: '0 0 16px 0',
                                    fontSize: '1rem',
                                    fontWeight: 600
                                }}>
                                    Notable Projects
                                </h4>
                                {selectedExperience.details.projects.map((project, i) => (
                                    <div key={i} style={{
                                        padding: '12px 16px',
                                        background: 'rgba(111, 255, 233, 0.05)',
                                        borderRadius: 8,
                                        fontSize: '0.9rem',
                                        lineHeight: 1.5
                                    }}>
                                        {project}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </section>
    );
};

export default Experience;