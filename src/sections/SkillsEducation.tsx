import React, { useState, useRef } from 'react';
import { useObstacle } from '../utils/domObstacles';
import { Modal } from '../components/Modal';
import { FaGraduationCap, FaBook } from 'react-icons/fa';
import { relevantCourses, type Course } from '../data/education';
import { skillCategories } from '../data/skills';
import { techIconMap } from '../utils/techIcons';

const CourseCard: React.FC<{
    course: Course;
    onClick: () => void;
    index: number;
}> = ({ course, onClick, index }) => {
    const ref = useRef<HTMLDivElement>(null);
    useObstacle(`course-${index}`, ref);

    return (
        <div
            ref={ref}
            onClick={onClick}
            style={{
                cursor: 'pointer',
                padding: 20,
                borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(11, 19, 43, 0.85) 0%, rgba(20, 35, 65, 0.85) 100%)',
                border: '1px solid rgba(91, 192, 190, 0.15)',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
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
            {/* Graduate badge */}
            {course.isGraduate && (
                <div style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    padding: '4px 10px',
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.2) 0%, rgba(255, 152, 0, 0.2) 100%)',
                    border: '1px solid rgba(255, 193, 7, 0.3)',
                    fontSize: '0.7rem',
                    color: '#FFD54F',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                }}>
                    <FaGraduationCap />
                    Graduate
                </div>
            )}

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 12
            }}>
                <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: 'rgba(91, 192, 190, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6FFFE9',
                    fontSize: '1.2rem'
                }}>
                    <FaBook />
                </div>
                <h4 style={{
                    margin: 0,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: '#E0F7FA',
                    flex: 1,
                    paddingRight: course.isGraduate ? 80 : 0
                }}>
                    {course.title}
                </h4>
            </div>

            {/* Skills preview */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6
            }}>
                {course.skillsLearned.slice(0, 3).map((skill, i) => (
                    <span key={i} style={{
                        fontSize: '0.7rem',
                        padding: '3px 8px',
                        borderRadius: 8,
                        background: 'rgba(111, 255, 233, 0.08)',
                        color: 'rgba(111, 255, 233, 0.7)'
                    }}>
                        {skill}
                    </span>
                ))}
                {course.skillsLearned.length > 3 && (
                    <span style={{
                        fontSize: '0.7rem',
                        padding: '3px 8px',
                        color: 'rgba(255, 255, 255, 0.4)'
                    }}>
                        +{course.skillsLearned.length - 3}
                    </span>
                )}
            </div>
        </div>
    );
};

