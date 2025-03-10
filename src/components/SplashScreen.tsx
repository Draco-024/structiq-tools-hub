
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const [logoVisible, setLogoVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setLogoVisible(true);
    }, 300);

    const timer2 = setTimeout(() => {
      navigate('/home');
    }, 2300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-tr from-structiq-black via-structiq-purple/50 to-structiq-silver/70 z-50">
      <div className={`transform transition-all duration-1000 ease-out ${logoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gradient mb-2">
            StructIQ
          </h1>
          <p className="text-sm tracking-wide text-white/70">
            Structural Engineering Tools
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
