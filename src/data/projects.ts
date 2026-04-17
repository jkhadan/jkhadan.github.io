export interface ProjectDetail {
    challenge: string;
    solution: string;
    features: string[];
    results: string;
    gallery: string[];
}

export interface Project {
    id: number;
    title: string;
    description: string;
    image: string;
    tags: string[];
    icons: string[];
    category: string;
    link: string;
    details: ProjectDetail;
}

export const featuredProjects: Project[] = [
    {
        id: 1,
        title: "Lastgateway Enterprise Platform",
        description: "A platform providing computing resources and software services to organizations at significantly reduced costs compared to traditional cloud providers.",
        image: "",
        tags: ["Linux", "Docker", "Cloud", "Networking", "SaaS", "PaaS"],
        icons: ["Linux", "Docker", "Cloud", "Networking"],
        category: "IT",
        link: "#experience",
        details: {
            challenge: "Creating a cost-effective alternative to traditional cloud providers while maintaining reliability and performance for small organizations.",
            solution: "Built a comprehensive Platform/Software as a Service business leveraging optimized Linux servers and Docker containers to reduce overhead and provide reliable computing resources.",
            features: [
                "High-performance computing resources",
                "99.9% uptime guarantee",
                "Cost-effective infrastructure",
                "Multiple software services",
                "Scalable architecture",
                "24/7 monitoring and support"
            ],
            results: "Successfully reduced server and compute costs by more than half compared to traditional cloud providers while servicing over 5 organizations and maintaining over 30 software resources simultaneously with 99.9% uptime.",
            gallery: ["/images/projects/Lastgateway Enterprise/server.jpg", "/images/projects/Lastgateway Enterprise/unraid.png", "/images/projects/Lastgateway Enterprise/proxmox.png", "/images/projects/Lastgateway Enterprise/truenas.png"]
        }
    },
    {
        id: 2,
        title: "CodeCoach",
        description: "A code tutoring website with AI coaching features that provides personalized learning experiences for programming students.",
        image: "",
        tags: ["C#", "ASP.NET", "React", "TypeScript", "PostgreSQL", "Docker", "OpenAI API"],
        icons: ["C#", "ASP.NET", "React", "TypeScript", "PostgreSQL", "Docker"],
        category: "Web Application",
        link: "https://github.com/seth-linares/Senior_Project",
        details: {
            challenge: "Creating an effective learning platform for programmers with personalized AI-powered guidance and a diverse range of programming problems.",
            solution: "Developed a comprehensive tutoring platform with custom AI Coach integration, supporting multiple programming languages and providing detailed feedback on user code.",
            features: [
                "Personal A.I. Coach for tailored user guidance",
                "Over 20 coding problems across 4 topic areas",
                "Support for 3 programming languages",
                "Secure authentication system",
                "Real-time code feedback and suggestions",
                "Progress tracking and performance analytics"
            ],
            results: "The platform successfully supports multiple programming languages, encompassing over 80% of programmer workflows, and provides personalized guidance to increase engagement and learning effectiveness.",
            gallery: []
        }
    },
    {
        id: 3,
        title: "School Bot 2.0",
        description: "An interactive chat bot that helps students navigate school block schedules, providing automated reminders and schedule information.",
        image: "",
        tags: ["Python", "PyTorch", "NLP", "Chatbot", "Machine Learning"],
        icons: ["Python", "PyTorch", "Discord"],
        category: "Web Application",
        link: "https://github.com/jkhadan/school-bot-2.0",
        details: {
            challenge: "Creating an intuitive system to help students navigate complicated block scheduling in high school, reducing confusion and tardiness.",
            solution: "Developed an NLP-powered chat bot that understands natural language queries about schedules and provides automated reminders about upcoming classes.",
            features: [
                "Natural language processing capabilities",
                "Automated class reminders",
                "Schedule checking system",
                "User-friendly interface",
                "High query handling capacity",
                "Real-time schedule updates"
            ],
            results: "The bot successfully assisted over 2,000 students, handled more than 10,000 queries per day with an 80% accuracy rate, and increased student punctuality by over 30% through its automated reminder system.",
            gallery: ["/images/projects/School Bot 2/messages_1.png", "/images/projects/School Bot 2/messages_2.png", "/images/projects/School Bot 2/messages_3.png", "/images/projects/School Bot 2/messages_4.png"]
        }
    }
];

