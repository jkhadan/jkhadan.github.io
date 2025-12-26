export interface ClubDetails {
    activities: string[];
    skills: string[];
    achievements: string[];
    gallery: string[];
}

export interface Club {
    name: string;
    role: string;
    period: string;
    location: string;
    description: string;
    image: string;
    details: ClubDetails;
}

export const clubs: Club[] = [
    {
        name: "Oasis",
        role: "Team Member & Mentor/Instructor",
        period: "September 2024 - Present",
        location: "Boston, MA",
        description: "Collaborated with 4 software engineers to develop a website that consolidates reviews and information on the over 200+ global opportunities a part of Northeastern's Global Campus Network. Mentoring new members on the team and helping them learn the ropes of full-stack development.",
        image: "/src/assets/images/extracirriculars/oasis/oasis_banner.png",
        details: {
            activities: [
                "Collaborated on developing the website architecture",
                "Designed and implemented the user interface",
                "Created database schemas for storing global opportunity and user data",
                "Mentoring 80+ students in full-stack development and project management principles through workshops and one-on-one sessions"
            ],
            skills: ["Web Development", "Team Collaboration", "UI/UX Design", "Database Design", "API Development", "Project Management"],
            achievements: [
                "Successfully launched a comprehensive resource for students",
                "Implemented a user-friendly interface for accessing information on 200+ global opportunities",
                "Developed effective teamwork and communication skills"
            ],
            gallery: ["/src/assets/images/extracirriculars/oasis/oasis_headshot.JPEG", 
                "/src/assets/images/extracirriculars/oasis/oasis_presentation_1.jpg",
                "/src/assets/images/extracirriculars/oasis/oasis_presentation_2.jpg",
                "/src/assets/images/extracirriculars/oasis/oasis_presentation_3.jpg",
                "/src/assets/images/extracirriculars/oasis/oasis_presentation_4.jpg",
                "/src/assets/images/extracirriculars/oasis/oasis_presentation_5.jpg",
                "/src/assets/images/extracirriculars/oasis/oasis_presentation_6.jpg",
                "/src/assets/images/extracirriculars/oasis/oasis_presentation_7.jpg"]
        }
    },
    {
        name: "ColorStack",
        role: "Team Member",
        period: "September 2024 - Present",
        location: "Boston, MA",
        description: "Engaging with over 1500+ other computer science students from underrepresented backgrounds across the ColorStack network to gain a better understanding of how a diverse and inclusive professional environment operates.",
        image: "/src/assets/images/extracirriculars/colorstack/colorstack_banner.jpg",
        details: {
            activities: [
                "Participating in diversity and inclusion initiatives",
                "Attending networking events and workshops",
                "Participating in mentorship programs",
                "Engaging in professional development activities"
            ],
            skills: ["Diversity & Inclusion", "Networking", "Professional Development", "Community Building"],
            achievements: [
                "Built connections with computer science students from diverse backgrounds",
                "Enhanced understanding of inclusive professional environments",
                "Contributed to creating a more diverse tech community"
            ],
            gallery: ["/src/assets/images/extracirriculars/colorstack/colorstack_gallery_1.jpeg"]
        }
    }
];
