import React, { useState } from 'react';
import { Layout, GraduationCap, Terminal, Cloud } from 'lucide-react';
import SkillCategory from '@/components/ui/SkillCategory';
import ClubCard from '@/components/clubs/ClubCard';
import ClubDetails from '@/components/clubs/ClubDetails';
import CourseDetails from '@/components/courses/CourseDetails';
import { clubs } from '@/data/skills';
import { relevantCourses } from '@/data/skills';
import { Club, Course } from '@/types';

const Skills: React.FC = () => {
    const languages = ["Python", "TypeScript", "Java", "C#", "C++", "C", "Rust", "Go", "SQL"];
    const frameworks = ["RESTful", "React", "Next.js", "NumPy", "Pandas", "PyTorch"];
    const tools = ["Git", "Kubernetes", "Docker", "AWS", "Linux", "Ansible", "Red Hat OpenShift", "Azure", "Jenkins", "PowerBI"];
    
    

    const [selectedClub, setSelectedClub] = useState<Club | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    return (
        <section id="skills" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  Skills & Education
                  </span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
            </div>
            
            {/* Technical Skills */}
            <div className="grid md:grid-cols-2 gap-16 items-start mb-16">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-6">Technical Skills</h3>
                
                <SkillCategory 
                  icon={<Terminal className="text-blue-600 dark:text-blue-400" size={24} />}
                  title="Programming Languages"
                  skills={languages}
                />
                
                <SkillCategory 
                  icon={<Layout className="text-purple-600 dark:text-purple-400" size={24} />}
                  title="Frameworks & Libraries"
                  skills={frameworks}
                />
                
                <SkillCategory 
                  icon={<Cloud className="text-blue-600 dark:text-blue-400" size={24} />}
                  title="Tools & Platforms"
                  skills={tools}
                />
              </div>
              
              <div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                  <h3 className="text-2xl font-bold mb-6 flex items-center">
                    <GraduationCap className="text-blue-600 dark:text-blue-400 mr-3" size={24} />
                    Relevant Coursework
                  </h3>
                  
                  <ul className="space-y-3">
                    {relevantCourses.map((course, index) => (
                      <li 
                        key={index} 
                        className="flex items-center bg-blue-50 dark:bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors"
                        onClick={() => setSelectedCourse(course)}
                      >
                        <span className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded-full mr-3 text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="text-gray-800 dark:text-gray-200 font-medium">{course.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Club Involvement */}
            <div className="mt-16">
              <div className="text-center mb-12">
                <h3 className="text-2xl md:text-3xl font-bold">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    Club Involvement
                  </span>
                </h3>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-2"></div>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-4">
                  I&apos;m actively engaging with student organizations to build skills and contribute to the community
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {clubs.map((club, index) => (
                  <ClubCard 
                    key={index} 
                    club={club} 
                    onSelect={setSelectedClub} 
                  />
                ))}
              </div>
            </div>
            
            {selectedClub && (
              <ClubDetails 
                club={selectedClub} 
                onClose={() => setSelectedClub(null)} 
              />
            )}

            {selectedCourse && (
              <CourseDetails
                course={selectedCourse}
                onClose={() => setSelectedCourse(null)}
              />
            )}
        </div>
        </section>
    );
};

export default Skills;