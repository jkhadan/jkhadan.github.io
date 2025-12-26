import React, { useRef } from 'react';
import { useObstacle } from '../utils/domObstacles';

export interface ProjectData {
    id: string;
    title: string;
    description: string;
    image?: string;
    tags: string[];
    link?: string;
}

interface ProjectCardProps {
    project: ProjectData;
    onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
    const ref = useRef<HTMLDivElement>(null);
    useObstacle(`project-${project.id}`, ref);

    return (
        <div
            ref={ref}
            className="glass-card"
            onClick={onClick}
            style={{ cursor: 'pointer', padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}
        >
            <h3>{project.title}</h3>
            <p style={{ fontSize: '0.9rem', flex: 1 }}>{project.description}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                {project.tags.map(tag => (
                    <span key={tag} style={{
                        fontSize: '0.75rem', padding: '4px 8px', borderRadius: 12,
                        background: 'rgba(91, 192, 190, 0.2)', color: '#6FFFE9'
                    }}>
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
};
