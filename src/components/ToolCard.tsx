
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  delay?: number;
}

const ToolCard = ({ title, description, icon, to, delay = 0 }: ToolCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={to}>
        <div className="glass rounded-xl overflow-hidden h-full">
          <div className="p-5">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-lg bg-structiq-purple/20 flex items-center justify-center text-structiq-purple">
                {icon}
              </div>
              <h3 className="ml-3 font-medium">{title}</h3>
            </div>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ToolCard;
