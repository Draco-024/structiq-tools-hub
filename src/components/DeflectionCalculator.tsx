import { useState } from 'react';
import { 
  ArrowUpDown,
  LineChart,
  Check,
  X
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

type BeamType = 'simply-supported' | 'cantilever' | 'fixed-ends';
type LoadType = 'point-center' | 'point-anywhere' | 'udl' | 'varying';

interface DeflectionResult {
  maxDeflection: number;
  allowableDeflection: number;
  deflectionRatio: number;
  passesCheck: boolean;
  deflectionCurve: {x: number, deflection: number}[];
}

const DeflectionCalculator = () => {
  // Input states
  const [beamType, setBeamType] = useState<BeamType>('simply-supported');
  const [loadType, setLoadType] = useState<LoadType>('udl');
  const [span, setSpan] = useState(5);
  const [load, setLoad] = useState(10);
  const [pointLoadPosition, setPointLoadPosition] = useState(2.5);
  const [youngModulus, setYoungModulus] = useState(25000);
  const [momentOfInertia, setMomentOfInertia] = useState(450000000);
  const [limitType, setLimitType] = useState('L/250');
  
  // Result state
  const [result, setResult] = useState<DeflectionResult | null>(null);

  const calculateDeflection = () => {
    // Convert span to mm for calculations
    const spanMm = span * 1000;
    
    // Calculate maximum deflection based on beam and load type
    let maxDeflection = 0;
    const deflectionCurve: {x: number, deflection: number}[] = [];
    
    // Elastic modulus (E) * Moment of inertia (I)
    const EI = youngModulus * momentOfInertia;
    
    if (beamType === 'simply-supported') {
      if (loadType === 'udl') {
        // δ_max = 5wL^4/(384EI) for UDL on simply supported beam
        maxDeflection = (5 * load * Math.pow(spanMm, 4)) / (384 * EI);
        
        // Generate deflection curve
        for (let i = 0; i <= 20; i++) {
          const x = (i / 20) * span;
          const xRatio = x / span;
          // Equation for deflection at any point under UDL
          const deflection = (load * Math.pow(spanMm, 4) / (24 * EI)) * 
                            (xRatio - 2 * Math.pow(xRatio, 3) + Math.pow(xRatio, 4));
          deflectionCurve.push({ x, deflection });
        }
      } else if (loadType === 'point-center') {
        // δ_max = PL^3/(48EI) for point load at center
        maxDeflection = (load * Math.pow(spanMm, 3)) / (48 * EI);
        
        // Generate deflection curve
        for (let i = 0; i <= 20; i++) {
          const x = (i / 20) * span;
          const xRatio = x / span;
          // Equation for deflection at any point under center point load
          const deflection = xRatio <= 0.5 ?
            (load * spanMm * spanMm * spanMm / (48 * EI)) * (3 * xRatio - 4 * Math.pow(xRatio, 3)) :
            (load * spanMm * spanMm * spanMm / (48 * EI)) * (3 * (1 - xRatio) - 4 * Math.pow(1 - xRatio, 3));
          deflectionCurve.push({ x, deflection });
        }
      } else if (loadType === 'point-anywhere') {
        // a = distance from left support to point load
        const a = pointLoadPosition * 1000;
        const b = spanMm - a;  // distance from point load to right support
        
        // δ_max occurs at x = ? (depends on load position)
        // If load is on left half, max is on left half, otherwise on right half
        const xMax = a <= b ? a * Math.sqrt(a/spanMm) : spanMm - b * Math.sqrt(b/spanMm);
        
        // Calculate max deflection
        if (xMax <= a) {
          maxDeflection = (load * b * Math.pow(xMax, 2) * (spanMm - b - xMax)) / (6 * EI * spanMm);
        } else {
          maxDeflection = (load * a * Math.pow(spanMm - xMax, 2) * (spanMm - a - (spanMm - xMax))) / (6 * EI * spanMm);
        }
        
        // For simplicity, use approximate formula for max deflection
        maxDeflection = (load * a * b * Math.sqrt(a * b)) / (9 * Math.sqrt(3) * EI * spanMm);
        
        // Generate deflection curve
        for (let i = 0; i <= 20; i++) {
          const x = (i / 20) * span;
          const xMm = x * 1000;
          let deflection;
          
          if (xMm <= a) {
            // Deflection equation for x <= a
            deflection = (load * b * xMm) / (6 * EI * spanMm) * (spanMm * spanMm - b * b - xMm * xMm);
          } else {
            // Deflection equation for x > a
            deflection = (load * a * (spanMm - xMm)) / (6 * EI * spanMm) * (spanMm * spanMm - a * a - (spanMm - xMm) * (spanMm - xMm));
          }
          
          deflectionCurve.push({ x, deflection });
        }
      } else if (loadType === 'varying') {
        // Triangular load (simplified as half of UDL)
        maxDeflection = (0.5 * 5 * load * Math.pow(spanMm, 4)) / (384 * EI);
        
        // Generate deflection curve (simplified)
        for (let i = 0; i <= 20; i++) {
          const x = (i / 20) * span;
          const xRatio = x / span;
          const deflection = 0.5 * (load * Math.pow(spanMm, 4) / (24 * EI)) * 
                            (xRatio - 2 * Math.pow(xRatio, 3) + Math.pow(xRatio, 4));
          deflectionCurve.push({ x, deflection });
        }
      }
    } else if (beamType === 'cantilever') {
      if (loadType === 'udl') {
        // δ_max = wL^4/(8EI) for UDL on cantilever
        maxDeflection = (load * Math.pow(spanMm, 4)) / (8 * EI);
        
        // Generate deflection curve
        for (let i = 0; i <= 20; i++) {
          const x = (i / 20) * span;
          const xRatio = x / span;
          // Equation for deflection at any point under UDL on cantilever
          const deflection = (load * Math.pow(spanMm, 4) / (24 * EI)) * 
                            (6 * Math.pow(xRatio, 2) - 4 * Math.pow(xRatio, 3) + Math.pow(xRatio, 4));
          deflectionCurve.push({ x, deflection });
        }
      } else if (loadType === 'point-center' || loadType === 'point-anywhere') {
        // For point load on cantilever
        let a: number;
        
        if (loadType === 'point-center') {
          a = span * 1000;  // For point-center, place at the end of cantilever
        } else {
          a = pointLoadPosition * 1000;  // Distance from fixed end
        }
        
        // δ_max = Pa^3/(3EI) for point load on cantilever
        maxDeflection = (load * Math.pow(a, 3)) / (3 * EI);
        
        // Generate deflection curve
        for (let i = 0; i <= 20; i++) {
          const x = (i / 20) * span;
          const xMm = x * 1000;
          let deflection = 0;
          
          if (xMm <= a) {
            // Deflection equation for x <= a (distance from fixed end)
            deflection = (load * Math.pow(xMm, 2) / (6 * EI)) * (3 * a - xMm);
          } else {
            // Deflection equation for x > a (no additional deflection beyond load point)
            deflection = (load * Math.pow(a, 3)) / (3 * EI);
          }
          
          deflectionCurve.push({ x, deflection });
        }
      } else if (loadType === 'varying') {
        // Triangular load on cantilever (max at the free end)
        maxDeflection = (0.5 * load * Math.pow(spanMm, 4)) / (8 * EI);
        
        // Generate deflection curve (simplified)
        for (let i = 0; i <= 20; i++) {
          const x = (i / 20) * span;
          const xRatio = x / span;
          const deflection = 0.5 * (load * Math.pow(spanMm, 4) / (24 * EI)) * 
                            (6 * Math.pow(xRatio, 2) - 4 * Math.pow(xRatio, 3) + Math.pow(xRatio, 4));
          deflectionCurve.push({ x, deflection });
        }
      }
    } else if (beamType === 'fixed-ends') {
      if (loadType === 'udl') {
        // δ_max = wL^4/(384EI) for UDL on fixed-ends beam
        maxDeflection = (load * Math.pow(spanMm, 4)) / (384 * EI);
        
        // Generate deflection curve
        for (let i = 0; i <= 20; i++) {
          const x = (i / 20) * span;
          const xRatio = x / span;
          // Equation for deflection at any point under UDL on fixed ends beam
          const deflection = (load * Math.pow(spanMm, 4) / (384 * EI)) * 
                            (1 - 2 * xRatio + Math.pow(xRatio, 2)) * (1 - xRatio) * xRatio;
          deflectionCurve.push({ x, deflection });
        }
      } else if (loadType === 'point-center') {
        // δ_max = PL^3/(192EI) for center point load on fixed-ends beam
        maxDeflection = (load * Math.pow(spanMm, 3)) / (192 * EI);
        
        // Generate deflection curve
        for (let i = 0; i <= 20; i++) {
          const x = (i / 20) * span;
          const xRatio = x / span;
          let deflection;
          
          if (xRatio <= 0.5) {
            // Deflection equation for left half
            deflection = (load * spanMm * spanMm * spanMm / (48 * EI)) * 
                        xRatio * xRatio * (3 - 4 * xRatio);
          } else {
            // Deflection equation for right half
            deflection = (load * spanMm * spanMm * spanMm / (48 * EI)) * 
                        (1 - xRatio) * (1 - xRatio) * (3 - 4 * (1 - xRatio));
          }
          
          deflectionCurve.push({ x, deflection });
        }
      } else if (loadType === 'point-anywhere' || loadType === 'varying') {
        // Simplified approximation for other load cases
        if (loadType === 'point-anywhere') {
          maxDeflection = (load * Math.pow(spanMm, 3)) / (192 * EI);
        } else { // varying load
          maxDeflection = (0.5 * load * Math.pow(spanMm, 4)) / (384 * EI);
        }
        
        // Generate a simplified deflection curve
        for (let i = 0; i <= 20; i++) {
          const x = (i / 20) * span;
          const xRatio = x / span;
          const deflection = maxDeflection * 4 * xRatio * (1 - xRatio);
          deflectionCurve.push({ x, deflection });
        }
      }
    }
    
    // Calculate allowable deflection
    let allowableDeflection: number;
    let deflectionLimit: number;
    
    if (limitType === 'L/250') {
      deflectionLimit = 250;
    } else if (limitType === 'L/360') {
      deflectionLimit = 360;
    } else if (limitType === 'L/480') {
      deflectionLimit = 480;
    } else {
      // Default to L/250 if not specified
      deflectionLimit = 250;
    }
    
    allowableDeflection = spanMm / deflectionLimit;
    
    // Check if deflection is within allowable limits
    const passesCheck = maxDeflection <= allowableDeflection;
    
    // Deflection ratio (actual/allowable)
    const deflectionRatio = maxDeflection / allowableDeflection;
    
    setResult({
      maxDeflection,
      allowableDeflection,
      deflectionRatio,
      passesCheck,
      deflectionCurve
    });
  };

  return (
    <div className="p-4">
      <div className="glass p-5 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <ArrowUpDown className="mr-2" size={20} />
          Deflection Calculator
        </h2>
        
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Beam Type</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setBeamType('simply-supported')}
              className={`p-2 rounded-lg text-sm flex flex-col items-center justify-center ${
                beamType === 'simply-supported' ? 'bg-accent-color text-white' : 'bg-black/30 text-gray-300'
              }`}
            >
              <div className="h-4 w-16 border-t-2 border-current mb-1 relative">
                <div className="absolute bottom-0 left-0 w-1.5 h-1.5 rounded-full bg-current"></div>
                <div className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-current"></div>
              </div>
              Simply Supported
            </button>
            <button
              onClick={() => setBeamType('cantilever')}
              className={`p-2 rounded-lg text-sm flex flex-col items-center justify-center ${
                beamType === 'cantilever' ? 'bg-accent-color text-white' : 'bg-black/30 text-gray-300'
              }`}
            >
              <div className="h-4 w-16 border-t-2 border-current mb-1 relative">
                <div className="absolute bottom-0 left-0 w-1.5 h-3 bg-current"></div>
              </div>
              Cantilever
            </button>
            <button
              onClick={() => setBeamType('fixed-ends')}
              className={`p-2 rounded-lg text-sm flex flex-col items-center justify-center ${
                beamType === 'fixed-ends' ? 'bg-accent-color text-white' : 'bg-black/30 text-gray-300'
              }`}
            >
              <div className="h-4 w-16 border-t-2 border-current mb-1 relative">
                <div className="absolute bottom-0 left-0 w-1.5 h-3 bg-current"></div>
                <div className="absolute bottom-0 right-0 w-1.5 h-3 bg-current"></div>
              </div>
              Fixed Ends
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Loading Type</label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={() => setLoadType('udl')}
              className={`p-2 rounded-lg text-sm flex flex-col items-center justify-center ${
                loadType === 'udl' ? 'bg-accent-color text-white' : 'bg-black/30 text-gray-300'
              }`}
            >
              <div className="h-4 w-16 border-t-2 border-current mb-1 relative">
                <div className="absolute top-0 left-0 right-0 flex justify-between">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-0.5 h-2 bg-current"></div>
                  ))}
                </div>
              </div>
              Uniform Load
            </button>
            <button
              onClick={() => setLoadType('point-center')}
              className={`p-2 rounded-lg text-sm flex flex-col items-center justify-center ${
                loadType === 'point-center' ? 'bg-accent-color text-white' : 'bg-black/30 text-gray-300'
              }`}
            >
              <div className="h-4 w-16 border-t-2 border-current mb-1 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-current"></div>
              </div>
              Center Point Load
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setLoadType('point-anywhere')}
              className={`p-2 rounded-lg text-sm flex flex-col items-center justify-center ${
                loadType === 'point-anywhere' ? 'bg-accent-color text-white' : 'bg-black/30 text-gray-300'
              }`}
            >
              <div className="h-4 w-16 border-t-2 border-current mb-1 relative">
                <div className="absolute top-0 left-1/3 transform -translate-x-1/2 w-0.5 h-2 bg-current"></div>
              </div>
              Point Load (Any)
            </button>
            <button
              onClick={() => setLoadType('varying')}
              className={`p-2 rounded-lg text-sm flex flex-col items-center justify-center ${
                loadType === 'varying' ? 'bg-accent-color text-white' : 'bg-black/30 text-gray-300'
              }`}
            >
              <div className="h-4 w-16 border-t-2 border-current mb-1 relative">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent to-current opacity-30"></div>
                <div className="absolute top-0 right-0 w-0.5 h-2 bg-current"></div>
              </div>
              Varying Load
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Span Length (m)</label>
            <input
              type="number"
              value={span}
              onChange={(e) => setSpan(Number(e.target.value))}
              min={0.5}
              max={30}
              step={0.1}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Load Magnitude (kN/m{loadType.includes('point') ? '' : '²'})</label>
            <input
              type="number"
              value={load}
              onChange={(e) => setLoad(Number(e.target.value))}
              min={0.1}
              max={100}
              step={0.1}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            />
          </div>
          
          {loadType === 'point-anywhere' && (
            <div>
              <label className="block text-sm text-gray-400 mb-1">Point Load Position (m from left)</label>
              <input
                type="number"
                value={pointLoadPosition}
                onChange={(e) => setPointLoadPosition(Number(e.target.value))}
                min={0}
                max={span}
                step={0.1}
                className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Young's Modulus (MPa)</label>
            <input
              type="number"
              value={youngModulus}
              onChange={(e) => setYoungModulus(Number(e.target.value))}
              min={1000}
              max={210000}
              step={1000}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Moment of Inertia (mm⁴)</label>
            <input
              type="number"
              value={momentOfInertia}
              onChange={(e) => setMomentOfInertia(Number(e.target.value))}
              min={1000000}
              max={1000000000}
              step={1000000}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Deflection Limit</label>
            <select
              value={limitType}
              onChange={(e) => setLimitType(e.target.value)}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            >
              <option value="L/250">L/250 (General)</option>
              <option value="L/360">L/360 (Floors)</option>
              <option value="L/480">L/480 (Sensitive finishes)</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={calculateDeflection}
          className="mt-4 w-full py-2.5 bg-accent-color hover:bg-accent-color/90 transition-colors text-white rounded-lg font-medium"
        >
          Calculate Deflection
        </button>
      </div>
      
      {result && (
        <div className="glass p-5 rounded-xl animate-fade-in">
          <h3 className="text-lg font-semibold mb-4">Deflection Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-black/30 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Maximum Deflection</p>
              <p className="text-xl font-semibold">{result.maxDeflection.toFixed(2)} mm</p>
            </div>
            
            <div className="bg-black/30 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Allowable Deflection</p>
              <p className="text-xl font-semibold">{result.allowableDeflection.toFixed(2)} mm</p>
              <p className="text-xs text-gray-500">{limitType}</p>
            </div>
            
            <div className="bg-black/30 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Check Result</p>
              <div className="flex items-center mt-1">
                {result.passesCheck ? (
                  <>
                    <Check size={20} className="text-green-400 mr-2" />
                    <p className="text-green-400 font-semibold">Passes</p>
                  </>
                ) : (
                  <>
                    <X size={20} className="text-red-400 mr-2" />
                    <p className="text-red-400 font-semibold">Fails</p>
                  </>
                )}
                <p className="text-sm ml-2">
                  ({(result.deflectionRatio * 100).toFixed(1)}% of limit)
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-6 h-80">
            <h4 className="text-md font-medium mb-3 flex items-center">
              <LineChart size={18} className="mr-2 text-accent-color" />
              Deflection Curve
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart
                data={result.deflectionCurve}
                margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis 
                  dataKey="x" 
                  label={{ value: 'Distance (m)', position: 'insideBottomRight', offset: -10 }} 
                />
                <YAxis 
                  label={{ value: 'Deflection (mm)', angle: -90, position: 'insideLeft' }}
                  domain={[0, 'dataMax']}
                  reversed={true}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', borderColor: '#333' }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value: number) => [value.toFixed(2) + ' mm', 'Deflection']}
                  labelFormatter={(value) => `Position: ${value} m`}
                />
                <Line 
                  type="monotone" 
                  dataKey="deflection" 
                  stroke="var(--accent-color)" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 8 }}
                />
                {/* Add a horizontal line for allowable deflection if needed */}
                {result.allowableDeflection > 0 && (
                  <Line 
                    type="monotone" 
                    dataKey={() => result.allowableDeflection}
                    stroke="#f87171" 
                    strokeDasharray="5 5"
                    strokeWidth={1}
                    dot={false}
                    name="Allowable"
                  />
                )}
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="p-4 bg-black/30 rounded-lg text-sm">
            <p className="mb-2"><span className="font-medium">Beam Type:</span> {beamType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
            <p className="mb-2"><span className="font-medium">Load Type:</span> {loadType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
            <p className="mb-2"><span className="font-medium">EI Value:</span> {(youngModulus * momentOfInertia).toExponential(2)} N·mm²</p>
            <p className="text-gray-400 text-xs mt-3">
              Note: Calculations are based on elastic beam theory. For actual structural design, 
              consider additional factors such as shear deformation, support settlements, and long-term effects.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeflectionCalculator;
