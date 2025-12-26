export interface Skill {
    name: string;
    iconKey: string;
}

export interface SkillCategory {
    name: string;
    skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
    {
        name: "Languages",
        skills: [
            { name: "Python", iconKey: "Python" },
            { name: "TypeScript", iconKey: "TypeScript" },
            { name: "JavaScript", iconKey: "JavaScript" },
            { name: "C#", iconKey: "C#" },
            { name: "SQL", iconKey: "SQL" },
            { name: "HTML", iconKey: "HTML" },
            { name: "CSS", iconKey: "CSS" }
        ]
    },
    {
        name: "Frameworks & Libraries",
        skills: [
            { name: "React", iconKey: "React" },
            { name: "Next.js", iconKey: "Next.js" },
            { name: "Unity", iconKey: "Unity" },
            { name: "Tailwind CSS", iconKey: "Tailwind CSS" }
        ]
    },
    {
        name: "Cloud & DevOps",
        skills: [
            { name: "AWS", iconKey: "AWS" },
            { name: "Azure", iconKey: "Azure" },
            { name: "Docker", iconKey: "Docker" },
            { name: "Kubernetes", iconKey: "Kubernetes" },
            { name: "Linux", iconKey: "Linux" }
        ]
    },
    {
        name: "Databases",
        skills: [
            { name: "PostgreSQL", iconKey: "PostgreSQL" },
            { name: "MySQL", iconKey: "MySQL" }
        ]
    },
    {
        name: "Tools",
        skills: [
            { name: "Git", iconKey: "Git" },
            { name: "GitHub", iconKey: "GitHub" },
            { name: "RESTful APIs", iconKey: "RESTful APIs" }
        ]
    },
    {
        name: "AI/ML",
        skills: [
            { name: "OpenAI API", iconKey: "OpenAI API" },
            { name: "Machine Learning", iconKey: "Machine Learning" }
        ]
    }
];
