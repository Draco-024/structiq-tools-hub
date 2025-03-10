
import { useState } from 'react';
import { 
  ChartBar, 
  Grid2X2, 
  Layers, 
  ArrowUpDown, 
  LayoutGrid, 
  Check, 
  X 
} from 'lucide-react';
import {
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

type SlabType = 'one-way' | 'two-way';
type ReinforcementDirection = 'main' | 'distribution';
type DesignCode = 'ACI' | 'Eurocode' | 'IS';

interface CheckResult {
  name: string;
  status: 'pass' | 'fail';
  actual: number;
  limit: number;
  unit: string;
}

const SlabDesignTool = () => {
  // Input states
  const [slabType, setSlabType] = useState<SlabType>('one-way');
  const [length, setLength] = useState(4);
  const [width, setWidth] = useState(3);
  const [thickness, setThickness] = useState(150);
  const [concreteGrade, setConcreteGrade] = useState(25);
  const [deadLoad, setDeadLoad] = useState(1.5);
  const [liveLoad, setLiveLoad] = useState(2.5);
  const [mainBarDia, setMainBarDia] = useState(10);
  const [distBarDia, setDistBarDia] = useState(8);
  const [cover, setCover] = useState(25);
  const [designCode, setDesignCode] = useState<DesignCode>('ACI');
  
  // Results state
  const [results, setResults] = useState<{
    checks: CheckResult[];
    mainReinfSpacing: number;
    distReinfSpacing: number;
    momentDiagram: any[];
    deflectionDiagram: any[];
  } | null>(null);

  const calculateSlab = () => {
    // Simple slab design calculation for demonstration
    // In a real app, this would include more comprehensive engineering calculations
    
    // Calculate total load
    const totalLoad = deadLoad + liveLoad; // kN/m²
    
    // Calculate effective depth
    const effectiveDepth = thickness - cover - mainBarDia / 2; // mm
    
    // Calculate moments (simplified)
    const momentCoeff = slabType === 'one-way' ? 0.125 : 0.086; // Simplified coefficients
    const maxMoment = momentCoeff * totalLoad * Math.pow(Math.max(length, width), 2); // kNm/m
    
    // Calculate required reinforcement area (simplified)
    const fck = concreteGrade; // MPa
    const fy = 500; // Steel yield strength in MPa
    const k = maxMoment * 1000000 / (1 * Math.pow(effectiveDepth, 2) * fck);
    const z = Math.min(0.95 * effectiveDepth, 0.95 * effectiveDepth * (0.5 + Math.sqrt(0.25 - 0.882 * k)));
    const asReq = maxMoment * 1000000 / (0.87 * fy * z); // mm²/m
    
    // Calculate bar spacing
    const mainBarArea = Math.PI * Math.pow(mainBarDia/2, 2);
    const distBarArea = Math.PI * Math.pow(distBarDia/2, 2);
    
    const mainReinfSpacing = Math.min(1000 * mainBarArea / asReq, 250); // mm
    const distReinfSpacing = slabType === 'one-way' ? 
      Math.min(1000 * distBarArea / (0.2 * asReq), 250) : 
      Math.min(1000 * distBarArea / (0.8 * asReq), 250); // mm
    
    // Check deflection (simplified)
    const minThickness = slabType === 'one-way' ? 
      Math.max(length, width) * 1000 / 28 : // L/28 for one-way
      Math.max(length, width) * 1000 / 32;  // L/32 for two-way
    
    // Check shear (simplified)
    const shearCapacity = 0.25 * Math.sqrt(fck) * 1 * effectiveDepth / 1000; // kN
    const designShear = totalLoad * Math.max(length, width) / 2; // Simplified shear at support
    
    // Generate moment diagram data
    const momentDiagram = [];
    const deflectionDiagram = [];
    const numPoints = 20;
    
    if (slabType === 'one-way') {
      const span = Math.max(length, width);
      for (let i = 0; i <= numPoints; i++) {
        const x = (i / numPoints) * span;
        const moment = totalLoad * x * (span - x) / 2;
        const deflection = (5 * totalLoad * Math.pow(span, 4) * 1000000000) / 
                        (384 * 25000 * Math.pow(thickness, 3) / 12) * 
                        (1 - Math.pow(2*x/span - 1, 2)) * Math.pow(2*x/span - 1, 2);
        
        momentDiagram.push({ x: x.toFixed(2), moment });
        deflectionDiagram.push({ x: x.toFixed(2), deflection: deflection / 1000 }); // mm
      }
    } else {
      // Two-way slab diagram (simplified representation)
      for (let i = 0; i <= numPoints; i++) {
        const x = (i / numPoints) * length;
        const moment = totalLoad * x * (length - x) / 3; // Simplified for visualization
        const deflection = (totalLoad * Math.pow(length, 4) * 1000000000) / 
                        (180 * 25000 * Math.pow(thickness, 3) / 12) * 
                        (1 - Math.pow(2*x/length - 1, 2)) * Math.pow(2*x/length - 1, 2);
        
        momentDiagram.push({ x: x.toFixed(2), moment });
        deflectionDiagram.push({ x: x.toFixed(2), deflection: deflection / 1000 }); // mm
      }
    }
    
    // Prepare check results
    const checks: CheckResult[] = [
      {
        name: 'Bending Moment',
        status: k <= 0.168 ? 'pass' : 'fail',
        actual: maxMoment,
        limit: 0.168 * 1 * Math.pow(effectiveDepth, 2) * fck / 1000000,
        unit: 'kNm/m'
      },
      {
        name: 'Shear Capacity',
        status: shearCapacity >= designShear ? 'pass' : 'fail',
        actual: designShear,
        limit: shearCapacity,
        unit: 'kN/m'
      },
      {
        name: 'Minimum Thickness',
        status: thickness >= minThickness ? 'pass' : 'fail',
        actual: thickness,
        limit: minThickness,
        unit: 'mm'
      }
    ];
    
    setResults({
      checks,
      mainReinfSpacing: Math.round(mainReinfSpacing),
      distReinfSpacing: Math.round(distReinfSpacing),
      momentDiagram,
      deflectionDiagram
    });
  };

  return (
    <div className="p-4">
      <div className="glass p-5 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Grid2X2 className="mr-2" size={20} />
          Slab Design Tool
        </h2>
        
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Design Code</label>
          <select
            value={designCode}
            onChange={(e) => setDesignCode(e.target.value as DesignCode)}
            className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
          >
            <option value="ACI">ACI 318 (American)</option>
            <option value="Eurocode">Eurocode 2 (European)</option>
            <option value="IS">IS 456 (Indian)</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Slab Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSlabType('one-way')}
              className={`p-2 rounded-lg flex items-center justify-center ${
                slabType === 'one-way' ? 'bg-structiq-purple text-white' : 'bg-black/30 text-gray-300'
              }`}
            >
              <ArrowUpDown size={16} className="mr-2" />
              One-Way Slab
            </button>
            <button
              onClick={() => setSlabType('two-way')}
              className={`p-2 rounded-lg flex items-center justify-center ${
                slabType === 'two-way' ? 'bg-structiq-purple text-white' : 'bg-black/30 text-gray-300'
              }`}
            >
              <LayoutGrid size={16} className="mr-2" />
              Two-Way Slab
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Length (m)</label>
            <input
              type="number"
              min="1"
              max="10"
              step="0.1"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Width (m)</label>
            <input
              type="number"
              min="1"
              max="10"
              step="0.1"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Thickness (mm)</label>
            <input
              type="number"
              min="100"
              max="400"
              step="5"
              value={thickness}
              onChange={(e) => setThickness(Number(e.target.value))}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Concrete Grade (MPa)</label>
            <input
              type="number"
              min="20"
              max="60"
              step="5"
              value={concreteGrade}
              onChange={(e) => setConcreteGrade(Number(e.target.value))}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Dead Load (kN/m²)</label>
            <input
              type="number"
              min="0.5"
              max="10"
              step="0.1"
              value={deadLoad}
              onChange={(e) => setDeadLoad(Number(e.target.value))}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Live Load (kN/m²)</label>
            <input
              type="number"
              min="0.5"
              max="15"
              step="0.1"
              value={liveLoad}
              onChange={(e) => setLiveLoad(Number(e.target.value))}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Main Bar Diameter (mm)</label>
            <select
              value={mainBarDia}
              onChange={(e) => setMainBarDia(Number(e.target.value))}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            >
              <option value="8">8 mm</option>
              <option value="10">10 mm</option>
              <option value="12">12 mm</option>
              <option value="16">16 mm</option>
              <option value="20">20 mm</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Distribution Bar Diameter (mm)</label>
            <select
              value={distBarDia}
              onChange={(e) => setDistBarDia(Number(e.target.value))}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            >
              <option value="8">8 mm</option>
              <option value="10">10 mm</option>
              <option value="12">12 mm</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Clear Cover (mm)</label>
            <input
              type="number"
              min="15"
              max="50"
              step="5"
              value={cover}
              onChange={(e) => setCover(Number(e.target.value))}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            />
          </div>
        </div>
        
        <button
          onClick={calculateSlab}
          className="mt-4 w-full py-2.5 bg-structiq-purple hover:bg-structiq-purple/90 transition-colors text-white rounded-lg font-medium"
        >
          Design Slab
        </button>
      </div>
      
      {results && (
        <div className="glass p-5 rounded-xl mb-6 animate-fade-in">
          <h3 className="text-lg font-semibold mb-4">Design Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-black/30 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Main Reinforcement Spacing</p>
              <p className="text-xl font-semibold">{results.mainReinfSpacing} mm</p>
              <p className="text-sm text-gray-500">
                {slabType === 'one-way' ? 'Along span direction' : 'Along shorter direction'}
              </p>
            </div>
            
            <div className="bg-black/30 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Distribution Reinforcement Spacing</p>
              <p className="text-xl font-semibold">{results.distReinfSpacing} mm</p>
              <p className="text-sm text-gray-500">
                {slabType === 'one-way' ? 'Perpendicular to span' : 'Along longer direction'}
              </p>
            </div>
          </div>
          
          <h4 className="text-md font-medium mb-3">Design Checks</h4>
          <div className="space-y-3 mb-6">
            {results.checks.map((check, index) => (
              <div key={index} className="bg-black/30 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <h5 className="font-medium">{check.name}</h5>
                  {check.status === 'pass' ? (
                    <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full flex items-center">
                      <Check size={16} className="mr-1" />
                      <span className="text-xs">Pass</span>
                    </div>
                  ) : (
                    <div className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full flex items-center">
                      <X size={16} className="mr-1" />
                      <span className="text-xs">Fail</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  <div>
                    <span className="text-gray-400">Actual: </span>
                    <span>{check.actual.toFixed(2)} {check.unit}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Limit: </span>
                    <span>{check.limit.toFixed(2)} {check.unit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mb-6 h-80">
            <h4 className="text-md font-medium mb-2">
              <ChartBar className="inline mr-2" size={18} />
              Bending Moment Diagram
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results.momentDiagram}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="x" label={{ value: 'Position (m)', position: 'insideBottomRight', offset: -5 }} />
                <YAxis label={{ value: 'Moment (kNm/m)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', borderColor: '#333' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="moment" fill="rgba(138, 43, 226, 0.6)" name="Moment" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="h-80">
            <h4 className="text-md font-medium mb-2">
              <Layers className="inline mr-2" size={18} />
              Reinforcement Layout
            </h4>
            <div className="bg-black/30 p-4 rounded-lg text-center h-full flex flex-col items-center justify-center">
              <div className="relative w-full max-w-md h-64 border border-gray-600 rounded-lg">
                {/* Simplified slab reinforcement visualization */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`relative ${slabType === 'one-way' ? 'w-4/5' : 'w-4/5 h-4/5'}`} 
                       style={{
                         aspectRatio: `${length / width}`,
                         border: '1px solid #666',
                         borderRadius: '4px'
                       }}>
                    {/* Main reinforcement - horizontal lines */}
                    {Array.from({ length: Math.ceil(width * 1000 / results.mainReinfSpacing) }).map((_, i) => (
                      <div 
                        key={`main-${i}`} 
                        className="absolute bg-structiq-purple" 
                        style={{
                          height: '2px',
                          width: '100%',
                          top: `${(i * results.mainReinfSpacing) / (width * 1000) * 100}%`
                        }}
                      />
                    ))}
                    {/* Distribution reinforcement - vertical lines */}
                    {Array.from({ length: Math.ceil(length * 1000 / results.distReinfSpacing) }).map((_, i) => (
                      <div 
                        key={`dist-${i}`} 
                        className="absolute bg-white opacity-70" 
                        style={{
                          width: '2px',
                          height: '100%',
                          left: `${(i * results.distReinfSpacing) / (length * 1000) * 100}%`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-400">
                <div className="flex items-center justify-center mb-1">
                  <div className="w-4 h-1 bg-structiq-purple mr-2"></div>
                  <span>Main Bars - {mainBarDia}mm @ {results.mainReinfSpacing}mm c/c</span>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-1 h-4 bg-white opacity-70 mr-2"></div>
                  <span>Distribution Bars - {distBarDia}mm @ {results.distReinfSpacing}mm c/c</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlabDesignTool;
