
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';
import NavBar from '@/components/NavBar';
import BeamCalculator from '@/components/BeamCalculator';

const StructuralCalculators = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pb-24"
    >
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Calculator className="mr-3 text-structiq-purple" size={24} />
          <h1 className="text-2xl font-bold">Structural Calculators</h1>
        </div>
        
        <BeamCalculator />
      </div>
      
      <NavBar />
    </motion.div>
  );
};

export default StructuralCalculators;
