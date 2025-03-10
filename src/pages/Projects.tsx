
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FolderOpen, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NavBar from '@/components/NavBar';
import ProjectCard from '@/components/ProjectCard';

const Projects = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState([
    {
      id: '1',
      title: 'Residential Building Analysis',
      date: 'June 15, 2023',
      type: 'Beam Analysis'
    },
    {
      id: '2',
      title: 'Commercial Column Design',
      date: 'August 3, 2023',
      type: 'Column Design'
    }
  ]);

  const handleOpen = (title: string) => {
    toast({
      title: "Opening Project",
      description: `Opening ${title}`,
    });
  };

  const handleExport = (title: string) => {
    toast({
      title: "Exporting Project",
      description: `Exporting ${title} as PDF`,
    });
  };

  const handleDelete = (id: string, title: string) => {
    setProjects(projects.filter(project => project.id !== id));
    
    toast({
      title: "Project Deleted",
      description: `${title} has been deleted`,
    });
  };

  const createNewProject = () => {
    toast({
      title: "Create New Project",
      description: "Feature coming soon",
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pb-24"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FolderOpen className="mr-3 text-structiq-purple" size={24} />
            <h1 className="text-2xl font-bold">Projects</h1>
          </div>
          
          <button
            onClick={createNewProject}
            className="flex items-center bg-structiq-purple text-white px-3 py-2 rounded-lg text-sm"
          >
            <PlusCircle size={16} className="mr-1" />
            New Project
          </button>
        </div>
        
        <div className="space-y-4">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              date={project.date}
              type={project.type}
              onOpen={() => handleOpen(project.title)}
              onExport={() => handleExport(project.title)}
              onDelete={() => handleDelete(project.id, project.title)}
              delay={index}
            />
          ))}
          
          {projects.length === 0 && (
            <div className="glass rounded-xl p-8 text-center">
              <FolderOpen size={40} className="mx-auto mb-3 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No Projects Found</h3>
              <p className="text-gray-400 mb-4">Create your first project to get started</p>
              <button
                onClick={createNewProject}
                className="bg-structiq-purple hover:bg-structiq-purple/90 transition-colors text-white px-4 py-2 rounded-lg"
              >
                Create New Project
              </button>
            </div>
          )}
        </div>
      </div>
      
      <NavBar />
    </motion.div>
  );
};

export default Projects;
