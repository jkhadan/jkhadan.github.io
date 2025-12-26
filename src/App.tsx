import { useState } from 'react';
import { Layout } from './components/Layout';
import { Navigation } from './components/Navigation';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Experience } from './sections/Experience';
import { SkillsEducation } from './sections/SkillsEducation';
import { ClubInvolvement } from './sections/ClubInvolvement';
import { Projects } from './sections/Projects';
import { AllProjectsModal } from './sections/AllProjects';
import { Contact } from './sections/Contact';

function App() {
    const [isAllProjectsOpen, setIsAllProjectsOpen] = useState(false);

    const openAllProjects = () => setIsAllProjectsOpen(true);
    const closeAllProjects = () => setIsAllProjectsOpen(false);

    return (
        <Layout>
            <Navigation onOpenAllProjects={openAllProjects} />
            <Hero />
            <About />
            <Experience />
            <Projects onOpenAllProjects={openAllProjects} />
            <SkillsEducation />
            <ClubInvolvement />
            <Contact />
            <AllProjectsModal isOpen={isAllProjectsOpen} onClose={closeAllProjects} />
        </Layout>
    );
}

export default App;