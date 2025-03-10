
import { useState } from 'react';
import { Scale } from 'lucide-react';

const MaterialConverter = () => {
  const [fromValue, setFromValue] = useState('');
  const [fromUnit, setFromUnit] = useState('mpa');
  const [toUnit, setToUnit] = useState('psi');
  const [result, setResult] = useState<string | null>(null);

  const stressUnits = [
    { id: 'mpa', name: 'MPa', factor: 1 },
    { id: 'psi', name: 'psi', factor: 145.038 },
    { id: 'ksi', name: 'ksi', factor: 0.145038 },
    { id: 'kpa', name: 'kPa', factor: 1000 },
    { id: 'kgcm2', name: 'kg/cm²', factor: 10.1972 }
  ];

  const handleConvert = () => {
    const value = parseFloat(fromValue);
    if (isNaN(value)) {
      setResult('Please enter a valid number');
      return;
    }

    const fromFactor = stressUnits.find(u => u.id === fromUnit)?.factor || 1;
    const toFactor = stressUnits.find(u => u.id === toUnit)?.factor || 1;
    
    // Convert to base unit (MPa) then to target unit
    const baseValue = value / fromFactor;
    const convertedValue = baseValue * toFactor;
    
    setResult(`${value} ${fromUnit} = ${convertedValue.toFixed(4)} ${toUnit}`);
  };

  return (
    <div className="p-4">
      <div className="glass p-5 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Scale className="mr-2" size={20} />
          Stress Unit Converter
        </h2>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Value</label>
            <input
              type="number"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              placeholder="Enter value"
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">From</label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
              >
                {stressUnits.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">To</label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
              >
                {stressUnits.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            onClick={handleConvert}
            className="w-full py-2.5 bg-structiq-purple hover:bg-structiq-purple/90 transition-colors text-white rounded-lg font-medium"
          >
            Convert
          </button>
          
          {result && (
            <div className="mt-4 bg-black/30 p-4 rounded-lg text-center animate-fade-in">
              <p className="text-lg font-semibold">{result}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="glass p-5 rounded-xl mt-6">
        <h3 className="text-lg font-semibold mb-3">Common Materials Properties</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Material</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Strength (MPa)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Elastic Modulus (GPa)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <tr>
                <td className="px-4 py-3 text-sm">Structural Steel (A36)</td>
                <td className="px-4 py-3 text-sm">250</td>
                <td className="px-4 py-3 text-sm">200</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm">High-Strength Steel (A992)</td>
                <td className="px-4 py-3 text-sm">345</td>
                <td className="px-4 py-3 text-sm">200</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm">Concrete (M25)</td>
                <td className="px-4 py-3 text-sm">25</td>
                <td className="px-4 py-3 text-sm">25</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm">Concrete (M30)</td>
                <td className="px-4 py-3 text-sm">30</td>
                <td className="px-4 py-3 text-sm">27</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm">Aluminum (6061-T6)</td>
                <td className="px-4 py-3 text-sm">240</td>
                <td className="px-4 py-3 text-sm">70</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MaterialConverter;
