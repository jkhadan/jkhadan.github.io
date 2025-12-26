import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Modal } from '../components/Modal';
import { FaGithub, FaSearch, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { allProjects, projectCategories, type Project } from '../data/projects';
import { techIconMap } from '../utils/techIcons';

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

interface AllProjectsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const MiniProjectCard: React.FC<{
    project: Project;
    onClick: () => void;
}> = ({ project, onClick }) => {
    return (
        <div
            onClick={onClick}
            style={{
                cursor: 'pointer',
                padding: 20,
                borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(11, 19, 43, 0.95) 0%, rgba(20, 35, 65, 0.95) 100%)',
                border: '1px solid rgba(91, 192, 190, 0.15)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: 12
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(91, 192, 190, 0.35)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(91, 192, 190, 0.15)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            {/* Header with icons */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', gap: 8 }}>
                    {project.icons.slice(0, 3).map((icon, i) => (
                        <span key={i} style={{
                            fontSize: '1.2rem',
                            color: '#6FFFE9',
                            opacity: 0.8
                        }}>
                            {techIconMap[icon]}
                        </span>
                    ))}
                </div>
                <span style={{
                    fontSize: '0.7rem',
                    padding: '3px 8px',
                    borderRadius: 8,
                    background: 'rgba(91, 192, 190, 0.15)',
                    color: '#5BC0BE'
                }}>
                    {project.category}
                </span>
            </div>

            <h4 style={{
                margin: 0,
                fontSize: '1rem',
                fontWeight: 600,
                color: '#E0F7FA'
            }}>
                {project.title}
            </h4>

            <p style={{
                margin: 0,
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.6)',
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
            }}>
                {project.description}
            </p>

            {/* Tags preview */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 4,
                marginTop: 'auto'
            }}>
                {project.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} style={{
                        fontSize: '0.65rem',
                        padding: '2px 6px',
                        borderRadius: 6,
                        background: 'rgba(111, 255, 233, 0.08)',
                        color: 'rgba(111, 255, 233, 0.7)'
                    }}>
                        {tag}
                    </span>
                ))}
                {project.tags.length > 3 && (
                    <span style={{
                        fontSize: '0.65rem',
                        padding: '2px 6px',
                        color: 'rgba(255, 255, 255, 0.4)'
                    }}>
                        +{project.tags.length - 3}
                    </span>
                )}
            </div>
        </div>
    );
};

