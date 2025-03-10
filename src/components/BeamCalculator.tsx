
import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { 
  Area, Bar, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis 
} from 'recharts';

const BeamCalculator = () => {
  const [length, setLength] = useState(5);
  const [load, setLoad] = useState(10);
  const [young, setYoung] = useState(200);
  const [inertia, setInertia] = useState(0.00004);
  const [results, setResults] = useState<any>(null);

  const calculateBeam = () => {
    // Simple beam calculation for demonstration
    const numPoints = 50;
    const dx = length / numPoints;
    const data = [];
    
    const maxMoment = (load * length * length) / 8;
    const maxDeflection = (5 * load * Math.pow(length, 4)) / (384 * young * inertia * 1e9);
    
    for (let i = 0; i <= numPoints; i++) {
      const x = i * dx;
      const shearForce = load * (length / 2 - x);
      const bendingMoment = load * x * (length - x) / 2;
      const deflection = (load * x * (Math.pow(length, 3) - 2 * length * Math.pow(x, 2) + Math.pow(x, 3))) / (24 * young * inertia * 1e9);
      
      data.push({
        x: x.toFixed(2),
        shear: shearForce,
        moment: bendingMoment,
        deflection: deflection * 1000 // mm
      });
    }
    
    setResults({
      data,
      maxShear: load * length / 2,
      maxMoment,
      maxDeflection: maxDeflection * 1000 // mm
    });
  };

  return (
    <div className="p-4">
      <div className="glass p-5 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Calculator className="mr-2" size={20} />
          Beam Analysis
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Beam Length (m)</label>
            <input
              type="number"
              min="1"
              max="20"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Uniform Load (kN/m)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={load}
              onChange={(e) => setLoad(Number(e.target.value))}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Young's Modulus (GPa)</label>
            <input
              type="number"
              min="1"
              max="500"
              value={young}
              onChange={(e) => setYoung(Number(e.target.value))}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Moment of Inertia (m⁴)</label>
            <input
              type="number"
              min="0.00001"
              max="0.1"
              step="0.00001"
              value={inertia}
              onChange={(e) => setInertia(Number(e.target.value))}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            />
          </div>
        </div>
        
        <button
          onClick={calculateBeam}
          className="mt-4 w-full py-2.5 bg-structiq-purple hover:bg-structiq-purple/90 transition-colors text-white rounded-lg font-medium"
        >
          Calculate
        </button>
      </div>
      
      {results && (
        <div className="glass p-5 rounded-xl mb-6 animate-fade-in">
          <h3 className="text-lg font-semibold mb-4">Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-black/30 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Maximum Shear Force</p>
              <p className="text-xl font-semibold">{results.maxShear.toFixed(2)} kN</p>
            </div>
            
            <div className="bg-black/30 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Maximum Bending Moment</p>
              <p className="text-xl font-semibold">{results.maxMoment.toFixed(2)} kN·m</p>
            </div>
            
            <div className="bg-black/30 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Maximum Deflection</p>
              <p className="text-xl font-semibold">{results.maxDeflection.toFixed(2)} mm</p>
            </div>
          </div>
          
          <div className="mb-6 h-80">
            <h4 className="text-md font-medium mb-2">Bending Moment Diagram</h4>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={results.data}>
                <XAxis dataKey="x" label={{ value: 'Position (m)', position: 'insideBottomRight', offset: -5 }} />
                <YAxis label={{ value: 'Moment (kN·m)', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', borderColor: '#333' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="moment" fill="rgba(138, 43, 226, 0.3)" stroke="#8A2BE2" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          
          <div className="h-80">
            <h4 className="text-md font-medium mb-2">Deflection Diagram</h4>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={results.data}>
                <XAxis dataKey="x" label={{ value: 'Position (m)', position: 'insideBottomRight', offset: -5 }} />
                <YAxis label={{ value: 'Deflection (mm)', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', borderColor: '#333' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="deflection" stroke="#C0C0C0" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeamCalculator;
