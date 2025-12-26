export interface ContactMethod {
    iconKey: string;
    label: string;
    value: string;
    href: string;
}

export const contactMethods: ContactMethod[] = [
    {
        iconKey: "FaEnvelope",
        label: 'Email',
        value: 'jameskhadan@gmail.com',
        href: 'mailto:jameskhadan@gmail.com'
    },
    {
        iconKey: "FaLinkedin",
        label: 'LinkedIn',
        value: 'linkedin.com/in/jameskhadan',
        href: 'https://linkedin.com/in/jameskhadan'
    },
    {
        iconKey: "FaGithub",
        label: 'GitHub',
        value: 'github.com/jkhadan',
        href: 'https://github.com/jkhadan'
    }
];

export const contactLocation = {
    label: "Location",
    value: "Boston, MA / New Jersey"
};

export const contactIntro = {
    title: "Get In Touch",
    subtitle: "I'm currently open to new opportunities and always happy to connect. Whether you have a question, want to collaborate, or just want to say hi - feel free to reach out!"
};
