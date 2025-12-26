import React, { useState, useRef } from 'react';
import { useObstacle } from '../utils/domObstacles';
import { Modal } from '../components/Modal';
import { FaGithub, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { featuredProjects, type Project } from '../data/projects';
import { techIconMap } from '../utils/techIcons';

interface ProjectsProps {
    onOpenAllProjects: () => void;
}

const TechCarousel: React.FC<{ icons: string[] }> = ({ icons }) => {
    const duplicatedIcons = [...icons, ...icons, ...icons];

    return (
        <div style={{
            overflow: 'hidden',
            width: '100%',
            height: 50,
            background: 'linear-gradient(90deg, rgba(11, 19, 43, 0.95) 0%, rgba(20, 35, 65, 0.6) 10%, rgba(20, 35, 65, 0.6) 90%, rgba(11, 19, 43, 0.95) 100%)',
            position: 'relative'
        }}>
            <style>{`
                @keyframes scrollTech {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.333%); }
                }
            `}</style>
            <div style={{
                display: 'flex',
                gap: 32,
                alignItems: 'center',
                height: '100%',
                animation: 'scrollTech 15s linear infinite',
                width: 'fit-content',
                paddingLeft: 20
            }}>
                {duplicatedIcons.map((icon, i) => (
                    <span key={i} style={{
                        fontSize: '1.5rem',
                        color: '#6FFFE9',
                        opacity: 0.8,
                        display: 'flex',
                        alignItems: 'center',
                        flexShrink: 0
                    }}>
                        {techIconMap[icon] || icon}
                    </span>
                ))}
            </div>
        </div>
    );
};

const ProjectCard: React.FC<{
    project: Project;
    onClick: () => void;
}> = ({ project, onClick }) => {
    const ref = useRef<HTMLDivElement>(null);
    useObstacle(`project-${project.id}`, ref);

    return (
        <div
            ref={ref}
            onClick={onClick}
            style={{
                cursor: 'pointer',
                borderRadius: 16,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(11, 19, 43, 0.9) 0%, rgba(20, 35, 65, 0.9) 100%)',
                border: '1px solid rgba(91, 192, 190, 0.2)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4), 0 0 40px rgba(91, 192, 190, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(91, 192, 190, 0.4)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(91, 192, 190, 0.2)';
            }}
        >
            {/* Tech Icon Carousel Banner */}
            <TechCarousel icons={project.icons} />

            {/* Card Content */}
            <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 8
                }}>
                    <span style={{
                        fontSize: '0.75rem',
                        padding: '4px 10px',
                        borderRadius: 12,
                        background: 'rgba(91, 192, 190, 0.2)',
                        color: '#5BC0BE',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        {project.category}
                    </span>
                </div>

                <h3 style={{
                    margin: '8px 0 12px',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#E0F7FA'
                }}>
                    {project.title}
                </h3>

                <p style={{
                    margin: 0,
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: 1.6,
                    flex: 1
                }}>
                    {project.description}
                </p>

                {/* Tags */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 6,
                    marginTop: 16
                }}>
                    {project.tags.slice(0, 5).map((tag, i) => (
                        <span key={i} style={{
                            fontSize: '0.7rem',
                            padding: '3px 8px',
                            borderRadius: 10,
                            background: 'rgba(111, 255, 233, 0.1)',
                            color: 'rgba(111, 255, 233, 0.8)',
                            border: '1px solid rgba(111, 255, 233, 0.15)'
                        }}>
                            {tag}
                        </span>
                    ))}
                </div>

                {/* View Details Indicator */}
                <div style={{
                    marginTop: 20,
                    paddingTop: 16,
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem',
                    color: '#5BC0BE'
                }}>
                    <span>View Details</span>
                    <span>→</span>
                </div>
            </div>
        </div>
    );
};

