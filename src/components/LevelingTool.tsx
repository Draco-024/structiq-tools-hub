
import { useEffect, useState } from 'react';
import { Compass } from 'lucide-react';

const LevelingTool = () => {
  const [tiltX, setTiltX] = useState<number | null>(null);
  const [tiltY, setTiltY] = useState<number | null>(null);
  const [compassHeading, setCompassHeading] = useState<number | null>(null);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let deviceOrientationHandler: (event: DeviceOrientationEvent) => void;
    let deviceMotionHandler: (event: DeviceMotionEvent) => void;

    const setupSensors = () => {
      // Request permission for iOS 13+ devices
      if (typeof DeviceOrientationEvent !== 'undefined' && 
          typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        (DeviceOrientationEvent as any).requestPermission()
          .then((response: string) => {
            if (response === 'granted') {
              enableSensors();
            } else {
              setError('Permission to access device sensors was denied');
            }
          })
          .catch(() => {
            setError('Error requesting device sensor permission');
          });
      } else {
        enableSensors();
      }
    };

    const enableSensors = () => {
      // Device orientation for tilt
      deviceOrientationHandler = (event: DeviceOrientationEvent) => {
        const beta = event.beta; // X-axis rotation
        const gamma = event.gamma; // Y-axis rotation
        const alpha = event.alpha; // Z-axis rotation (compass)
        
        if (beta !== null) setTiltX(Math.round(beta));
        if (gamma !== null) setTiltY(Math.round(gamma));
        if (alpha !== null) setCompassHeading(Math.round(alpha));
      };
      
      // Device motion for calibration detection
      deviceMotionHandler = (event: DeviceMotionEvent) => {
        const acceleration = event.accelerationIncludingGravity;
        if (acceleration && 
            acceleration.x !== null && 
            acceleration.y !== null && 
            acceleration.z !== null) {
          // Basic detection if device is on a flat surface
          const totalAccel = Math.sqrt(
            Math.pow(acceleration.x, 2) + 
            Math.pow(acceleration.y, 2) + 
            Math.pow(acceleration.z, 2)
          );
          
          // ~9.8 m/s² is approximately gravity on earth
          setIsCalibrated(Math.abs(totalAccel - 9.8) < 0.5);
        }
      };
      
      window.addEventListener('deviceorientation', deviceOrientationHandler);
      window.addEventListener('devicemotion', deviceMotionHandler);
    };

    setupSensors();

    return () => {
      if (deviceOrientationHandler) {
        window.removeEventListener('deviceorientation', deviceOrientationHandler);
      }
      if (deviceMotionHandler) {
        window.removeEventListener('devicemotion', deviceMotionHandler);
      }
    };
  }, []);

  const calibrate = () => {
    setIsCalibrated(true);
    // In a real app, you would store offset values
  };

  const getIndicator = (tilt: number | null, axis: 'X' | 'Y') => {
    if (tilt === null) return '—';
    
    const absValue = Math.abs(tilt);
    const isLevel = absValue < 2; // Consider "level" if less than 2 degrees
    
    return (
      <div 
        className={`inline-flex items-center ${isLevel ? 'text-green-400' : 'text-yellow-400'}`}
      >
        <span className="mr-1">{tilt}°</span>
        {isLevel ? '✓' : axis === 'X' ? (tilt > 0 ? '↓' : '↑') : (tilt > 0 ? '→' : '←')}
      </div>
    );
  };

  // Simple visual level indicator
  const getBubblePosition = () => {
    if (tiltX === null || tiltY === null) return { x: 50, y: 50 };
    
    // Clamp values between -20 and 20 degrees, then convert to percentage
    const clampedX = Math.max(-20, Math.min(20, tiltX));
    const clampedY = Math.max(-20, Math.min(20, tiltY));
    
    const x = 50 + (clampedY * 2.5); // Invert Y for correct visual movement
    const y = 50 + (clampedX * 2.5);
    
    return { x, y };
  };
  
  const bubblePosition = getBubblePosition();

  return (
    <div className="p-4">
      <div className="glass p-5 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Compass className="mr-2" size={20} />
          Leveling Tool
        </h2>
        
        {error ? (
          <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-4">
            {error}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-black/30 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-400 mb-1">X-Axis Tilt</p>
                <p className="text-xl font-semibold">
                  {getIndicator(tiltX, 'X')}
                </p>
              </div>
              
              <div className="bg-black/30 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-400 mb-1">Y-Axis Tilt</p>
                <p className="text-xl font-semibold">
                  {getIndicator(tiltY, 'Y')}
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="relative w-full aspect-square bg-black/30 rounded-full overflow-hidden border-2 border-gray-700">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1/2 h-[1px] bg-gray-500"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-1/2 w-[1px] bg-gray-500"></div>
                </div>
                <div 
                  className={`absolute w-8 h-8 rounded-full bg-structiq-purple transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out ${
                    isCalibrated ? 'opacity-100' : 'opacity-50'
                  }`}
                  style={{ 
                    left: `${bubblePosition.x}%`, 
                    top: `${bubblePosition.y}%`
                  }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-400 mb-1">Compass Heading</p>
                <p className="text-xl font-semibold">
                  {compassHeading !== null ? `${compassHeading}°` : '—'}
                </p>
              </div>
              
              <button
                onClick={calibrate}
                className={`p-4 rounded-lg text-center ${
                  isCalibrated 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-structiq-purple/20 text-structiq-purple'
                }`}
              >
                <p className="text-sm mb-1">Calibration</p>
                <p className="font-semibold">
                  {isCalibrated ? 'Calibrated ✓' : 'Calibrate'}
                </p>
              </button>
            </div>
            
            <div className="mt-6 text-sm text-gray-400 text-center">
              <p>Place your device on a surface to measure its levelness</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LevelingTool;