export const SkillsEducation: React.FC = () => {
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const skillsRef = useRef<HTMLDivElement>(null);
    
    useObstacle('skills-grid', skillsRef);

    return (
        <section id="skills" ref={sectionRef} style={{ padding: '100px 20px' }}>
            <h2 style={{
                textAlign: 'center',
                marginBottom: 60,
                fontSize: '2.5rem',
                background: 'linear-gradient(135deg, #E0F7FA 0%, #6FFFE9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                Skills & Education
            </h2>

            {/* Technical Skills Grid */}
            <div
                ref={skillsRef}
                style={{
                    maxWidth: 1000,
                    margin: '0 auto 60px',
                    padding: 'clamp(20px, 4vw, 32px)',
                    borderRadius: 'clamp(14px, 3vw, 20px)',
                    background: 'linear-gradient(135deg, rgba(11, 19, 43, 0.8) 0%, rgba(20, 35, 65, 0.8) 100%)',
                    border: '1px solid rgba(91, 192, 190, 0.2)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)'
                }}
            >
                <h3 style={{
                    textAlign: 'center',
                    marginBottom: 32,
                    fontSize: '1.5rem',
                    color: '#5BC0BE'
                }}>
                    Technical Skills
                </h3>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
                    gap: 20
                }}>
                    {skillCategories.map((category, catIndex) => (
                        <div key={catIndex}>
                            <h4 style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '0.85rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                marginBottom: 12
                            }}>
                                {category.name}
                            </h4>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 8
                            }}>
                                {category.skills.map((skill, skillIndex) => (
                                    <div
                                        key={skillIndex}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            padding: '8px 14px',
                                            borderRadius: 20,
                                            background: 'rgba(91, 192, 190, 0.1)',
                                            border: '1px solid rgba(91, 192, 190, 0.2)',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(91, 192, 190, 0.2)';
                                            e.currentTarget.style.borderColor = 'rgba(91, 192, 190, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(91, 192, 190, 0.1)';
                                            e.currentTarget.style.borderColor = 'rgba(91, 192, 190, 0.2)';
                                        }}
                                    >
                                        <span style={{ color: '#6FFFE9', fontSize: '1rem' }}>
                                            {techIconMap[skill.iconKey]}
                                        </span>
                                        <span style={{
                                            color: '#E0F7FA',
                                            fontSize: '0.85rem'
                                        }}>
                                            {skill.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Relevant Coursework */}
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                <h3 style={{
                    textAlign: 'center',
                    marginBottom: 32,
                    fontSize: '1.5rem',
                    color: '#5BC0BE'
                }}>
                    Relevant Coursework
                </h3>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))',
                    gap: 14
                }}>
                    {relevantCourses.map((course, index) => (
                        <CourseCard
                            key={index}
                            course={course}
                            index={index}
                            onClick={() => setSelectedCourse(course)}
                        />
                    ))}
                </div>
            </div>

            {/* Course Detail Modal */}
            <Modal
                isOpen={!!selectedCourse}
                onClose={() => setSelectedCourse(null)}
                title={selectedCourse?.title || ''}
                subtitle={selectedCourse?.isGraduate ? 'Graduate Level Course' : 'Undergraduate Course'}
                size="md"
                headerIcon={
                    <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: selectedCourse?.isGraduate 
                            ? 'linear-gradient(135deg, rgba(255, 193, 7, 0.3), rgba(255, 152, 0, 0.3))' 
                            : 'rgba(91, 192, 190, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {selectedCourse?.isGraduate ? (
                            <FaGraduationCap style={{ color: '#FFD54F', fontSize: '1.2rem' }} />
                        ) : (
                            <FaBook style={{ color: '#6FFFE9', fontSize: '1.2rem' }} />
                        )}
                    </div>
                }
            >
                {selectedCourse && (
                    <div style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                        {/* Course Level Badge */}
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '6px 12px',
                            borderRadius: 16,
                            background: selectedCourse.isGraduate 
                                ? 'rgba(255, 193, 7, 0.15)' 
                                : 'rgba(91, 192, 190, 0.15)',
                            border: `1px solid ${selectedCourse.isGraduate ? 'rgba(255, 193, 7, 0.3)' : 'rgba(91, 192, 190, 0.3)'}`,
                            marginBottom: 20,
                            fontSize: '0.85rem',
                            color: selectedCourse.isGraduate ? '#FFD54F' : '#6FFFE9'
                        }}>
                            {selectedCourse.isGraduate ? <FaGraduationCap /> : <FaBook />}
                            {selectedCourse.isGraduate ? 'Graduate Level' : 'Undergraduate'}
                        </div>

                        {/* Course Description */}
                        <div style={{ marginBottom: 24 }}>
                            <h4 style={{
                                color: '#5BC0BE',
                                margin: '0 0 12px 0',
                                fontSize: '1rem',
                                fontWeight: 600
                            }}>
                                Course Description
                            </h4>
                            <p style={{
                                margin: 0,
                                fontSize: '0.95rem',
                                lineHeight: 1.7,
                                color: 'rgba(255, 255, 255, 0.8)'
                            }}>
                                {selectedCourse.description}
                            </p>
                        </div>

                        {/* Skills Learned */}
                        <div>
                            <h4 style={{
                                color: '#5BC0BE',
                                margin: '0 0 12px 0',
                                fontSize: '1rem',
                                fontWeight: 600
                            }}>
                                Skills Learned
                            </h4>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 10
                            }}>
                                {selectedCourse.skillsLearned.map((skill, i) => (
                                    <span key={i} style={{
                                        padding: '8px 16px',
                                        borderRadius: 20,
                                        background: 'rgba(91, 192, 190, 0.15)',
                                        border: '1px solid rgba(91, 192, 190, 0.25)',
                                        fontSize: '0.9rem',
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

export default SkillsEducation;