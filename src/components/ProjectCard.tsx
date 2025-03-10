
import { motion } from 'framer-motion';
import { Calendar, FolderOpen, FileText, Download, Trash2 } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  date: string;
  type: string;
  onOpen: () => void;
  onExport: () => void;
  onDelete: () => void;
  delay?: number;
}

const ProjectCard = ({ 
  title, 
  date, 
  type,
  onOpen,
  onExport,
  onDelete,
  delay = 0 
}: ProjectCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className="glass rounded-xl overflow-hidden"
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium">{title}</h3>
          <div className="bg-structiq-purple/20 text-structiq-purple text-xs rounded-full px-2 py-1">
            {type}
          </div>
        </div>
        
        <div className="flex items-center text-xs text-gray-400 mb-4">
          <Calendar size={14} className="mr-1" />
          <span>{date}</span>
        </div>
        
        <div className="flex justify-between">
          <button 
            onClick={onOpen}
            className="flex items-center text-sm bg-structiq-purple/10 hover:bg-structiq-purple/20 transition-colors text-structiq-purple px-3 py-1.5 rounded-lg"
          >
            <FolderOpen size={14} className="mr-1.5" />
            Open
          </button>
          
          <button 
            onClick={onExport}
            className="flex items-center text-sm bg-gray-700/20 hover:bg-gray-700/30 transition-colors text-gray-300 px-3 py-1.5 rounded-lg"
          >
            <FileText size={14} className="mr-1.5" />
            Report
          </button>
          
          <button 
            onClick={onExport}
            className="flex items-center text-sm bg-gray-700/20 hover:bg-gray-700/30 transition-colors text-gray-300 px-3 py-1.5 rounded-lg"
          >
            <Download size={14} className="mr-1.5" />
            Export
          </button>
          
          <button 
            onClick={onDelete}
            className="flex items-center text-sm bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-400 w-8 justify-center py-1.5 rounded-lg"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
