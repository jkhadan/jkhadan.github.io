import React, { useRef } from 'react';
import { useObstacle } from '../utils/domObstacles';

interface TimelineItemProps {
    role: string;
    company: string;
    date: string;
    description: string;
    index: number;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ role, company, date, description, index }) => {
    const ref = useRef<HTMLDivElement>(null);
    useObstacle(`exp-${index}`, ref);

    return (
        <div
            ref={ref}
            className="glass-panel"
            style={{
                padding: 24, marginBottom: 30, position: 'relative',
                marginLeft: 20, borderLeft: '3px solid #5BC0BE'
            }}
        >
            <div style={{ position: 'absolute', left: -26, top: 24, width: 12, height: 12, borderRadius: '50%', background: '#5BC0BE', boxShadow: '0 0 10px #5BC0BE' }} />
            <h3 style={{ margin: 0, color: '#E0F7FA' }}>{role}</h3>
            <h4 style={{ margin: '4px 0 12px 0', fontWeight: 500, color: '#5BC0BE' }}>{company}</h4>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 12 }}>{date}</span>
            <p>{description}</p>
        </div>
    );
};
