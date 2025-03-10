
import { useState } from 'react';
import { CheckSquare, CheckCircle, AlertCircle } from 'lucide-react';

type CodeStandard = 'ACI' | 'Eurocode' | 'IS';

const DesignCodeChecker = () => {
  const [beamSpan, setBeamSpan] = useState('');
  const [beamDepth, setBeamDepth] = useState('');
  const [beamWidth, setBeamWidth] = useState('');
  const [loadValue, setLoadValue] = useState('');
  const [codeStandard, setCodeStandard] = useState<CodeStandard>('IS');
  const [results, setResults] = useState<any>(null);

  const handleCheck = () => {
    const span = parseFloat(beamSpan);
    const depth = parseFloat(beamDepth);
    const width = parseFloat(beamWidth);
    const load = parseFloat(loadValue);
    
    if (isNaN(span) || isNaN(depth) || isNaN(width) || isNaN(load)) {
      return;
    }
    
    // Simple demonstration checks based on different codes
    const checks = [];
    
    // Span to depth ratio check
    const spanToDepthRatio = span * 1000 / depth;
    let spanToDepthLimit: number;
    let spanToDepthCode: string;
    
    if (codeStandard === 'ACI') {
      spanToDepthLimit = 20;
      spanToDepthCode = 'ACI 318-19 Table 9.3.1.1';
    } else if (codeStandard === 'Eurocode') {
      spanToDepthLimit = 18;
      spanToDepthCode = 'EN 1992-1-1:2004 7.4.1';
    } else { // IS code
      spanToDepthLimit = 16;
      spanToDepthCode = 'IS 456:2000 23.2.1';
    }
    
    checks.push({
      name: 'Span-to-Depth Ratio',
      value: spanToDepthRatio.toFixed(2),
      limit: `≤ ${spanToDepthLimit}`,
      pass: spanToDepthRatio <= spanToDepthLimit,
      code: spanToDepthCode
    });
    
    // Width to depth ratio check
    const widthToDepthRatio = width / depth;
    let widthToDepthMin: number;
    let widthToDepthCode: string;
    
    if (codeStandard === 'ACI') {
      widthToDepthMin = 0.3;
      widthToDepthCode = 'ACI 318-19 Section 9.2';
    } else if (codeStandard === 'Eurocode') {
      widthToDepthMin = 0.3;
      widthToDepthCode = 'EN 1992-1-1:2004 5.3.1';
    } else { // IS code
      widthToDepthMin = 0.5; // IS code typically recommends minimum width to depth ratio of 0.5 for beams
      widthToDepthCode = 'IS 456:2000 Clause 20.1';
    }
    
    checks.push({
      name: 'Width-to-Depth Ratio',
      value: widthToDepthRatio.toFixed(2),
      limit: `≥ ${widthToDepthMin}`,
      pass: widthToDepthRatio >= widthToDepthMin,
      code: widthToDepthCode
    });
    
    // Load capacity check (simplified)
    const moment = load * span * span / 8; // Simplified for uniform load
    
    // Different permissible stresses based on code standard
    let fck = 25; // Default concrete strength in MPa
    let allowableMoment: number;
    let momentCapacityCode: string;
    
    if (codeStandard === 'ACI') {
      allowableMoment = 0.5 * width * depth * depth * fck / 1000000;
      momentCapacityCode = 'ACI 318-19 Section 22.3';
    } else if (codeStandard === 'Eurocode') {
      allowableMoment = 0.5 * width * depth * depth * fck / 1000000;
      momentCapacityCode = 'EN 1992-1-1:2004 6.1';
    } else { // IS code
      // IS 456 approach for moment capacity
      allowableMoment = 0.36 * width * depth * depth * fck / 1000000;
      momentCapacityCode = 'IS 456:2000 Clause 38.1';
    }
    
    checks.push({
      name: 'Moment Capacity',
      value: moment.toFixed(2) + ' kN·m',
      limit: `≤ ${allowableMoment.toFixed(2)} kN·m`,
      pass: moment <= allowableMoment,
      code: momentCapacityCode
    });
    
    // IS Code specific check: Minimum reinforcement
    if (codeStandard === 'IS') {
      const minReinfPercentage = 0.85 * width * depth / (100 * width * depth);
      checks.push({
        name: 'Minimum Reinforcement',
        value: minReinfPercentage.toFixed(4) + ' %',
        limit: '≥ 0.12 %',
        pass: minReinfPercentage >= 0.12,
        code: 'IS 456:2000 Clause 26.5.1.1'
      });
    }
    
    setResults({
      checks,
      overallPass: checks.every(check => check.pass)
    });
  };

  return (
    <div className="p-4">
      <div className="glass p-5 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <CheckSquare className="mr-2" size={20} />
          Design Code Checker
        </h2>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">Design Code</label>
          <select
            value={codeStandard}
            onChange={(e) => setCodeStandard(e.target.value as CodeStandard)}
            className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white mb-4"
          >
            <option value="IS">IS 456 (Indian)</option>
            <option value="ACI">ACI 318 (American)</option>
            <option value="Eurocode">Eurocode 2 (European)</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Beam Span (m)</label>
            <input
              type="number"
              value={beamSpan}
              onChange={(e) => setBeamSpan(e.target.value)}
              placeholder="Enter span"
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Beam Depth (mm)</label>
            <input
              type="number"
              value={beamDepth}
              onChange={(e) => setBeamDepth(e.target.value)}
              placeholder="Enter depth"
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Beam Width (mm)</label>
            <input
              type="number"
              value={beamWidth}
              onChange={(e) => setBeamWidth(e.target.value)}
              placeholder="Enter width"
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Uniform Load (kN/m)</label>
            <input
              type="number"
              value={loadValue}
              onChange={(e) => setLoadValue(e.target.value)}
              placeholder="Enter load"
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            />
          </div>
        </div>
        
        <button
          onClick={handleCheck}
          className="mt-4 w-full py-2.5 bg-accent-color hover:bg-accent-color/90 transition-colors text-white rounded-lg font-medium"
        >
          Check Design
        </button>
      </div>
      
      {results && (
        <div className="glass p-5 rounded-xl animate-fade-in">
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-semibold">Results</h3>
            <div className={`ml-3 px-3 py-1 rounded-full text-sm ${results.overallPass ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {results.overallPass ? 'All Checks Passed' : 'Some Checks Failed'}
            </div>
          </div>
          
          <div className="space-y-3">
            {results.checks.map((check: any, index: number) => (
              <div key={index} className="bg-black/30 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{check.name}</h4>
                    <p className="text-sm text-gray-400">{check.code}</p>
                  </div>
                  {check.pass ? (
                    <CheckCircle className="text-green-400" size={24} />
                  ) : (
                    <AlertCircle className="text-red-400" size={24} />
                  )}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="text-sm">
                    <span className="text-gray-400">Value: </span>
                    <span>{check.value}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-400">Limit: </span>
                    <span>{check.limit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignCodeChecker;
