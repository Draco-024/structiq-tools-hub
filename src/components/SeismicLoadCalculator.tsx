
import { useState } from 'react';
import { 
  AlertTriangle, 
  BarChart,
  Building,
  Scale,
  Layers
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

type SoilType = 'I' | 'II' | 'III';
type BuildingType = 'Residential' | 'Commercial' | 'Industrial' | 'Important';
type ResponseFactor = 'Ordinary' | 'Special' | 'Ductile';

const SeismicLoadCalculator = () => {
  // Inputs
  const [seismicZone, setSeismicZone] = useState(3);
  const [soilType, setSoilType] = useState<SoilType>('II');
  const [buildingType, setBuildingType] = useState<BuildingType>('Residential');
  const [responseFactor, setResponseFactor] = useState<ResponseFactor>('Ordinary');
  const [height, setHeight] = useState(15);
  const [floors, setFloors] = useState(5);
  const [buildingWeight, setBuildingWeight] = useState(10000);
  const [timePeriod, setTimePeriod] = useState(0.6);
  
  // Results
  const [results, setResults] = useState<{
    baseShear: number;
    zoneFactorZ: number;
    importanceFactorI: number;
    responseReductionR: number;
    spectralAccelerationSa: number;
    lateralForces: {floor: number, height: number, weight: number, force: number}[];
    spectralCurve: {period: number, sa: number}[];
  } | null>(null);

  const calculateSeismicForces = () => {
    // Zone factor (Z) as per IS 1893-2016
    const zoneFactorMap: {[key: number]: number} = {
      2: 0.10,
      3: 0.16,
      4: 0.24,
      5: 0.36
    };
    const zoneFactorZ = zoneFactorMap[seismicZone];
    
    // Importance factor (I) as per IS 1893-2016
    const importanceFactorMap: {[key in BuildingType]: number} = {
      'Residential': 1.0,
      'Commercial': 1.0,
      'Industrial': 1.2,
      'Important': 1.5
    };
    const importanceFactorI = importanceFactorMap[buildingType];
    
    // Response reduction factor (R) as per IS 1893-2016
    const responseReductionMap: {[key in ResponseFactor]: number} = {
      'Ordinary': 3.0,
      'Special': 4.0,
      'Ductile': 5.0
    };
    const responseReductionR = responseReductionMap[responseFactor];
    
    // Calculate spectral acceleration coefficient (Sa/g) based on time period
    let spectralAccelerationSa = 0;
    
    // Soil type factors for different soil conditions
    let soilFactor = 1.0;
    if (soilType === 'I') {
      // Rock or Hard Soil
      if (timePeriod <= 0.1) {
        spectralAccelerationSa = 1 + 15 * timePeriod;
      } else if (timePeriod <= 0.4) {
        spectralAccelerationSa = 2.5;
      } else if (timePeriod <= 4.0) {
        spectralAccelerationSa = 1.0 / timePeriod;
      } else {
        spectralAccelerationSa = 0.25;
      }
    } else if (soilType === 'II') {
      // Medium Soil
      if (timePeriod <= 0.1) {
        spectralAccelerationSa = 1 + 15 * timePeriod;
      } else if (timePeriod <= 0.55) {
        spectralAccelerationSa = 2.5;
      } else if (timePeriod <= 4.0) {
        spectralAccelerationSa = 1.36 / timePeriod;
      } else {
        spectralAccelerationSa = 0.34;
      }
    } else if (soilType === 'III') {
      // Soft Soil
      if (timePeriod <= 0.1) {
        spectralAccelerationSa = 1 + 15 * timePeriod;
      } else if (timePeriod <= 0.67) {
        spectralAccelerationSa = 2.5;
      } else if (timePeriod <= 4.0) {
        spectralAccelerationSa = 1.67 / timePeriod;
      } else {
        spectralAccelerationSa = 0.42;
      }
    }
    
    // Design horizontal seismic coefficient (Ah)
    const designSeismicCoeff = (zoneFactorZ * importanceFactorI * spectralAccelerationSa) / (2 * responseReductionR);
    
    // Base shear calculation (VB) as per IS 1893
    const baseShear = designSeismicCoeff * buildingWeight;
    
    // Distribution of lateral forces along height
    const lateralForces = [];
    const floorHeight = height / floors;
    const floorWeight = buildingWeight / floors;
    
    let sumWiHi_k = 0;
    const k = timePeriod > 0.5 ? 2 : 1; // k factor as per IS 1893
    
    for (let i = 1; i <= floors; i++) {
      const floorHt = i * floorHeight;
      sumWiHi_k += floorWeight * Math.pow(floorHt, k);
    }
    
    for (let i = 1; i <= floors; i++) {
      const floorHt = i * floorHeight;
      const lateralForce = baseShear * floorWeight * Math.pow(floorHt, k) / sumWiHi_k;
      
      lateralForces.push({
        floor: i,
        height: floorHt,
        weight: floorWeight,
        force: lateralForce
      });
    }
    
    // Generate spectral curve data for plotting
    const spectralCurve = [];
    for (let t = 0; t <= 4; t += 0.1) {
      let sa = 0;
      if (soilType === 'I') {
        // Rock or Hard Soil
        if (t <= 0.1) {
          sa = 1 + 15 * t;
        } else if (t <= 0.4) {
          sa = 2.5;
        } else if (t <= 4.0) {
          sa = 1.0 / t;
        } else {
          sa = 0.25;
        }
      } else if (soilType === 'II') {
        // Medium Soil
        if (t <= 0.1) {
          sa = 1 + 15 * t;
        } else if (t <= 0.55) {
          sa = 2.5;
        } else if (t <= 4.0) {
          sa = 1.36 / t;
        } else {
          sa = 0.34;
        }
      } else if (soilType === 'III') {
        // Soft Soil
        if (t <= 0.1) {
          sa = 1 + 15 * t;
        } else if (t <= 0.67) {
          sa = 2.5;
        } else if (t <= 4.0) {
          sa = 1.67 / t;
        } else {
          sa = 0.42;
        }
      }
      
      spectralCurve.push({
        period: parseFloat(t.toFixed(1)),
        sa: parseFloat(sa.toFixed(2))
      });
    }
    
    setResults({
      baseShear,
      zoneFactorZ,
      importanceFactorI,
      responseReductionR,
      spectralAccelerationSa,
      lateralForces,
      spectralCurve
    });
  };

  return (
    <div className="p-4">
      <div className="glass p-5 rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <AlertTriangle className="mr-2" size={20} />
          Seismic Load Calculator (IS 1893)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Seismic Zone</label>
            <select
              value={seismicZone}
              onChange={(e) => setSeismicZone(Number(e.target.value))}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            >
              <option value={2}>Zone II (Low Damage Risk)</option>
              <option value={3}>Zone III (Moderate Damage Risk)</option>
              <option value={4}>Zone IV (High Damage Risk)</option>
              <option value={5}>Zone V (Very High Damage Risk)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Soil Type</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value as SoilType)}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            >
              <option value="I">Type I - Rock or Hard Soil</option>
              <option value="II">Type II - Medium Soil</option>
              <option value="III">Type III - Soft Soil</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Building Type</label>
            <select
              value={buildingType}
              onChange={(e) => setBuildingType(e.target.value as BuildingType)}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            >
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Important">Important (Hospitals, Schools)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Response Factor</label>
            <select
              value={responseFactor}
              onChange={(e) => setResponseFactor(e.target.value as ResponseFactor)}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            >
              <option value="Ordinary">Ordinary RC Frame</option>
              <option value="Special">Special RC Frame</option>
              <option value="Ductile">Ductile RC Frame</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Building Height (m)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              min={3}
              max={300}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Number of Floors</label>
            <input
              type="number"
              value={floors}
              onChange={(e) => setFloors(Number(e.target.value))}
              min={1}
              max={100}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Building Weight (kN)</label>
            <input
              type="number"
              value={buildingWeight}
              onChange={(e) => setBuildingWeight(Number(e.target.value))}
              min={1000}
              max={1000000}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Fundamental Period (s)</label>
            <input
              type="number"
              value={timePeriod}
              onChange={(e) => setTimePeriod(Number(e.target.value))}
              min={0.1}
              max={4}
              step={0.1}
              className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-white"
            />
            <p className="text-xs text-gray-500 mt-1">
              Approx. T = 0.09h/√d for RC frame (h in m)
            </p>
          </div>
        </div>
        
        <button
          onClick={calculateSeismicForces}
          className="mt-4 w-full py-2.5 bg-accent-color hover:bg-accent-color/90 transition-colors text-white rounded-lg font-medium"
        >
          Calculate Seismic Forces
        </button>
      </div>
      
      {results && (
        <div className="glass p-5 rounded-xl mb-6 animate-fade-in">
          <h3 className="text-lg font-semibold mb-4">Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-black/30 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Scale size={18} className="mr-2 text-accent-color" />
                <p className="text-gray-400 font-medium">Base Shear</p>
              </div>
              <p className="text-xl font-semibold">
                {results.baseShear.toFixed(2)} kN
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Total horizontal force at the base of the structure
              </p>
            </div>
            
            <div className="bg-black/30 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <AlertTriangle size={18} className="mr-2 text-accent-color" />
                <p className="text-gray-400 font-medium">Design Parameters</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-400">Zone Factor (Z): </span>
                  <span>{results.zoneFactorZ}</span>
                </div>
                <div>
                  <span className="text-gray-400">Importance (I): </span>
                  <span>{results.importanceFactorI}</span>
                </div>
                <div>
                  <span className="text-gray-400">Response (R): </span>
                  <span>{results.responseReductionR}</span>
                </div>
                <div>
                  <span className="text-gray-400">Sa/g: </span>
                  <span>{results.spectralAccelerationSa.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-md font-medium mb-3 flex items-center">
              <Building size={18} className="mr-2 text-accent-color" />
              Distribution of Lateral Forces
            </h4>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-black/30 text-left">
                    <th className="p-2 text-sm font-medium">Floor</th>
                    <th className="p-2 text-sm font-medium">Height (m)</th>
                    <th className="p-2 text-sm font-medium">Weight (kN)</th>
                    <th className="p-2 text-sm font-medium">Lateral Force (kN)</th>
                  </tr>
                </thead>
                <tbody>
                  {results.lateralForces.map((floor, index) => (
                    <tr key={index} className="border-t border-gray-800">
                      <td className="p-2 text-sm">{floor.floor}</td>
                      <td className="p-2 text-sm">{floor.height.toFixed(2)}</td>
                      <td className="p-2 text-sm">{floor.weight.toFixed(2)}</td>
                      <td className="p-2 text-sm">{floor.force.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-72">
              <h4 className="text-md font-medium mb-3 flex items-center">
                <BarChart size={18} className="mr-2 text-accent-color" />
                Lateral Force Distribution
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={results.lateralForces.map(f => ({ 
                    floor: `Floor ${f.floor}`, 
                    force: parseFloat(f.force.toFixed(2)) 
                  }))}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis type="number" />
                  <YAxis dataKey="floor" type="category" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', borderColor: '#333' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="force" fill="var(--accent-color)" name="Force (kN)" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="h-72">
              <h4 className="text-md font-medium mb-3 flex items-center">
                <Layers size={18} className="mr-2 text-accent-color" />
                Design Spectrum (Sa/g)
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={results.spectralCurve}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis 
                    dataKey="period" 
                    label={{ value: 'Period (s)', position: 'insideBottomRight', offset: -5 }} 
                  />
                  <YAxis 
                    label={{ value: 'Sa/g', angle: -90, position: 'insideLeft' }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', borderColor: '#333' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sa" 
                    stroke="var(--accent-color)" 
                    activeDot={{ r: 8 }}
                    name="Spectral Acceleration" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <p className="text-yellow-400 text-sm">
              <span className="font-medium">Note:</span> This is a simplified calculation based on IS 1893 (Part 1). 
              For actual structural design, a full dynamic analysis by a qualified structural engineer is recommended.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeismicLoadCalculator;
