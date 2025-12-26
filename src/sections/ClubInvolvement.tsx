import React, { useState, useRef } from 'react';
import { useObstacle } from '../utils/domObstacles';
import { Modal } from '../components/Modal';
import { FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaTrophy, FaLightbulb, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { clubs, type Club } from '../data/clubs';

const ClubBanner: React.FC<{
    club: Club;
    onClick: () => void;
    index: number;
}> = ({ club, onClick, index }) => {
    const ref = useRef<HTMLDivElement>(null);
    useObstacle(`club-${index}`, ref);

    return (
        <div
            ref={ref}
            onClick={onClick}
            style={{
                cursor: 'pointer',
                borderRadius: 20,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(11, 19, 43, 0.9) 0%, rgba(20, 35, 65, 0.9) 100%)',
                border: '1px solid rgba(91, 192, 190, 0.2)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                position: 'relative'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 40px rgba(91, 192, 190, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(91, 192, 190, 0.4)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(91, 192, 190, 0.2)';
            }}
        >
            {/* Banner Image */}
            <div style={{
                height: 160,
                background: `linear-gradient(to bottom, transparent 0%, rgba(11, 19, 43, 0.9) 100%), url(${club.image}) center/cover no-repeat`,
                backgroundColor: 'rgba(91, 192, 190, 0.1)',
                position: 'relative'
            }}>
                {/* Gradient overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(91, 192, 190, 0.1) 0%, transparent 50%)'
                }} />
            </div>

            {/* Content */}
            <div style={{ padding: 24 }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: 12
                }}>
                    <div>
                        <h3 style={{
                            margin: 0,
                            fontSize: '1.4rem',
                            fontWeight: 600,
                            color: '#E0F7FA'
                        }}>
                            {club.name}
                        </h3>
                        <p style={{
                            margin: '4px 0 0',
                            fontSize: '1rem',
                            color: '#5BC0BE',
                            fontWeight: 500
                        }}>
                            {club.role}
                        </p>
                    </div>
                    <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: 'rgba(91, 192, 190, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6FFFE9',
                        fontSize: '1.3rem'
                    }}>
                        <FaUsers />
                    </div>
                </div>

                {/* Meta info */}
                <div style={{
                    display: 'flex',
                    gap: 20,
                    marginBottom: 16,
                    fontSize: '0.85rem',
                    color: 'rgba(255, 255, 255, 0.5)'
                }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <FaCalendarAlt style={{ color: '#5BC0BE' }} />
                        {club.period}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <FaMapMarkerAlt style={{ color: '#5BC0BE' }} />
                        {club.location}
                    </span>
                </div>

                <p style={{
                    margin: 0,
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: 1.6,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {club.description}
                </p>

                {/* View more indicator */}
                <div style={{
                    marginTop: 20,
                    paddingTop: 16,
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.9rem',
                    color: '#5BC0BE'
                }}>
                    <span>Learn more about my involvement</span>
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
                    alt={`Gallery image ${currentIndex + 1}`}
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

export const ClubInvolvement: React.FC = () => {
    const [selectedClub, setSelectedClub] = useState<Club | null>(null);
    const sectionRef = useRef<HTMLElement>(null);

    return (
        <section id="clubs" ref={sectionRef} style={{ padding: '100px 20px' }}>
            <h2 style={{
                textAlign: 'center',
                marginBottom: 20,
                fontSize: '2.5rem',
                background: 'linear-gradient(135deg, #E0F7FA 0%, #6FFFE9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                Club Involvement
            </h2>

            <p style={{
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.6)',
                maxWidth: 600,
                margin: '0 auto 50px',
                fontSize: '1rem'
            }}>
                Active participation in communities that foster growth, collaboration, and diversity in tech.
            </p>

            {/* Club Banners Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))',
                gap: 24,
                maxWidth: 1000,
                margin: '0 auto'
            }}>
                {clubs.map((club, index) => (
                    <ClubBanner
                        key={index}
                        club={club}
                        index={index}
                        onClick={() => setSelectedClub(club)}
                    />
                ))}
            </div>

            {/* Club Detail Modal */}
            <Modal
                isOpen={!!selectedClub}
                onClose={() => setSelectedClub(null)}
                title={selectedClub?.name || ''}
                subtitle={selectedClub?.role}
                size="lg"
                headerImage={selectedClub?.image}
            >
                {selectedClub && (
                    <div style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                        {/* Meta Info */}
                        <div style={{
                            display: 'flex',
                            gap: 24,
                            marginBottom: 24,
                            paddingBottom: 20,
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FaCalendarAlt style={{ color: '#5BC0BE' }} />
                                <span>{selectedClub.period}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FaMapMarkerAlt style={{ color: '#5BC0BE' }} />
                                <span>{selectedClub.location}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <p style={{
                            margin: '0 0 24px',
                            fontSize: '0.95rem',
                            lineHeight: 1.7,
                            color: 'rgba(255, 255, 255, 0.8)'
                        }}>
                            {selectedClub.description}
                        </p>

                        {/* Gallery */}
                        {selectedClub.details.gallery.length > 0 && (
                            <ImageGallery images={selectedClub.details.gallery} />
                        )}

                        {/* Activities */}
                        <div style={{ marginBottom: 24 }}>
                            <h4 style={{
                                color: '#5BC0BE',
                                margin: '0 0 12px 0',
                                fontSize: '1rem',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8
                            }}>
                                <FaLightbulb />
                                Activities & Responsibilities
                            </h4>
                            <ul style={{
                                margin: 0,
                                paddingLeft: 20,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8
                            }}>
                                {selectedClub.details.activities.map((activity, i) => (
                                    <li key={i} style={{
                                        fontSize: '0.9rem',
                                        lineHeight: 1.5,
                                        color: 'rgba(255, 255, 255, 0.8)'
                                    }}>
                                        {activity}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Achievements */}
                        <div style={{ marginBottom: 24 }}>
                            <h4 style={{
                                color: '#5BC0BE',
                                margin: '0 0 12px 0',
                                fontSize: '1rem',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8
                            }}>
                                <FaTrophy />
                                Achievements
                            </h4>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 10
                            }}>
                                {selectedClub.details.achievements.map((achievement, i) => (
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

                        {/* Skills Developed */}
                        <div>
                            <h4 style={{
                                color: '#5BC0BE',
                                margin: '0 0 12px 0',
                                fontSize: '1rem',
                                fontWeight: 600
                            }}>
                                Skills Developed
                            </h4>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 10
                            }}>
                                {selectedClub.details.skills.map((skill, i) => (
                                    <span key={i} style={{
                                        padding: '8px 16px',
                                        borderRadius: 20,
                                        background: 'rgba(91, 192, 190, 0.15)',
                                        border: '1px solid rgba(91, 192, 190, 0.25)',
                                        fontSize: '0.85rem',
                                        color: '#E0F7FA'
                                    }}>
                                        {skill}
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

export default ClubInvolvement;