const ImageGallery: React.FC<{ images: string[] }> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (images.length === 0) return null;

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div style={{ marginBottom: 24 }}>
            <div style={{
                borderRadius: 12,
                overflow: 'hidden',
                background: 'rgba(0, 0, 0, 0.3)',
                marginBottom: 12,
                position: 'relative'
            }}>
                <img
                    src={images[currentIndex]}
                    alt={`Screenshot ${currentIndex + 1}`}
                    style={{
                        width: '100%',
                        height: 300,
                        objectFit: 'contain'
                    }}
                />
                {images.length > 1 && (
                    <>
                        <button
                            onClick={goToPrevious}
                            style={{
                                position: 'absolute',
                                left: 12,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                background: 'rgba(0, 0, 0, 0.5)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: '#E0F7FA',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(91, 192, 190, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
                            }}
                            aria-label="Previous image"
                        >
                            <FaChevronLeft />
                        </button>
                        <button
                            onClick={goToNext}
                            style={{
                                position: 'absolute',
                                right: 12,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                background: 'rgba(0, 0, 0, 0.5)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: '#E0F7FA',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(91, 192, 190, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
                            }}
                            aria-label="Next image"
                        >
                            <FaChevronRight />
                        </button>
                    </>
                )}
            </div>
            {images.length > 1 && (
                <div style={{
                    display: 'flex',
                    gap: 8,
                    justifyContent: 'center'
                }}>
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                border: 'none',
                                background: i === currentIndex ? '#6FFFE9' : 'rgba(255, 255, 255, 0.3)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export const Projects: React.FC<ProjectsProps> = ({ onOpenAllProjects }) => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const sectionRef = useRef<HTMLElement>(null);

    return (
        <section id="projects" ref={sectionRef} style={{ padding: '100px 20px' }}>
            <h2 style={{
                textAlign: 'center',
                marginBottom: 20,
                fontSize: '2.5rem',
                background: 'linear-gradient(135deg, #E0F7FA 0%, #6FFFE9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                Featured Projects
            </h2>

            <p style={{
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.6)',
                maxWidth: 600,
                margin: '0 auto 50px',
                fontSize: '1rem'
            }}>
                A selection of projects showcasing my expertise in full-stack development, cloud infrastructure, and AI integration.
            </p>

            {/* Featured Projects Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
                gap: 24,
                maxWidth: 1200,
                margin: '0 auto'
            }}>
                {featuredProjects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        onClick={() => setSelectedProject(project)}
                    />
                ))}
            </div>

            {/* View All Projects Button */}
            <div style={{
                textAlign: 'center',
                marginTop: 50
            }}>
                <button
                    onClick={onOpenAllProjects}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '14px 28px',
                        borderRadius: 30,
                        background: 'transparent',
                        border: '2px solid rgba(91, 192, 190, 0.5)',
                        color: '#6FFFE9',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(91, 192, 190, 0.15)';
                        e.currentTarget.style.borderColor = '#5BC0BE';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'rgba(91, 192, 190, 0.5)';
                    }}
                >
                    View All Projects
                    <span>→</span>
                </button>
            </div>

            {/* Project Detail Modal */}
            <Modal
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
                title={selectedProject?.title || ''}
                subtitle={selectedProject?.category}
                size="lg"
                hideHeaderBar={true}
            >
                {selectedProject && (
                    <div style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                        {/* Screenshot Gallery */}
                        {selectedProject.details.gallery.length > 0 && (
                            <ImageGallery images={selectedProject.details.gallery} />
                        )}

                        {/* Links */}
                        <div style={{
                            display: 'flex',
                            gap: 12,
                            marginBottom: 24
                        }}>
                            {selectedProject.link && selectedProject.link !== '#experience' && (
                                <a
                                    href={selectedProject.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        padding: '10px 20px',
                                        borderRadius: 8,
                                        background: 'rgba(91, 192, 190, 0.2)',
                                        border: '1px solid rgba(91, 192, 190, 0.3)',
                                        color: '#6FFFE9',
                                        textDecoration: 'none',
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <FaGithub /> View on GitHub
                                </a>
                            )}
                        </div>

                        {/* Challenge */}
                        <div style={{ marginBottom: 24 }}>
                            <h4 style={{
                                color: '#5BC0BE',
                                margin: '0 0 12px 0',
                                fontSize: '1rem',
                                fontWeight: 600
                            }}>
                                The Challenge
                            </h4>
                            <p style={{
                                margin: 0,
                                fontSize: '0.95rem',
                                lineHeight: 1.6,
                                color: 'rgba(255, 255, 255, 0.8)'
                            }}>
                                {selectedProject.details.challenge}
                            </p>
                        </div>

                        {/* Solution */}
                        <div style={{ marginBottom: 24 }}>
                            <h4 style={{
                                color: '#5BC0BE',
                                margin: '0 0 12px 0',
                                fontSize: '1rem',
                                fontWeight: 600
                            }}>
                                The Solution
                            </h4>
                            <p style={{
                                margin: 0,
                                fontSize: '0.95rem',
                                lineHeight: 1.6,
                                color: 'rgba(255, 255, 255, 0.8)'
                            }}>
                                {selectedProject.details.solution}
                            </p>
                        </div>

                        {/* Features */}
                        <div style={{ marginBottom: 24 }}>
                            <h4 style={{
                                color: '#5BC0BE',
                                margin: '0 0 12px 0',
                                fontSize: '1rem',
                                fontWeight: 600
                            }}>
                                Key Features
                            </h4>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: 10
                            }}>
                                {selectedProject.details.features.map((feature, i) => (
                                    <div key={i} style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 10,
                                        padding: '10px 14px',
                                        background: 'rgba(91, 192, 190, 0.08)',
                                        borderRadius: 8,
                                        fontSize: '0.85rem'
                                    }}>
                                        <span style={{ color: '#6FFFE9', flexShrink: 0 }}>✓</span>
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Results */}
                        <div style={{ marginBottom: 24 }}>
                            <h4 style={{
                                color: '#5BC0BE',
                                margin: '0 0 12px 0',
                                fontSize: '1rem',
                                fontWeight: 600
                            }}>
                                Results & Impact
                            </h4>
                            <div style={{
                                padding: '16px 20px',
                                background: 'linear-gradient(135deg, rgba(91, 192, 190, 0.1) 0%, rgba(111, 255, 233, 0.05) 100%)',
                                borderLeft: '3px solid #5BC0BE',
                                borderRadius: '0 8px 8px 0',
                                fontSize: '0.95rem',
                                lineHeight: 1.6
                            }}>
                                {selectedProject.details.results}
                            </div>
                        </div>

                        {/* Tech Stack */}
                        <div>
                            <h4 style={{
                                color: '#5BC0BE',
                                margin: '0 0 12px 0',
                                fontSize: '1rem',
                                fontWeight: 600
                            }}>
                                Technologies
                            </h4>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 10
                            }}>
                                {selectedProject.tags.map((tag, i) => (
                                    <span key={i} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        padding: '8px 14px',
                                        borderRadius: 20,
                                        background: 'rgba(91, 192, 190, 0.15)',
                                        border: '1px solid rgba(91, 192, 190, 0.25)',
                                        fontSize: '0.85rem',
                                        color: '#E0F7FA'
                                    }}>
                                        {techIconMap[tag] && (
                                            <span style={{ fontSize: '1rem', color: '#6FFFE9' }}>
                                                {techIconMap[tag]}
                                            </span>
                                        )}
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </section>
    );
};

export default Projects;