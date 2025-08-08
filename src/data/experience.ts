import { Experience } from "@/types/index";

const imgRoot = "/app/images/experiences/"

export const experiences: Experience[] = 
[
  {
    id: 1,
    company: "Sponsor for Educational Opportunity Program",
    logo: imgRoot + "seo_logo.png",
    position: "Tech Developer",
    period: "June - August 2025",
    location: "New York - Online",
    description: "Technical and interpersonal skills, training, and mentoring to build a strong foundation for a career in software development.",
    details: {
      responsibilities: [
        "Participating in professional development workshops to enhance technical and interpersonal skills.",
        "Receiving 1:1 mentorship from experienced industry professionals",
        "Engaging with other members in the SEO community",
        "Gaining software development skills by working in SCRUM-like teams to design, test, and implement full-stack applications",

      ],
      technologies: ["Python", "Bash", "Git", "GitHub", "RESTful APIs", "SQL", "HTML", "CSS", "JavaScript", "Object-Relational Mappers", "SQLAlchemy", "Pandas", "Ansible", "Terraform"],
      achievements: [
        "Completing 300+ hours of rigorous computer science and software engineering training focused on data structures, algorithms, and full-stack web development."
      ]
    }
  },
  {
    id: 2,
    company: "MFS Investment Management",
    logo: imgRoot + "mfs_logo.png",
    position: "Full-Stack Software Engineer",
    period: "January - July 2025",
    location: "Boston, MA",
    description: "Building internal tools and full-stack applications to support global compliance, reporting, and operational workflows at scale.",
    details: {
      responsibilities: [
        "Developing full-stack web applications and internal tools to streamline global compliance, reporting processes, and improve operational efficiency.",
        "Integrating and deploying internal Large Language Models (LLMs) and Retrieval-Augmented Generation (RAG) techniques to enhance employee productivity and data aggregation through natural language interfaces.",
        "Creating and managing CI/CD pipelines with Red Hat OpenShift to enable scalable deployment environments.",
        "Automating regulatory data parsing, report generation, and email dissemination, significantly reducing manual compliance tasks.",
        "Implementing secure certificate management systems across international server infrastructure, utilizing encryption standards like Fernet.",
        "Conducting technical interviews and mentoring incoming DevSecOps team members."
      ],
      technologies: [
        "Python",
        "TypeScript",
        "React",
        "Red Hat OpenShift",
        "Kubernetes",
        "Ansible",
        "SonarQube",
        "Azure",
        "Azure DevOps",
        "Google Gemma 3 (LLM)",
        "PostgreSQL",
        "Prometheus",
        "Coralogix",
        "Atlassian Suite (Jira, Bitbucket)",
        "Auth.js",
        "CyberArk",
        "RESTful APIs"
      ],
      achievements: [
        "Saving over 100+ hours monthly for the compliance team by developing a web portal—originally scoped for 6 engineers over 6 months with a $500K budget—now actively used and demoed to the CTO, CEO, and LCERM (Legal, Compliance, Enterprise Risk Management)",
        "Reduced resource onboarding time from weeks to seconds and significantly enhanced operational efficiency company-wide by developing a self-service onboarding portal.",
        "Designed and deployed a telemetry-based reporting portal that improved metric visibility and traceability across departments.",
        "Implemented automated regulatory compliance tools that eliminated monthly manual outreach efforts, enhancing accuracy and timeliness of compliance processes.",
        "Successfully deployed internal lightweight LLM assistants leveraging the OpenAI API and Azure AI Search to facilitate efficient natural language queries across internal data sources.",
        "Facilitated scalable and reliable deployment pipelines on Red Hat OpenShift, establishing best practices for broader internal software adoption.",
        "Mentoring and training incoming co-op, enhancing team productivity and knowledge sharing",
      ]
    }
  },
  {
    id: 3,
    company: "Lastgateway Enterprise",
    logo: imgRoot + "lastgateway_logo.png",
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
    id: 4,
    company: "AWS Skills Center",
    logo: imgRoot + "aws_logo.jpg",
    position: "AWS Academy Student",
    period: "May - June 2024",
    location: "Seattle, WA",
    description: "Learned foundational cloud computing concepts and gained hands-on experience with AWS tools and services.",
    details: {
      responsibilities: [
        "Understanding core cloud computing concepts and AWS service offerings.",
        "Learning to set up and manage scalable cloud infrastructure using AWS tools.",
        "Configuring Virtual Private Clouds (VPCs) and subnets for secure networking.",
        "Researching Auto Scaling groups to optimize application performance during traffic surges.",
        "Deploying and managing EC2 instances and RDS databases for high availability.",
        "Exploring best practices for cloud security and cost optimization."
      ],
      technologies: ["AWS", "Networking", "TCP", "Next.js", "WordPress"],
      achievements: [
        "Set up a highly scalable EC2 instance and Amazon RDS database, optimizing application performance by separating its components.",
        "Developed an EC2 Auto Scaling group that boosted application capacity by 50% during load tests, automatically adjusting to traffic surges with up to 150 concurrent users, ensuring uninterrupted service during peak loads.",
        "Created a Virtual Private Cloud with 4 subnets distributed across 2 availability zones, configuring Elastic Load Balancing to manage up to 3 EC2 instances."
      ],
      projects: [
        "Student Data Management System: Developed a web application using AWS services to manage mock student data, including registration, attendance, and grades."
      ]
    } 
  },
  {
    id: 5,
    company: "Polygence",
    logo: imgRoot + "polygence_logo.png",
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