export const allProjects: Project[] = [
    {
        id: 1,
        title: "Lastgateway Enterprise Platform",
        description: "A platform providing computing resources and software services to organizations at significantly reduced costs compared to traditional cloud providers.",
        image: "",
        tags: ["Linux", "Docker", "Cloud", "Networking", "SaaS", "PaaS"],
        icons: ["Linux", "Docker", "Cloud", "Networking"],
        category: "IT",
        link: "#experience",
        details: {
            challenge: "Creating a cost-effective alternative to traditional cloud providers while maintaining reliability and performance for small organizations.",
            solution: "Built a comprehensive Platform/Software as a Service business leveraging optimized Linux servers and Docker containers.",
            features: ["High-performance computing resources", "99.9% uptime guarantee", "Cost-effective infrastructure", "Multiple software services", "Scalable architecture", "24/7 monitoring and support"],
            results: "Successfully reduced server and compute costs by more than half while servicing over 5 organizations with 99.9% uptime.",
            gallery: []
        }
    },
    {
        id: 2,
        title: "CodeCoach",
        description: "A code tutoring website with AI coaching features that provides personalized learning experiences for programming students.",
        image: "",
        tags: ["C#", "ASP.NET", "React", "TypeScript", "PostgreSQL", "Docker", "OpenAI API"],
        icons: ["C#", "React", "TypeScript", "PostgreSQL"],
        category: "Web Application",
        link: "https://github.com/seth-linares/Senior_Project",
        details: {
            challenge: "Creating an effective learning platform for programmers with personalized AI-powered guidance.",
            solution: "Developed a comprehensive tutoring platform with custom AI Coach integration, supporting multiple programming languages.",
            features: ["Personal A.I. Coach", "Over 20 coding problems", "Support for 3 programming languages", "Real-time code feedback", "Progress tracking"],
            results: "Platform supports multiple programming languages, encompassing over 80% of programmer workflows.",
            gallery: []
        }
    },
    {
        id: 3,
        title: "School Bot 2.0",
        description: "An interactive chat bot that helps students navigate school block schedules with automated reminders.",
        image: "",
        tags: ["Python", "PyTorch", "NLP", "Chatbot", "Machine Learning"],
        icons: ["Python", "PyTorch", "Discord"],
        category: "Web Application",
        link: "https://github.com/jkhadan/school-bot-2.0",
        details: {
            challenge: "Creating an intuitive system to help students navigate complicated block scheduling.",
            solution: "Developed an NLP-powered chat bot that understands natural language queries about schedules.",
            features: ["Natural language processing", "Automated class reminders", "Schedule checking system", "High query handling capacity"],
            results: "Assisted over 2,000 students with 10,000+ queries per day at 80% accuracy, increasing punctuality by 30%.",
            gallery: []
        }
    },
    {
        id: 4,
        title: "Northeastern Global Campus Explorer",
        description: "A comprehensive web platform aggregating reviews and information about Northeastern University's global campus opportunities.",
        image: "",
        tags: ["React", "TypeScript", "Next.js", "Supabase", "Selenium", "Beautiful Soup"],
        icons: ["React", "TypeScript", "Next.js", "Supabase"],
        category: "Web Application",
        link: "https://github.com/Oasis-NEU/f24-group25",
        details: {
            challenge: "Creating a centralized resource for students to explore 200+ global opportunities.",
            solution: "Developed a collaborative web platform consolidating reviews and information related to global campuses.",
            features: ["Comprehensive info on 200+ opportunities", "User reviews and ratings", "Search and filtering", "Interactive campus maps", "Program comparison tools"],
            results: "Successfully delivered a valuable resource for Northeastern students improving information accessibility.",
            gallery: []
        }
    },
    {
        id: 5,
        title: "John Guy Saves the Galaxy",
        description: "A 3D space shooter game created in Unity3D, featuring custom shaders and C# scripting.",
        image: "",
        tags: ["Unity", "Game Development", "C#"],
        icons: ["Unity", "C#"],
        category: "Game Development",
        link: "https://github.com/willkbl/John-Guy-Saves-the-Galaxy-1",
        details: {
            challenge: "Design and implement a fully functional space shooter game.",
            solution: "Utilized Unity as the development platform with C# for scripting and custom visual/audio effects.",
            features: ["Custom skeletal-rigged models with Mixamo", "C#-driven gameplay and enemy AI using NavMesh", "Multiple levels", "Spacecraft controls"],
            results: "Successfully delivered a polished, playable game demonstrating graphics programming understanding.",
            gallery: []
        }
    },
    {
        id: 6,
        title: "Dodge Fall",
        description: "A simple 2D Unity game to teach Unity fundamentals and collaborative development to the game design club.",
        image: "",
        tags: ["Unity", "C#", "Game Development", "2D", "Agile"],
        icons: ["Unity", "C#", "Git"],
        category: "Game Development",
        link: "https://github.com/jkhadan/Video-Game-Design-Dodge-Fall-Demonstration",
        details: {
            challenge: "Introduce fundamental Unity concepts to new developers.",
            solution: "Developed a simple 2D dodge game as a hands-on learning project with clear team roles.",
            features: ["2D gameplay focused on dodging", "Educational codebase", "Team roles for development/design/art", "Collaborative tool demonstrations"],
            results: "Helped team members learn Unity basics and experience collaborative development.",
            gallery: []
        }
    },
    {
        id: 7,
        title: "School Bot 1.0",
        description: "A Discord bot designed to help students stay organized with academic responsibilities during remote learning.",
        image: "",
        tags: ["Python", "Discord Bot", "Academic", "Automation", "Calendar"],
        icons: ["Python", "Discord"],
        category: "Web Application",
        link: "https://github.com/jkhadan/school-bot-1.0",
        details: {
            challenge: "During remote learning, students struggled to keep track of schedules and assignments.",
            solution: "Developed a Discord bot with automatic user registration, calendar integration, and persistent data management.",
            features: ["Automatic user registration via CSV", "iCalendar file integration", "Persistent user data", "Daily schedule notifications"],
            results: "Adopted by a high school community to improve student organization during the pandemic.",
            gallery: []
        }
    },
    {
        id: 8,
        title: "Portfolio Website",
        description: "A personal portfolio website built to showcase projects, skills, and experiences as a developer.",
        image: "",
        tags: ["TypeScript", "React", "Next.js", "UI/UX", "Web Development"],
        icons: ["TypeScript", "React", "Next.js", "Tailwind"],
        category: "Web Application",
        link: "https://github.com/jkhadan/newportfolio",
        details: {
            challenge: "Creating a visually engaging platform to present projects and technical skills.",
            solution: "Developed a modern, responsive portfolio website using TypeScript, React, and Next.js.",
            features: ["Project showcase with gallery", "Interactive UI/UX", "Dark/light mode", "SEO-friendly", "Mobile-friendly"],
            results: "Successfully launched a comprehensive portfolio improving professional web presence.",
            gallery: []
        }
    },
    {
        id: 9,
        title: "Fortnite Detector",
        description: "A Python script that alerts a Discord channel when your health in Fortnite decreases.",
        image: "",
        tags: ["Python", "Discord Bot", "Computer Vision", "Automation"],
        icons: ["Python", "Discord"],
        category: "Automation",
        link: "https://github.com/jkhadan/fortnite-detector",
        details: {
            challenge: "Notifying friends in real-time when health decreases in Fortnite.",
            solution: "Used Python with OpenCV and Tesseract OCR to monitor health values and send Discord alerts.",
            features: ["Live health monitoring using OCR", "Automated Discord notifications", "Async event loop for efficiency"],
            results: "Enabled real-time alerts for teammates, improving awareness during gameplay.",
            gallery: []
        }
    }
];

export const projectCategories = ['All', 'Web Application', 'Game Development', 'IT', 'Automation'];
