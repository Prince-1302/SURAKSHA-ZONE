import { useState } from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';

export default function ScenarioSimulator() {
  const [rainfall, setRainfall] = useState(0);
  const [flood, setFlood] = useState(0);
  const [population, setPopulation] = useState(0);

  // Simple math to simulate changes based on sliders
  const isChanged = rainfall > 0 || flood > 0 || population > 0;
  
  const baseRedZones = 32;
  const basePeople = 14200;
  const baseRelocations = 12;

  const simRedZones = baseRedZones + Math.floor(rainfall * 0.5) + Math.floor(flood * 0.3);
  const simPeople = basePeople + (rainfall * 286) + (population * 142);
  const simRelocations = baseRelocations + Math.floor(rainfall * 0.3);

  const diffRedZones = simRedZones - baseRedZones;
  const diffPeople = simPeople - basePeople;
  
  return (
    <>
      <div className="mb-4">
        <h1>Disaster Scenario Simulator</h1>
        <p className="text-muted">Evaluate how changing hazard conditions affect relocation decisions.</p>
      </div>

      <div className="layout-split">
        {/* Sliders */}
        <div className="card">
          <h3>Simulation Parameters</h3>
          <p className="text-muted" style={{fontSize:'0.85rem', marginBottom:30}}>Adjust variables to see their impact on risk profiles.</p>

          <div className="flex-column gap-4">
            <div>
              <div className="flex-between mb-2">
                <span style={{fontWeight:500}}>Rainfall Increase</span>
                <span style={{fontWeight:700, color:'var(--govt-blue)'}}>+{rainfall}%</span>
              </div>
              <input type="range" min="0" max="100" value={rainfall} onChange={(e) => setRainfall(Number(e.target.value))} />
            </div>

            <div className="mt-4">
              <div className="flex-between mb-2">
                <span style={{fontWeight:500}}>Flood Intensity</span>
                <span style={{fontWeight:700, color:'var(--govt-blue)'}}>+{flood}%</span>
              </div>
              <input type="range" min="0" max="100" value={flood} onChange={(e) => setFlood(Number(e.target.value))} />
            </div>

            <div className="mt-4">
              <div className="flex-between mb-2">
                <span style={{fontWeight:500}}>Population Growth</span>
                <span style={{fontWeight:700, color:'var(--govt-blue)'}}>+{population}%</span>
              </div>
              <input type="range" min="0" max="50" value={population} onChange={(e) => setPopulation(Number(e.target.value))} />
            </div>
            
            <div className="mt-4">
              <div className="flex-between mb-2">
                <span style={{fontWeight:500}}>Road Accessibility Reduction</span>
                <span style={{fontWeight:700, color:'var(--govt-blue)'}}>0%</span>
              </div>
              <input type="range" min="0" max="100" defaultValue="0" />
            </div>
          </div>
        </div>

        {/* Impact */}
        <div className="right-panel">
          <div className="card" style={{border: isChanged ? '1px solid var(--risk-extreme)' : '1px solid var(--border-color)'}}>
            <h3>Simulation Results</h3>
            
            <div className="flex-between mt-4 pb-4" style={{borderBottom:'1px solid var(--border-color)'}}>
              <div className="flex-column">
                <span className="text-muted" style={{fontSize:'0.8rem'}}>Red-Zone Habitations</span>
                <div style={{display:'flex', alignItems:'baseline', gap:8}}>
                  <span style={{fontSize:'2rem', fontWeight:700, color: isChanged ? 'var(--risk-extreme)' : 'white'}}>{simRedZones}</span>
                  {isChanged && <span className="text-muted" style={{textDecoration:'line-through', fontSize:'1rem'}}>{baseRedZones}</span>}
                </div>
              </div>
              <div className="flex-column text-right">
                <span className="text-muted" style={{fontSize:'0.8rem'}}>People at Risk</span>
                <div style={{display:'flex', alignItems:'baseline', gap:8, justifyContent:'flex-end'}}>
                  {isChanged && <span className="text-muted" style={{textDecoration:'line-through', fontSize:'1rem'}}>{basePeople.toLocaleString()}</span>}
                  <span style={{fontSize:'2rem', fontWeight:700, color: isChanged ? 'var(--risk-extreme)' : 'white'}}>{simPeople.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {isChanged ? (
              <div className="mt-4">
                <h4 style={{color:'var(--risk-extreme)'}}>Decision Impact</h4>
                <div className="flex-column gap-2 mt-4">
                  <div style={{display:'flex', gap:10, alignItems:'flex-start'}}>
                    <AlertTriangle size={18} color="var(--risk-extreme)" style={{marginTop:2}} />
                    <span style={{fontSize:'0.9rem'}}>{diffRedZones} additional habitations enter extreme-risk zones.</span>
                  </div>
                  <div style={{display:'flex', gap:10, alignItems:'flex-start'}}>
                    <AlertTriangle size={18} color="var(--risk-extreme)" style={{marginTop:2}} />
                    <span style={{fontSize:'0.9rem'}}>{diffPeople.toLocaleString()} additional people become exposed.</span>
                  </div>
                  {diffRedZones > 10 && (
                    <div style={{display:'flex', gap:10, alignItems:'flex-start'}}>
                      <AlertTriangle size={18} color="var(--risk-high)" style={{marginTop:2}} />
                      <span style={{fontSize:'0.9rem'}}>3 relocation sites reach critical capacity.</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 p-4" style={{background:'rgba(239, 68, 68, 0.1)', borderRadius:8, textAlign:'center'}}>
                  <div className="text-muted" style={{fontSize:'0.8rem'}}>New Immediate Relocations Required:</div>
                  <div style={{fontSize:'2.5rem', fontWeight:800, color:'var(--risk-extreme)'}}>{simRelocations}</div>
                </div>
              </div>
            ) : (
              <div className="mt-4 text-center text-muted" style={{padding:'40px 0'}}>
                Adjust sliders to simulate impact.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
