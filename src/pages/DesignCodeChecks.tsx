
import { motion } from 'framer-motion';
import { CheckSquare } from 'lucide-react';
import NavBar from '@/components/NavBar';
import DesignCodeChecker from '@/components/DesignCodeChecker';

const DesignCodeChecks = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pb-24"
    >
      <div className="p-6">
        <div className="flex items-center mb-6">
          <CheckSquare className="mr-3 text-structiq-purple" size={24} />
          <h1 className="text-2xl font-bold">Design Code Checks</h1>
        </div>
        
        <DesignCodeChecker />
      </div>
      
      <NavBar />
    </motion.div>
  );
};

export default DesignCodeChecks;
