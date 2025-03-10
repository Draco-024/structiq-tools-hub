
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calculator, Scale, CheckSquare, Wrench, FolderOpen, Settings } from 'lucide-react';

const NavBar = () => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
    const isActive = location.pathname === to;
    
    return (
      <Link to={to} className="flex flex-col items-center px-3">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${isActive ? 'bg-structiq-purple text-white' : 'text-gray-400'}`}>
          <Icon size={20} />
        </div>
        <span className={`text-xs mt-1 transition-colors ${isActive ? 'text-white' : 'text-gray-500'}`}>
          {label}
        </span>
      </Link>
    );
  };

  return (
    <div className={`fixed bottom-0 inset-x-0 z-50 transition-transform duration-300 ease-in-out ${visible ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="glass p-2 mx-4 mb-4 rounded-2xl">
        <div className="flex items-center justify-around">
          <NavItem to="/home" icon={Home} label="Home" />
          <NavItem to="/structural-calculators" icon={Calculator} label="Calculators" />
          <NavItem to="/material-converters" icon={Scale} label="Materials" />
          <NavItem to="/design-code-checks" icon={CheckSquare} label="Codes" />
          <NavItem to="/on-site-tools" icon={Wrench} label="Tools" />
          <NavItem to="/projects" icon={FolderOpen} label="Projects" />
          <NavItem to="/settings" icon={Settings} label="Settings" />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
