
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SplashScreen from '@/components/SplashScreen';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if the user has visited before
    const hasVisited = localStorage.getItem('hasVisited');
    
    if (hasVisited) {
      // Skip splash screen for returning users
      navigate('/home');
    } else {
      // Set the flag for future visits
      localStorage.setItem('hasVisited', 'true');
    }
  }, [navigate]);
  
  return <SplashScreen />;
};

export default Index;
