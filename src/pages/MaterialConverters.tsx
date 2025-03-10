
import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';
import NavBar from '@/components/NavBar';
import MaterialConverter from '@/components/MaterialConverter';

const MaterialConverters = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pb-24"
    >
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Scale className="mr-3 text-structiq-purple" size={24} />
          <h1 className="text-2xl font-bold">Material Converters</h1>
        </div>
        
        <MaterialConverter />
      </div>
      
      <NavBar />
    </motion.div>
  );
};

export default MaterialConverters;
