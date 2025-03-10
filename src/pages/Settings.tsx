
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Globe, 
  CloudUpload,
  Palette
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NavBar from '@/components/NavBar';

// Available accent colors
const ACCENT_COLORS = [
  { name: 'Purple', value: '#8A2BE2' },
  { name: 'Teal', value: '#008080' },
  { name: 'Blue', value: '#1E90FF' },
  { name: 'Green', value: '#2E8B57' },
  { name: 'Orange', value: '#FF7F50' },
  { name: 'Red', value: '#DC143C' }
];

const Settings = () => {
  const { toast } = useToast();
  const [units, setUnits] = useState('metric');
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [accentColor, setAccentColor] = useState('#8A2BE2');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedUnits = localStorage.getItem('units');
    const savedSync = localStorage.getItem('syncEnabled');
    const savedAccentColor = localStorage.getItem('accentColor');
    
    if (savedUnits) setUnits(savedUnits);
    if (savedSync) setSyncEnabled(savedSync === 'true');
    if (savedAccentColor) setAccentColor(savedAccentColor);
    
    // Update CSS variable for accent color
    document.documentElement.style.setProperty('--accent-color', savedAccentColor || '#8A2BE2');
  }, []);

  const toggleUnits = () => {
    const newUnits = units === 'metric' ? 'imperial' : 'metric';
    setUnits(newUnits);
    localStorage.setItem('units', newUnits);
    toast({
      title: `Units Changed to ${newUnits === 'metric' ? 'Metric' : 'Imperial'}`,
      description: `Measurement units have been updated.`,
    });
  };

  const toggleSync = () => {
    setSyncEnabled(!syncEnabled);
    localStorage.setItem('syncEnabled', (!syncEnabled).toString());
    toast({
      title: `Cloud Sync ${!syncEnabled ? 'Enabled' : 'Disabled'}`,
      description: `Cloud synchronization has been ${!syncEnabled ? 'enabled' : 'disabled'}.`,
    });
  };

  const changeAccentColor = (color: string) => {
    setAccentColor(color);
    localStorage.setItem('accentColor', color);
    document.documentElement.style.setProperty('--accent-color', color);
    toast({
      title: `Accent Color Updated`,
      description: `App theme color has been changed.`,
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
          <div className="w-10 h-10 rounded-lg bg-accent-color/20 flex items-center justify-center text-accent-color mr-3">
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
        checked ? 'bg-accent-color' : 'bg-gray-700'
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
          <SettingsIcon className="mr-3 text-accent-color" size={24} />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        
        <h2 className="text-lg font-semibold mb-4">Preferences</h2>
        
        <SettingItem
          icon={Palette}
          title="Accent Color"
          description="Customize app accent color"
          action={() => {}}
          control={
            <div className="flex space-x-2">
              {ACCENT_COLORS.map((color) => (
                <button 
                  key={color.value}
                  onClick={() => changeAccentColor(color.value)}
                  className={`w-6 h-6 rounded-full border-2 ${
                    accentColor === color.value ? 'border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color.value }}
                  aria-label={`Select ${color.name} theme`}
                />
              ))}
            </div>
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
