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
        company: "IBM",
        logo: "/images/experiences/ibm_logo.png",
        position: "Customer Success Engineer Co-op",
        period: "August 2026 - Present",
        location: "San Francisco, CA",
        description: "Co-op on the watsonx AI team, helping enterprise customers adopt and succeed with IBM's AI platform.",
        details: {
            responsibilities: [
                "Working on the watsonx AI team as a Customer Success Engineer co-op",
                "Supporting enterprise customers in deploying and scaling AI workloads on watsonx"
            ],
            technologies: ["Python", "watsonx", "AI/ML", "Kubernetes", "Red Hat OpenShift", "Docker"],
            achievements: [
                "Selected for IBM's Customer Success Engineer co-op program on the watsonx AI team"
            ]
        }
    },
    {
        id: 2,
        company: "Bank of America",
        logo: "/images/experiences/bofa_logo.png",
        position: "Software Engineer Intern",
        period: "June - August 2026",
        location: "Pennington, NJ",
        description: "Automated infrastructure provisioning and scaling for the bank's SingleStore and Cassandra database fleets, replacing manual multi-team workflows with Terraform-driven deployments.",
        details: {
            responsibilities: [
                "Migrated SingleStore VM deployment to Terraform with tiered configurations (XS-XL) replicable across availability zones",
                "Vertically scaled SingleStore clusters backing the bank's Customer Reference Data Store (CRDS) cache to reduce reliance on costly mainframe compute for trade processing",
                "Implemented permissioning and access-monitoring capabilities for the Cassandra database fleet across Linux hosts",
                "Replaced a manual multi-team provisioning workflow with self-service infrastructure as code"
            ],
            technologies: ["Terraform", "Python", "Bash", "SQL", "SingleStore", "Cassandra", "Linux", "Microsoft Copilot Studio"],
            achievements: [
                "Cut provisioning time for new SingleStore clusters from multiple weeks to 1-4 hours by migrating VM deployment to Terraform",
                "Reduced reliance on costly mainframe compute for trade processing by vertically scaling the CRDS cache clusters",
                "Enabled SOX audit readiness for the bank's Cassandra database fleet through permissioning and access monitoring",
                "Won 2nd place among 19 teams in a bank-wide codeathon with an AI agent that drafts and validates requirements, cutting FRD prototyping from weeks to seconds with 93% pilot-user engagement"
            ]
        }
    },
    {
        id: 3,
        company: "OmniTrust (FKA INTEGRITY Security Services)",
        logo: "/images/experiences/omnitrust_logo.jpg",
        position: "Software Engineer Co-op",
        period: "January - June 2026",
        location: "Boston, MA",
        description: "Developed core cryptographic services for a distributed PKI platform securing manufacturing supply chains and millions of connected automotive and IoT devices.",
        details: {
            responsibilities: [
                "Developed core cryptographic services for digital signing and X.509 certificate generation supporting secure manufacturing supply chains",
                "Implemented ML-DSA (Post-Quantum Cryptography) signing logic for certificate signing requests (CSRs) on a distributed PKI platform",
                "Designed customer-specific solutions including FOTA certificate distribution pipelines for ECU systems",
                "Enabled secure over-the-air updates for embedded automotive devices"
            ],
            technologies: ["C", "JavaScript", "React", "Node.js", "Linux", "Docker", "Jenkins", "PKI", "X.509 Certificates", "ML-DSA", "Post-Quantum Cryptography", "RESTful APIs"],
            achievements: [
                "Shipped cryptographic services supporting Fortune 100 partners and millions of connected devices",
                "Ensured platform readiness for NIST PQC standards by implementing ML-DSA signing for CSRs",
                "Reduced manual provisioning effort by 40% through customer-specific FOTA certificate distribution pipelines"
            ]
        }
    },
    {
        id: 4,
        company: "Sponsors for Educational Opportunity (SEO)",
        logo: "/images/experiences/seo_logo.png",
        position: "Tech Developer & Career Intern",
        period: "June 2025 - January 2026",
        location: "New York, NY",
        description: "Strengthened software engineering skills through 1:1 mentorship with senior engineers from partner companies, workshops, and code reviews focused on clean architecture and best practices.",
        details: {
            responsibilities: [
                "Participated in 20+ technical workshops and mock interviews with senior engineers from partner companies",
                "Received 1:1 mentorship and code reviews focused on clean architecture and best practices",
                "Engaged with other members in the SEO community",
                "Built full-stack applications in SCRUM-like teams"
            ],
            technologies: ["Python", "Bash", "Git", "GitHub", "RESTful APIs", "Go", "SQL", "HTML", "CSS", "JavaScript", "SQLAlchemy", "Pandas", "Ansible", "Terraform"],
            achievements: [
                "Completed 300+ hours of rigorous computer science and software engineering training focused on data structures, algorithms, and full-stack web development",
                "Participated in 20+ workshops and mock interviews with senior engineers from partner companies"
            ]
        }
    },
    {
        id: 5,
        company: "MFS Investment Management",
        logo: "/images/experiences/mfs_logo.png",
        position: "Full-Stack Software Engineer Co-op",
        period: "January - August 2025",
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
                "Saved 100+ hours monthly for the compliance team with a FastAPI and React web portal that parses stakeholder documents - originally scoped for 6 engineers, 6 months, and $500K - demoed to the CEO and Enterprise Risk Management",
                "Reduced onboarding from weeks to seconds via a self-service portal serving 3000+ employees daily",
                "Enabled 10,000+ documents to be searchable via natural language by integrating Azure LLMs with RAG techniques",
                "Cut deployment time 85% (2 hours to 15 minutes) using OpenShift/Kubernetes CI/CD across 3 environments",
                "Designed and deployed a telemetry-based reporting portal improving metric visibility across departments",
                "Mentored incoming co-op, enhancing team productivity and knowledge sharing"
            ]
        }
    },
    {
        id: 6,
        company: "Lastgateway Enterprise",
        logo: "/images/experiences/lastgateway_logo.png",
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
        id: 7,
        company: "AWS Skills Center",
        logo: "/images/experiences/aws_logo.jpg",
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
        id: 8,
        company: "Polygence",
        logo: "/images/experiences/polygence_logo.png",
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
