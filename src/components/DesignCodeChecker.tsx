
import { useState } from 'react';
import { CheckSquare, CheckCircle, AlertCircle } from 'lucide-react';

const DesignCodeChecker = () => {
  const [beamSpan, setBeamSpan] = useState('');
  const [beamDepth, setBeamDepth] = useState('');
  const [beamWidth, setBeamWidth] = useState('');
  const [loadValue, setLoadValue] = useState('');
  const [codeStandard, setCodeStandard] = useState('ACI');
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
    // In a real application, this would involve more complex calculations
    const checks = [];
    
    // Span to depth ratio check
    const spanToDepthRatio = span * 1000 / depth;
    const spanToDepthLimit = codeStandard === 'ACI' ? 20 : 
                           codeStandard === 'Eurocode' ? 18 : 16;
    
    checks.push({
      name: 'Span-to-Depth Ratio',
      value: spanToDepthRatio.toFixed(2),
      limit: `≤ ${spanToDepthLimit}`,
      pass: spanToDepthRatio <= spanToDepthLimit,
      code: codeStandard === 'ACI' ? 'ACI 318-19 Table 9.3.1.1' : 
            codeStandard === 'Eurocode' ? 'EN 1992-1-1:2004 7.4.1' : 'IS 456:2000 23.2.1'
    });
    
    // Width to depth ratio check
    const widthToDepthRatio = width / depth;
    const widthToDepthMin = 0.3;
    
    checks.push({
      name: 'Width-to-Depth Ratio',
      value: widthToDepthRatio.toFixed(2),
      limit: `≥ ${widthToDepthMin}`,
      pass: widthToDepthRatio >= widthToDepthMin,
      code: codeStandard === 'ACI' ? 'ACI 318-19 Section 9.2' : 
            codeStandard === 'Eurocode' ? 'EN 1992-1-1:2004 5.3.1' : 'IS 456:2000 20.1'
    });
    
    // Load capacity check (simplified)
    const moment = load * span * span / 8; // Simplified for uniform load
    const allowableMoment = 0.5 * width * depth * depth * 25 / 1000000; // Very simplified
    
    checks.push({
      name: 'Moment Capacity',
      value: moment.toFixed(2) + ' kN·m',
      limit: `≤ ${allowableMoment.toFixed(2)} kN·m`,
      pass: moment <= allowableMoment,
      code: codeStandard === 'ACI' ? 'ACI 318-19 Section 22.3' : 
            codeStandard === 'Eurocode' ? 'EN 1992-1-1:2004 6.1' : 'IS 456:2000 38.1'
    });
    
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
            onChange={(e) => setCodeStandard(e.target.value)}
            className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white mb-4"
          >
            <option value="ACI">ACI 318 (American)</option>
            <option value="Eurocode">Eurocode 2 (European)</option>
            <option value="IS">IS 456 (Indian)</option>
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
          className="mt-4 w-full py-2.5 bg-structiq-purple hover:bg-structiq-purple/90 transition-colors text-white rounded-lg font-medium"
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
