
import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Moon, 
  Sun, 
  Palette, 
  Globe, 
  CloudUpload,
  LogOut
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NavBar from '@/components/NavBar';

const Settings = () => {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(true);
  const [units, setUnits] = useState('metric');
  const [syncEnabled, setSyncEnabled] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast({
      title: `${!darkMode ? 'Dark' : 'Light'} Mode Enabled`,
      description: `Theme has been changed to ${!darkMode ? 'dark' : 'light'} mode.`,
    });
  };

  const toggleUnits = () => {
    const newUnits = units === 'metric' ? 'imperial' : 'metric';
    setUnits(newUnits);
    toast({
      title: `Units Changed to ${newUnits === 'metric' ? 'Metric' : 'Imperial'}`,
      description: `Measurement units have been updated.`,
    });
  };

  const toggleSync = () => {
    setSyncEnabled(!syncEnabled);
    toast({
      title: `Cloud Sync ${!syncEnabled ? 'Enabled' : 'Disabled'}`,
      description: `Cloud synchronization has been ${!syncEnabled ? 'enabled' : 'disabled'}.`,
    });
  };

  const signOut = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Sign out functionality will be available in a future update.",
    });
  };

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    description, 
    action, 
    control 
  }: { 
    icon: any; 
    title: string; 
    description: string; 
    action: () => void; 
    control: React.ReactNode;
  }) => (
    <div className="glass p-4 rounded-xl mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-start">
          <div className="w-10 h-10 rounded-lg bg-structiq-purple/20 flex items-center justify-center text-structiq-purple mr-3">
            <Icon size={20} />
          </div>
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>
        {control}
      </div>
    </div>
  );

  const Switch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-structiq-purple' : 'bg-gray-700'
      }`}
      onClick={onChange}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pb-24"
    >
      <div className="p-6">
        <div className="flex items-center mb-6">
          <SettingsIcon className="mr-3 text-structiq-purple" size={24} />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        
        <div className="glass rounded-xl p-5 mb-6">
          <div className="flex items-center">
            <div className="w-14 h-14 rounded-full bg-structiq-purple/20 flex items-center justify-center text-structiq-purple">
              <User size={28} />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Guest User</h2>
              <p className="text-sm text-gray-400">Free Account</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-800">
            <button 
              onClick={signOut}
              className="flex items-center text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </button>
          </div>
        </div>
        
        <h2 className="text-lg font-semibold mb-4">Preferences</h2>
        
        <SettingItem
          icon={darkMode ? Moon : Sun}
          title="Appearance"
          description={`${darkMode ? 'Dark' : 'Light'} mode is currently active`}
          action={toggleDarkMode}
          control={<Switch checked={darkMode} onChange={toggleDarkMode} />}
        />
        
        <SettingItem
          icon={Palette}
          title="Accent Color"
          description="Customize app accent color"
          action={() => {}}
          control={
            <button className="w-6 h-6 rounded-full bg-structiq-purple border-2 border-white"></button>
          }
        />
        
        <SettingItem
          icon={Globe}
          title="Units System"
          description={`Using ${units === 'metric' ? 'Metric' : 'Imperial'} units`}
          action={toggleUnits}
          control={
            <button 
              onClick={toggleUnits}
              className="px-3 py-1 text-xs bg-black/30 rounded-full">
              {units === 'metric' ? 'Metric' : 'Imperial'}
            </button>
          }
        />
        
        <SettingItem
          icon={CloudUpload}
          title="Cloud Sync"
          description={`${syncEnabled ? 'Enabled' : 'Disabled'} for cross-device access`}
          action={toggleSync}
          control={<Switch checked={syncEnabled} onChange={toggleSync} />}
        />
        
        <div className="glass p-4 rounded-xl text-center">
          <h3 className="text-sm text-gray-400">StructIQ</h3>
          <p className="text-xs text-gray-500 mt-1">Version 1.0.0</p>
        </div>
      </div>
      
      <NavBar />
    </motion.div>
  );
};

export default Settings;