export const AllProjectsModal: React.FC<AllProjectsModalProps> = ({ isOpen, onClose }) => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const searchInputRef = useRef<HTMLInputElement>(null);

    const handleEscape = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            if (selectedProject) {
                setSelectedProject(null);
            } else {
                onClose();
            }
        }
    }, [onClose, selectedProject]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEscape);
            // Focus search input when modal opens
            setTimeout(() => searchInputRef.current?.focus(), 100);
        } else {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEscape);
            // Reset state when closing
            setSearchQuery('');
            setActiveCategory('All');
            setSelectedProject(null);
        }
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, handleEscape]);

    const filteredProjects = useMemo(() => {
        return allProjects.filter(project => {
            const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
            const matchesSearch = searchQuery === '' || 
                project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, activeCategory]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <>
            <style>{`
                @keyframes modalFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(50px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .all-projects-content::-webkit-scrollbar {
                    width: 8px;
                }
                .all-projects-content::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 4px;
                }
                .all-projects-content::-webkit-scrollbar-thumb {
                    background: rgba(91, 192, 190, 0.3);
                    border-radius: 4px;
                }
                .all-projects-content::-webkit-scrollbar-thumb:hover {
                    background: rgba(91, 192, 190, 0.5);
                }
            `}</style>
            
            {/* Full-screen overlay */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 1001,
                    background: 'rgba(0, 6, 15, 0.95)',
                    backdropFilter: 'blur(20px)',
                    animation: 'modalFadeIn 0.3s ease-out'
                }}
            />

            {/* Modal Content */}
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 1002,
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'slideUp 0.4s ease-out'
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '24px 40px',
                    borderBottom: '1px solid rgba(91, 192, 190, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'linear-gradient(to bottom, rgba(11, 19, 43, 0.98), rgba(11, 19, 43, 0.9))'
                }}>
                    <div>
                        <h2 style={{
                            margin: 0,
                            fontSize: '2rem',
                            background: 'linear-gradient(135deg, #E0F7FA 0%, #6FFFE9 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            All Projects
                        </h2>
                        <p style={{
                            margin: '8px 0 0',
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontSize: '0.9rem'
                        }}>
                            Browse through all my projects or use the search and filters
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            background: 'rgba(91, 192, 190, 0.1)',
                            border: '1px solid rgba(91, 192, 190, 0.2)',
                            color: '#E0F7FA',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(91, 192, 190, 0.2)';
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(91, 192, 190, 0.1)';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                {/* Search and Filter Bar */}
                <div style={{
                    padding: '20px 40px',
                    borderBottom: '1px solid rgba(91, 192, 190, 0.1)',
                    background: 'rgba(11, 19, 43, 0.6)'
                }}>
                    <div style={{
                        maxWidth: 1200,
                        margin: '0 auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 16
                    }}>
                        {/* Search Input */}
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: 600,
                            margin: '0 auto'
                        }}>
                            <FaSearch style={{
                                position: 'absolute',
                                left: 16,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'rgba(91, 192, 190, 0.6)',
                                fontSize: '1rem'
                            }} />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search projects by name, description, or technology..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '14px 44px',
                                    borderRadius: 12,
                                    border: '1px solid rgba(91, 192, 190, 0.2)',
                                    background: 'rgba(11, 19, 43, 0.8)',
                                    color: '#E0F7FA',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    transition: 'all 0.2s'
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(91, 192, 190, 0.5)';
                                    e.currentTarget.style.boxShadow = '0 0 20px rgba(91, 192, 190, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(91, 192, 190, 0.2)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    style={{
                                        position: 'absolute',
                                        right: 16,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: 'rgba(255, 255, 255, 0.5)',
                                        cursor: 'pointer',
                                        padding: 4
                                    }}
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </div>

                        {/* Category Filters */}
                        <div style={{
                            display: 'flex',
                            gap: 10,
                            flexWrap: 'wrap',
                            justifyContent: 'center'
                        }}>
                            {projectCategories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    style={{
                                        padding: '8px 18px',
                                        borderRadius: 20,
                                        border: '1px solid',
                                        borderColor: activeCategory === category 
                                            ? 'rgba(91, 192, 190, 0.6)' 
                                            : 'rgba(91, 192, 190, 0.2)',
                                        background: activeCategory === category 
                                            ? 'rgba(91, 192, 190, 0.2)' 
                                            : 'transparent',
                                        color: activeCategory === category 
                                            ? '#6FFFE9' 
                                            : 'rgba(255, 255, 255, 0.6)',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Results Count */}
                        <p style={{
                            textAlign: 'center',
                            color: 'rgba(255, 255, 255, 0.5)',
                            margin: 0,
                            fontSize: '0.85rem'
                        }}>
                            Showing {filteredProjects.length} of {allProjects.length} projects
                        </p>
                    </div>
                </div>

                {/* Projects Grid */}
                <div
                    className="all-projects-content"
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '40px',
                        background: 'linear-gradient(180deg, rgba(11, 19, 43, 0.8) 0%, rgba(11, 19, 43, 0.95) 100%)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: 20,
                        maxWidth: 1200,
                        margin: '0 auto'
                    }}>
                        {filteredProjects.map((project) => (
                            <MiniProjectCard
                                key={project.id}
                                project={project}
                                onClick={() => setSelectedProject(project)}
                            />
                        ))}
                    </div>

                    {filteredProjects.length === 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: 'rgba(255, 255, 255, 0.5)'
                        }}>
                            <p style={{ fontSize: '1.1rem', marginBottom: 10 }}>No projects found</p>
                            <p style={{ fontSize: '0.9rem' }}>Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Project Detail Modal */}
            <Modal
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
                title={selectedProject?.title || ''}
                subtitle={selectedProject?.category}
                size="lg"
                hideHeaderBar={true}
                zIndex={1010}
            >
                {selectedProject && (
                    <div style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                        {/* Screenshot Gallery */}
                        {selectedProject.details.gallery && selectedProject.details.gallery.length > 0 && (
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
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    <FaGithub /> View on GitHub
                                </a>
                            )}
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <h4 style={{ color: '#5BC0BE', margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 600 }}>
                                The Challenge
                            </h4>
                            <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
                                {selectedProject.details.challenge}
                            </p>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <h4 style={{ color: '#5BC0BE', margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 600 }}>
                                The Solution
                            </h4>
                            <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
                                {selectedProject.details.solution}
                            </p>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <h4 style={{ color: '#5BC0BE', margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 600 }}>
                                Key Features
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
                                {selectedProject.details.features.map((feature, i) => (
                                    <div key={i} style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 8,
                                        padding: '8px 12px',
                                        background: 'rgba(91, 192, 190, 0.08)',
                                        borderRadius: 6,
                                        fontSize: '0.85rem'
                                    }}>
                                        <span style={{ color: '#6FFFE9' }}>✓</span>
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <h4 style={{ color: '#5BC0BE', margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 600 }}>
                                Results
                            </h4>
                            <div style={{
                                padding: '14px 18px',
                                background: 'rgba(91, 192, 190, 0.08)',
                                borderLeft: '3px solid #5BC0BE',
                                borderRadius: '0 8px 8px 0',
                                fontSize: '0.95rem',
                                lineHeight: 1.6
                            }}>
                                {selectedProject.details.results}
                            </div>
                        </div>

                        <div>
                            <h4 style={{ color: '#5BC0BE', margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 600 }}>
                                Technologies
                            </h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {selectedProject.tags.map((tag, i) => (
                                    <span key={i} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        padding: '6px 12px',
                                        borderRadius: 16,
                                        background: 'rgba(91, 192, 190, 0.12)',
                                        border: '1px solid rgba(91, 192, 190, 0.2)',
                                        fontSize: '0.8rem',
                                        color: '#E0F7FA'
                                    }}>
                                        {techIconMap[tag] && <span style={{ color: '#6FFFE9' }}>{techIconMap[tag]}</span>}
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </>,
        document.body
    );
};

export default AllProjectsModal;