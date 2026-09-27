import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { getSiteMaxCapacity } from '../data/data.js';

export default function CapacityAnalysis() {
  const navigate = useNavigate();
  const location = useLocation();

  // site comes from RelocationFinder via navigate('/capacity', { state: { site } })
  // The site object is the raw site data row from data.js (includes all capacity fields)
  const site = location.state?.site;
  // hab comes through if wired; fallback to Boragaon population for current prototype
  const hab  = location.state?.hab || { name: 'Village Boragaon', population: 1240 };

  // ---- Guard: if no site, show a helpful error ----
  if (!site || !site.landCapacity) {
    return (
      <div style={{ padding: 60, textAlign: 'center' }}>
        <AlertTriangle size={48} color="var(--risk-high)" style={{ marginBottom: 16 }} />
        <h2>No Site Selected</h2>
        <p className="text-muted" style={{ marginBottom: 24 }}>
          Please select a relocation site from the Site Finder first.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/relocation-sites')}>
          Go to Site Finder
        </button>
      </div>
    );
  }

  // ---- Real capacity computation ----
  const cap = getSiteMaxCapacity(site);
  const { maxSafeCapacity, limitingFactor, availableCapacity, categories } = cap;
  const currentOccupancy = site.currentOccupancy ?? 0;
  const utilizationPct   = maxSafeCapacity > 0 ? Math.round((currentOccupancy / maxSafeCapacity) * 100) : 0;
  const popRequired      = hab.population ?? 1240;
  const canAccommodate   = availableCapacity >= popRequired;
  const accommodated     = Math.min(availableCapacity, popRequired);
  const overflow         = Math.max(0, popRequired - availableCapacity);

  // Capacity breakdown bar items — all real values
  const breakdownItems = [
    { name: 'Land Capacity',       cap: site.landCapacity,           icon: '🏔' },
    { name: 'Housing Capacity',    cap: site.housingCapacity,        icon: '🏠' },
    { name: 'Water Capacity',      cap: site.waterCapacity,          icon: '💧' },
    { name: 'Healthcare Capacity', cap: site.healthcareCapacity,     icon: '🏥' },
    { name: 'Education Capacity',  cap: site.educationCapacity,      icon: '🎓' },
    { name: 'Infrastructure',      cap: site.infrastructureCapacity, icon: '🛣' },
  ];
  const maxCap = Math.max(...breakdownItems.map(b => b.cap), 1);

  return (
    <>
      <div className="mb-4">
        <button className="btn btn-secondary mb-2" onClick={() => navigate(-1)} style={{padding:'6px 12px', fontSize:'0.8rem'}}>
          <ArrowLeft size={14} /> Back
        </button>
        <h1>Relocation Site Capacity Assessment</h1>
        <p className="text-muted">
          Analyzing infrastructure and resource limits for{' '}
          <strong style={{color:'white'}}>{site.shortName || site.name}</strong>
          {' '}— <span style={{fontSize:'0.85em', color:'var(--text-muted)'}}>Illustrative prototype data · Authority validation required</span>
        </p>
      </div>

      <div className="layout-split">
        {/* Left column — hero numbers */}
        <div className="flex-column gap-4">
          <div className="card" style={{padding:'40px', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center'}}>
            <h2 className="text-muted mb-2">MAXIMUM SAFE CAPACITY</h2>
            <div style={{fontSize:'4rem', fontWeight:800, color:'var(--risk-low)', lineHeight:1}}>
              {maxSafeCapacity.toLocaleString()}
            </div>
            <div className="text-muted" style={{marginBottom:4}}>people (constrained by {limitingFactor})</div>

            {/* KPI grid */}
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, width:'100%', marginTop:32}}>
              <div style={{background:'var(--bg-surface)', padding:20, borderRadius:8}}>
                <div className="text-muted" style={{fontSize:'0.8rem'}}>Current Occupancy</div>
                <div style={{fontSize:'1.8rem', fontWeight:600}}>{currentOccupancy.toLocaleString()}</div>
              </div>
              <div style={{background:'var(--bg-surface)', padding:20, borderRadius:8, border:'1px solid var(--risk-low)'}}>
                <div className="text-muted" style={{fontSize:'0.8rem'}}>Available Capacity</div>
                <div style={{fontSize:'1.8rem', fontWeight:600, color:'var(--risk-low)'}}>{availableCapacity.toLocaleString()}</div>
              </div>
              <div style={{background:'var(--bg-surface)', padding:20, borderRadius:8}}>
                <div className="text-muted" style={{fontSize:'0.8rem'}}>Utilization</div>
                <div style={{fontSize:'1.8rem', fontWeight:600}}>{utilizationPct}%</div>
              </div>
            </div>

            {/* Capacity vs Population status */}
            <div style={{marginTop:24, padding:16, borderRadius:8, textAlign:'left', width:'100%',
              background: canAccommodate ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              borderLeft: `4px solid ${canAccommodate ? 'var(--risk-low)' : 'var(--risk-extreme)'}`,
              border: `1px solid ${canAccommodate ? 'var(--risk-low)' : 'var(--risk-extreme)'}`,
            }}>
              <div style={{display:'flex', gap:10, alignItems:'flex-start'}}>
                {canAccommodate
                  ? <ShieldCheck size={22} color="var(--risk-low)" style={{flexShrink:0, marginTop:2}} />
                  : <AlertTriangle size={22} color="var(--risk-extreme)" style={{flexShrink:0, marginTop:2}} />}
                <div>
                  <h4 style={{margin:0, color: canAccommodate ? 'var(--risk-low)' : 'var(--risk-extreme)'}}>
                    {canAccommodate ? 'Capacity Sufficient' : 'Split Relocation Required'}
                  </h4>
                  {canAccommodate ? (
                    <p style={{margin:0, fontSize:'0.88rem', marginTop:4}}>
                      This site can accommodate all <strong>{popRequired.toLocaleString()}</strong> people from <strong>{hab.name}</strong>.
                      Available capacity: <strong>{availableCapacity.toLocaleString()}</strong> (surplus: {(availableCapacity - popRequired).toLocaleString()}).
                    </p>
                  ) : (
                    <p style={{margin:0, fontSize:'0.88rem', marginTop:4}}>
                      Available capacity (<strong>{availableCapacity.toLocaleString()}</strong>) is below the required{' '}
                      <strong>{popRequired.toLocaleString()}</strong> people from <strong>{hab.name}</strong>.
                      <br/>
                      <strong style={{color:'var(--risk-moderate)'}}>{accommodated.toLocaleString()} can be accommodated here</strong>
                      {overflow > 0 && <> · <strong style={{color:'var(--risk-extreme)'}}>{overflow.toLocaleString()} require an additional site</strong></>}.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — breakdown */}
        <div className="right-panel">
          <div className="card">
            <h3>Infrastructure Capacity Breakdown</h3>
            <p className="text-muted" style={{fontSize:'0.85rem', marginBottom:20}}>
              Limiting factor is highlighted. Maximum safe capacity = minimum across all categories.
            </p>

            <div className="flex-column gap-4">
              {breakdownItems.map(item => {
                const isLimiting = item.name.split(' ')[0] === limitingFactor || item.name === limitingFactor;
                const barWidth   = Math.min(100, Math.round((item.cap / maxCap) * 100));
                return (
                  <div
                    key={item.name}
                    style={{
                      padding: isLimiting ? '12px' : '4px 0',
                      background: isLimiting ? 'rgba(239,68,68,0.06)' : 'transparent',
                      border: isLimiting ? '1px solid var(--risk-extreme)' : '1px solid transparent',
                      borderRadius: 6,
                    }}
                  >
                    <div className="flex-between mb-2">
                      <span style={{fontWeight: isLimiting ? 600 : 400, color: isLimiting ? 'var(--risk-extreme)' : 'var(--text-main)', display:'flex', alignItems:'center', gap:6}}>
                        <span>{item.icon}</span>
                        {item.name}
                        {isLimiting && (
                          <span style={{marginLeft:6, fontSize:'0.68rem', background:'var(--risk-extreme)', color:'white', padding:'2px 7px', borderRadius:4, fontWeight:700}}>
                            LIMITING FACTOR
                          </span>
                        )}
                      </span>
                      <span style={{fontWeight:600, color: isLimiting ? 'var(--risk-extreme)' : 'inherit'}}>
                        {item.cap.toLocaleString()}
                      </span>
                    </div>
                    <div style={{height:8, background:'var(--bg-surface)', borderRadius:4, overflow:'hidden'}}>
                      <div style={{
                        height:'100%',
                        width:`${barWidth}%`,
                        background: isLimiting ? 'var(--risk-extreme)' : 'var(--govt-blue)',
                        borderRadius:4,
                        transition:'width 0.4s',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{marginTop:20, paddingTop:16, borderTop:'1px solid var(--border-color)'}}>
              <div className="flex-between mb-2">
                <span className="text-muted">Maximum Safe Capacity (limiting)</span>
                <strong>{maxSafeCapacity.toLocaleString()} people</strong>
              </div>
              <div className="flex-between mb-2">
                <span className="text-muted">Limiting factor</span>
                <strong style={{color:'var(--risk-extreme)'}}>{limitingFactor}</strong>
              </div>
              <div className="flex-between">
                <span className="text-muted">Road Access</span>
                <span>{site.roadAccess}</span>
              </div>
              <p className="text-muted" style={{fontSize:'0.78rem', marginTop:12}}>
                Illustrative prototype data — the final carrying capacity is constrained by the minimum
                capacity across critical infrastructure categories. Requires expert validation.
              </p>
            </div>

            <button
              className="btn btn-primary btn-block mt-4"
              onClick={() => navigate('/plan', { state: { generatedPlan: true, site, hab, cap } })}
            >
              Generate Relocation Plan <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
