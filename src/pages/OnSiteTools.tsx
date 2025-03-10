
import { motion } from 'framer-motion';
import { Wrench } from 'lucide-react';
import NavBar from '@/components/NavBar';
import LevelingTool from '@/components/LevelingTool';

const OnSiteTools = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pb-24"
    >
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Wrench className="mr-3 text-structiq-purple" size={24} />
          <h1 className="text-2xl font-bold">On-Site Tools</h1>
        </div>
        
        <LevelingTool />
      </div>
      
      <NavBar />
    </motion.div>
  );
};

export default OnSiteTools;
