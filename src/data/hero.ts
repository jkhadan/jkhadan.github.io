export interface SocialLink {
    iconKey: string;
    href: string;
    label: string;
}

export const heroTitles = [
    "Full-Stack Engineer",
    "Cloud Architect",
    "Infrastructure Engineer",
    "AI Researcher",
    "DevOps Engineer",
    "Systems Designer",
    "Founder",
    "Mentor"
];

export const heroTagline = {
    line1: "Building scalable applications and cloud infrastructure.",
    line2: "Passionate about creating technology that makes a real impact."
};

export const heroName = "JAMES KHADAN";

export const heroHeadshot = {
    src: "/images/misc/Headshot.jpg",
    alt: "James Khadan",
    fallbackInitials: "JK"
};

export const heroSocialLinks: SocialLink[] = [
    { iconKey: "FaGithub", href: 'https://github.com/jkhadan', label: 'GitHub' },
    { iconKey: "FaLinkedin", href: 'https://linkedin.com/in/jkhadan', label: 'LinkedIn' },
    { iconKey: "FaEnvelope", href: 'mailto:contact@jameskhadan.com', label: 'Email' }
];

export const heroCta = {
    text: "Explore My Work",
    targetSection: "about"
};
