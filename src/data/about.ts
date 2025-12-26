export interface Highlight {
    iconKey: string;
    title: string;
    description: string;
}

export interface InfoItem {
    iconKey: string;
    text: string;
}

export const highlights: Highlight[] = [
    {
        iconKey: "FaCode",
        title: "Full-Stack Development",
        description: "Building scalable web applications with React, TypeScript, and modern backend technologies"
    },
    {
        iconKey: "FaCloud",
        title: "Cloud & DevOps",
        description: "Deploying and managing infrastructure on AWS, Azure, and Kubernetes environments"
    },
    {
        iconKey: "FaGraduationCap",
        title: "Northeastern University",
        description: "Computer Science student with focus on systems, networks, and software engineering"
    }
];

export const quickInfo: InfoItem[] = [
    { iconKey: "FaMapMarkerAlt", text: "Boston, MA / New Jersey" },
    { iconKey: "FaGraduationCap", text: "Northeastern University" },
    { iconKey: "FaCode", text: "Open to opportunities" }
];

export const aboutIntro = {
    title: "Full-Stack Software Engineer",
    mainParagraph: "I'm a Full-Stack Software Engineer passionate about building robust, scalable applications that solve real-world problems. Currently pursuing Computer Science at Northeastern University, I combine academic rigor with hands-on industry experience.",
    secondParagraph: "From developing compliance automation tools that save 100+ hours monthly to founding a Platform-as-a-Service business serving multiple organizations, I thrive on creating impactful technology solutions. My work spans enterprise software development, cloud infrastructure, AI integration, and everything in between."
};

export const lookingFor = {
    title: "What I'm Looking For",
    content: "I'm seeking opportunities where I can leverage my full-stack development skills and cloud infrastructure experience to build meaningful products. I'm particularly interested in roles involving system design, AI integration, or developer tooling where I can continue to grow while making a tangible impact."
};
