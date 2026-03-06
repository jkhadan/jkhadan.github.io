export interface ExperienceDetail {
    responsibilities: string[];
    technologies: string[];
    achievements: string[];
    projects?: string[];
}

export interface Experience {
    id: number;
    company: string;
    logo: string;
    position: string;
    period: string;
    location: string;
    description: string;
    details: ExperienceDetail;
}

export const experiences: Experience[] = [
    {
        id: 1,
        company: "Bank of America",
        logo: "/src/assets/images/experiences/bofa_logo.png",
        position: "Software Engineer Intern",
        period: "June - August 2026",
        location: "Pennington, NJ",
        description: "Designing, developing, and maintaining software applications to support banking services and operations, with emphasis on system performance, security, and feature implementation for customer-facing platforms.",
        details: {
            responsibilities: [
                "Will leverage cutting-edge technology and integrated platforms to enhance customer banking experiences"
            ],
            technologies: [
                "Java",
                "Python",
                "C#",
                ".NET",
                "Angular",
                "React",
                "JavaScript",
                "HTML",
                "CSS",
                "SQL",
                "Linux",
                "JIRA",
                "Agile"
            ],
            achievements: [
                "Selected for competitive Global Technology Analyst Program from a large applicant pool",
                "Contributing to software solutions that serve millions of Bank of America customers",
                "Working with the third largest mainframe environment in the world"
            ]
        }
    },
    {
        id: 2,
        company: "OmniTrust (FKA INTEGRITY Security Services)",
        logo: "/src/assets/images/experiences/omnitrust_logo.jpg",
        position: "Software Engineer",
        period: "January - June 2026",
        location: "Boston, MA",
        description: "Building key components of the Device Lifecycle Management (DLM) platform that secures over 2 billion IoT and automotive devices worldwide through enterprise PKI infrastructure and cryptographic services.",
        details: {
            responsibilities: [
                "Developing core components of the DLM platform-as-a-service for secure device provisioning, key management, and certificate lifecycle operations",
                "Implementing cryptographic services for digital signing, x.509 certificate generation, and secure key distribution across global manufacturing supply chains",
                "Building backend systems supporting high-availability PKI infrastructure with FIPS 140-2 Level 3 compliance",
                "Contributing to OTA update delivery systems enabling secure software deployment to millions of connected devices",
                "Working with enterprise-scale security infrastructure serving Fortune 100 automotive and IoT manufacturers"
            ],
            technologies: ["JavaScript", "C", "React", "Node.js", "Linux", "Docker", "Jenkins", "Proxmox", "PKI", "x.509 Certificates", "Cryptography", "RPC", "RESTful APIs"],
            achievements: [
                "Contributing to platform infrastructure securing 2+ billion devices across automotive, aerospace, medical, and industrial sectors",
                "Working on systems that sign and manage over 3 billion software images annually",
                "Supporting enterprise PKI services deployed across 30+ vehicle assembly plants for major automotive OEMs"
            ]
        }
    },
    {
        id: 3,
        company: "Sponsor for Educational Opportunity Program",
        logo: "/src/assets/images/experiences/seo_logo.png",
        position: "Tech Developer",
        period: "June - August 2025",
        location: "New York - Online",
        description: "Technical and interpersonal skills, training, and mentoring to build a strong foundation for a career in software development.",
        details: {
            responsibilities: [
                "Participating in professional development workshops to enhance technical and interpersonal skills",
                "Receiving 1:1 mentorship from experienced industry professionals",
                "Engaging with other members in the SEO community",
                "Gaining software development skills by working in SCRUM-like teams to design, test, and implement full-stack applications"
            ],
            technologies: ["Python", "Bash", "Git", "GitHub", "RESTful APIs", "Go", "SQL", "HTML", "CSS", "JavaScript", "SQLAlchemy", "Pandas", "Ansible", "Terraform"],
            achievements: [
                "Completed 300+ hours of rigorous computer science and software engineering training focused on data structures, algorithms, and full-stack web development"
            ]
        }
    },
    {
        id: 4,
        company: "MFS Investment Management",
        logo: "/src/assets/images/experiences/mfs_logo.png",
        position: "Full-Stack Software Engineer",
        period: "January - July 2025",
        location: "Boston, MA",
        description: "Building internal tools and full-stack applications to support global compliance, reporting, and operational workflows at scale.",
        details: {
            responsibilities: [
                "Developing full-stack web applications and internal tools to streamline global compliance and reporting processes",
                "Integrating and deploying internal LLMs and RAG techniques to enhance employee productivity through natural language interfaces",
                "Creating and managing CI/CD pipelines with Red Hat OpenShift for scalable deployment environments",
                "Automating regulatory data parsing, report generation, and email dissemination",
                "Implementing secure certificate management systems across international server infrastructure",
                "Conducting technical interviews and mentoring incoming DevSecOps team members"
            ],
            technologies: ["Python", "TypeScript", "React", "Red Hat OpenShift", "Kubernetes", "Ansible", "SonarQube", "Azure", "Azure DevOps", "Google Gemma 3", "PostgreSQL", "Prometheus", "Auth.js", "CyberArk", "RESTful APIs"],
            achievements: [
                "Saved 100+ hours monthly for compliance team by developing web portal originally scoped for 6 engineers over 6 months with $500K budget - now actively used and demoed to CTO, CEO, and LCERM",
                "Reduced resource onboarding time from weeks to seconds by developing self-service onboarding portal",
                "Designed and deployed telemetry-based reporting portal improving metric visibility across departments",
                "Implemented automated regulatory compliance tools eliminating monthly manual outreach efforts",
                "Successfully deployed internal LLM assistants leveraging OpenAI API and Azure AI Search",
                "Mentored incoming co-op, enhancing team productivity and knowledge sharing"
            ]
        }
    },
    {
        id: 5,
        company: "Lastgateway Enterprise",
        logo: "/src/assets/images/experiences/lastgateway_logo.png",
        position: "Founder",
        period: "January 2019 - January 2025",
        location: "Howell, NJ",
        description: "Founded a Platform/Software as a Service business providing computing resources to organizations within the community.",
        details: {
            responsibilities: [
                "Founded a Platform/Software as a Service business providing computing resources",
                "Designing, implementing and servicing over 30+ software resources simultaneously",
                "Maintaining a consistent 99.9% uptime for customer resources",
                "Managing infrastructure and cloud services for multiple organizations",
                "Implementing cost-effective solutions as alternatives to traditional cloud providers"
            ],
            technologies: ["Linux", "Docker", "Cloud Infrastructure", "Networking", "Server Management"],
            achievements: [
                "Reduced server and compute costs by more than half compared to traditional cloud providers",
                "Significantly increased customer's operational efficiency and reduced IT workload",
                "Maintained 99.9% uptime ensuring continuous availability of services",
                "Serviced over 5 organizations within the community with reliable computing resources"
            ]
        }
    },
    {
        id: 6,
        company: "AWS Skills Center",
        logo: "/src/assets/images/experiences/aws_logo.jpg",
        position: "AWS Academy Trainee",
        period: "May - June 2024",
        location: "Seattle, WA",
        description: "Learned foundational cloud computing concepts and gained hands-on experience with AWS tools and services.",
        details: {
            responsibilities: [
                "Understanding core cloud computing concepts and AWS service offerings",
                "Learning to set up and manage scalable cloud infrastructure using AWS tools",
                "Configuring Virtual Private Clouds (VPCs) and subnets for secure networking",
                "Researching Auto Scaling groups to optimize application performance during traffic surges",
                "Deploying and managing EC2 instances and RDS databases for high availability",
                "Exploring best practices for cloud security and cost optimization"
            ],
            technologies: ["AWS", "Networking", "TCP", "Next.js", "WordPress"],
            achievements: [
                "Set up highly scalable EC2 instance and Amazon RDS database, optimizing application performance",
                "Developed EC2 Auto Scaling group boosting application capacity by 50% during load tests with up to 150 concurrent users",
                "Created Virtual Private Cloud with 4 subnets across 2 availability zones with Elastic Load Balancing"
            ],
            projects: [
                "Student Data Management System: Developed web application using AWS services to manage mock student data including registration, attendance, and grades"
            ]
        }
    },
    {
        id: 7,
        company: "Polygence",
        logo: "/src/assets/images/experiences/polygence_logo.png",
        position: "AI Research Assistant",
        period: "April - August 2021",
        location: "Remote",
        description: "Researched suggestion-based advertisement alongside a Stanford University Masters Student to determine an effective model for suggesting new music.",
        details: {
            responsibilities: [
                "Researched suggestion-based advertisement for music recommendations",
                "Tested neural network approaches using PyTorch Lightning",
                "Assisted with data cleaning, preparation, and loading for model training",
                "Collaborated with Stanford University Masters Student on research project",
                "Analyzed model performance and suggestion accuracy"
            ],
            technologies: ["Python", "PyTorch", "Neural Networks", "Data Analysis", "Machine Learning"],
            achievements: [
                "Successfully processed and prepared over 1 million songs for training the model",
                "Implemented effective data cleaning pipelines for large datasets",
                "Contributed to a neural network approach for modeling music preferences"
            ]
        }
    }
];
