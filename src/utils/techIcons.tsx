import React from 'react';
import {
    SiPython, SiTypescript, SiReact, SiDocker, SiKubernetes,
    SiPostgresql, SiGit, SiGithub, SiAnsible, SiTerraform,
    SiLinux, SiPytorch, SiAmazon, SiNextdotjs, SiWordpress,
    SiGo, SiSharp, SiUnity, SiTailwindcss, SiMysql, SiHtml5,
    SiCss3, SiJavascript, SiSupabase, SiSelenium, SiDiscord
} from 'react-icons/si';
import { VscAzure } from 'react-icons/vsc';
import { TbBrandOpenai, TbApi, TbSql } from 'react-icons/tb';
import { FaNetworkWired, FaCloud, FaServer, FaBrain, FaRobot } from 'react-icons/fa';
import { BiLogoVisualStudio } from 'react-icons/bi';

export const techIconMap: Record<string, React.ReactNode> = {
    'Python': <SiPython />,
    'TypeScript': <SiTypescript />,
    'JavaScript': <SiJavascript />,
    'React': <SiReact />,
    'Docker': <SiDocker />,
    'Kubernetes': <SiKubernetes />,
    'PostgreSQL': <SiPostgresql />,
    'MySQL': <SiMysql />,
    'Git': <SiGit />,
    'GitHub': <SiGithub />,
    'Ansible': <SiAnsible />,
    'Terraform': <SiTerraform />,
    'Linux': <SiLinux />,
    'PyTorch': <SiPytorch />,
    'AWS': <SiAmazon />,
    'Azure': <VscAzure />,
    'Azure DevOps': <VscAzure />,
    'Go': <SiGo />,
    'Next.js': <SiNextdotjs />,
    'WordPress': <SiWordpress />,
    'OpenAI API': <TbBrandOpenai />,
    'Google Gemma 3': <FaBrain />,
    'RESTful APIs': <TbApi />,
    'SQL': <TbSql />,
    'Networking': <FaNetworkWired />,
    'Cloud Infrastructure': <FaCloud />,
    'Cloud': <FaCloud />,
    'Server Management': <FaServer />,
    'Red Hat OpenShift': <SiKubernetes />,
    'Neural Networks': <FaBrain />,
    'Machine Learning': <FaBrain />,
    'Data Analysis': <FaBrain />,
    'C#': <SiSharp />,
    'ASP.NET': <BiLogoVisualStudio />,
    'Unity': <SiUnity />,
    'Tailwind CSS': <SiTailwindcss />,
    'Tailwind': <SiTailwindcss />,
    'HTML': <SiHtml5 />,
    'CSS': <SiCss3 />,
    'Supabase': <SiSupabase />,
    'Selenium': <SiSelenium />,
    'Discord': <SiDiscord />,
    'NLP': <FaRobot />,
    'Chatbot': <FaRobot />
};

export const getTechIcon = (techName: string): React.ReactNode | null => {
    return techIconMap[techName] || null;
};
