
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { 
  Calculator, Scale, CheckSquare, Wrench, FolderOpen, ChevronRight
} from 'lucide-react';
import NavBar from '@/components/NavBar';
import ToolCard from '@/components/ToolCard';

const Home = () => {
  const [date, setDate] = useState('');
  const [greeting, setGreeting] = useState('');
  
  useEffect(() => {
    // Set current date
    const now = new Date();
    setDate(now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
    
    // Set greeting based on time of day
    const hour = now.getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold">{greeting}</h1>
          <p className="text-gray-400 text-sm">{date}</p>
        </motion.div>
        
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Structural Calculators</h2>
            <ChevronRight size={18} className="text-gray-500" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <ToolCard
              title="Beam Analysis"
              description="Calculate forces, moments, and deflections"
              icon={<Calculator size={20} />}
              to="/structural-calculators"
              delay={0}
            />
            <ToolCard
              title="Column Design"
              description="Design concrete or steel columns"
              icon={<Calculator size={20} />}
              to="/structural-calculators"
              delay={1}
            />
          </div>
        </motion.section>
        
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Material Resources</h2>
            <ChevronRight size={18} className="text-gray-500" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <ToolCard
              title="Unit Converter"
              description="Convert between different units"
              icon={<Scale size={20} />}
              to="/material-converters"
              delay={2}
            />
            <ToolCard
              title="Material Database"
              description="Properties of common materials"
              icon={<Scale size={20} />}
              to="/material-converters"
              delay={3}
            />
          </div>
        </motion.section>
        
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">On-Site Tools</h2>
            <ChevronRight size={18} className="text-gray-500" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <ToolCard
              title="Leveling Tool"
              description="Digital level for on-site measurements"
              icon={<Wrench size={20} />}
              to="/on-site-tools"
              delay={4}
            />
            <ToolCard
              title="Code Checker"
              description="Verify compliance with design codes"
              icon={<CheckSquare size={20} />}
              to="/design-code-checks"
              delay={5}
            />
          </div>
        </motion.section>
        
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Projects</h2>
            <ChevronRight size={18} className="text-gray-500" />
          </div>
          
          <div className="glass rounded-xl p-5 text-center">
            <FolderOpen size={28} className="mx-auto mb-2 text-gray-400" />
            <p className="text-gray-400">No recent projects</p>
            <button 
              className="mt-3 text-sm bg-structiq-purple/20 text-structiq-purple px-4 py-2 rounded-lg hover:bg-structiq-purple/30 transition-colors"
              onClick={() => window.location.href = '/projects'}
            >
              Create New Project
            </button>
          </div>
        </motion.section>
      </div>
      
      <NavBar />
    </div>
  );
};

export default Home;
