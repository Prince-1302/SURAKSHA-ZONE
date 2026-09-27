import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Share2, Download, Building, AlertTriangle, CheckCircle2 } from 'lucide-react';
import LiveRouteMap from '../components/LiveRouteMap';
import { getSiteMaxCapacity } from '../data/data.js';

export default function RelocationPlan() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const site       = location.state?.site  || null;
  const hab        = location.state?.hab   || { name: 'Village Boragaon', population: 1240 };
  // cap may have been computed in CapacityAnalysis and passed forward
  const passedCap  = location.state?.cap   || null;
  const isGenerated = location.state?.generatedPlan || false;

  // ---- Compute or reuse capacity ----
  const cap = (passedCap && passedCap.maxSafeCapacity)
    ? passedCap
    : site && site.landCapacity
      ? getSiteMaxCapacity(site)
      : null;

  const popRequired    = hab.population ?? 1240;
  const maxSafeCap     = cap?.maxSafeCapacity ?? 0;
  const availableCap   = cap?.availableCapacity ?? 0;
  const limitingFactor = cap?.limitingFactor ?? '—';
  const canAccommodate = availableCap >= popRequired;
  const accommodated   = Math.min(availableCap, popRequired);
  const overflow       = Math.max(0, popRequired - availableCap);
  const utilPct        = maxSafeCap > 0
    ? Math.round(((site?.currentOccupancy ?? 0) + accommodated) / maxSafeCap * 100)
    : 0;

  // ---- Relocation flow card ----
  const flowCard = site
    ? { from: hab.name, to: site.shortName || site.name, pop: accommodated, overflow }
    : { from: 'Village Boragaon', to: 'Relocation Site C', pop: 1240, overflow: 0 };

  return (
    <>
      {/* Header */}
      <div className="flex-between mb-4">
        <div>
          <h1>Recommended Relocation Plan</h1>
          <p className="text-muted">Finalized logistics and assignment mapping · Illustrative prototype data</p>
        </div>
        <div style={{display:'flex', gap:10}}>
          <button className="btn btn-secondary"><Share2 size={16} /> Share</button>
          <button className="btn btn-secondary" onClick={() => navigate('/reports')}>
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* Status banner */}
      {isGenerated && (
        <div style={{
          marginBottom:20, padding:'12px 16px',
          background: canAccommodate ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
          border: `1px solid ${canAccommodate ? 'var(--risk-low)' : 'var(--risk-extreme)'}`,
          borderRadius:8, display:'flex', alignItems:'center', gap:10,
        }}>
          {canAccommodate
            ? <CheckCircle2 size={18} color="var(--risk-low)" />
            : <AlertTriangle size={18} color="var(--risk-extreme)" />}
          <span style={{fontWeight:600, color: canAccommodate ? 'var(--risk-low)' : 'var(--risk-extreme)'}}>
            {canAccommodate
              ? `Relocation plan generated. ${site?.shortName || 'Selected site'} can fully accommodate ${hab.name}.`
              : `Split relocation required — ${site?.shortName || 'Selected site'} can accommodate ${accommodated.toLocaleString()} of ${popRequired.toLocaleString()} people.`}
          </span>
        </div>
      )}

      {/* KPI strip — all computed from real data */}
      <div className="grid-kpi" style={{gridTemplateColumns:'repeat(4, 1fr)', marginBottom:24}}>
        <div className="kpi-card" style={{background:'rgba(18,59,109,0.1)', border:'1px solid var(--govt-blue)'}}>
          <div className="text-muted" style={{fontSize:'0.85rem'}}>Population to Relocate</div>
          <div style={{fontSize:'2rem', fontWeight:700, color:'var(--govt-blue)'}}>{popRequired.toLocaleString()}</div>
          <div className="trend">{hab.name}</div>
        </div>
        <div className="kpi-card">
          <div className="text-muted" style={{fontSize:'0.85rem'}}>Site Safe Capacity</div>
          <div style={{fontSize:'2rem', fontWeight:700}}>{maxSafeCap.toLocaleString()}</div>
          <div className="trend">Limiting: {limitingFactor}</div>
        </div>
        <div className="kpi-card">
          <div className="text-muted" style={{fontSize:'0.85rem'}}>Available Capacity</div>
          <div style={{fontSize:'2rem', fontWeight:700, color: canAccommodate ? 'var(--risk-low)' : 'var(--risk-moderate)'}}>
            {availableCap.toLocaleString()}
          </div>
          <div className="trend">{canAccommodate ? 'Sufficient' : 'Insufficient'}</div>
        </div>
        <div className="kpi-card">
          <div className="text-muted" style={{fontSize:'0.85rem'}}>Post-Move Utilization</div>
          <div style={{fontSize:'2rem', fontWeight:700, color: utilPct > 90 ? 'var(--risk-extreme)' : 'var(--risk-moderate)'}}>
            {utilPct}%
          </div>
          <div className="trend">of safe capacity</div>
        </div>
      </div>

      <div className="layout-split mt-4">
        {/* Left — relocation flow */}
        <div className="flex-column gap-4">
          <div className="card">
            <h3>Relocation Flow</h3>
            <div style={{marginTop:20, padding:20, background:'var(--bg-surface)', borderRadius:8, border:'1px solid var(--border-color)'}}>
              {/* From */}
              <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:6, marginBottom:20}}>
                <MapPin size={28} color="var(--risk-extreme)" />
                <strong style={{fontSize:'1rem'}}>{flowCard.from}</strong>
                <div style={{display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center'}}>
                  <span className="badge extreme" style={{fontSize:'0.72rem'}}>{popRequired.toLocaleString()} people</span>
                  <span className="badge extreme" style={{fontSize:'0.72rem'}}>Requires Relocation</span>
                </div>
              </div>

              {/* Arrow */}
              <div style={{display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20}}>
                <div style={{width:'100%', height:2, background:'var(--border-color)', position:'relative'}}>
                  <ArrowRight size={18} color="var(--text-muted)"
                    style={{position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)', background:'var(--bg-surface)', padding:2}} />
                </div>
              </div>

              {/* To */}
              <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:6}}>
                <Building size={28} color="var(--risk-low)" />
                <strong style={{fontSize:'1rem', textAlign:'center'}}>{flowCard.to}</strong>
                <div style={{display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center'}}>
                  <span className="badge low" style={{fontSize:'0.72rem'}}>{accommodated.toLocaleString()} accommodated</span>
                  {overflow > 0 && (
                    <span className="badge extreme" style={{fontSize:'0.72rem'}}>{overflow.toLocaleString()} need 2nd site</span>
                  )}
                </div>
              </div>
            </div>

            {/* Capacity status detail */}
            <div style={{marginTop:16, padding:'12px 16px', borderRadius:8,
              background: canAccommodate ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.07)',
              border: `1px solid ${canAccommodate ? 'var(--risk-low)' : 'var(--risk-extreme)'}`,
            }}>
              <div style={{fontSize:'0.8rem', fontWeight:700, color: canAccommodate ? 'var(--risk-low)' : 'var(--risk-extreme)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em'}}>
                Capacity Status
              </div>
              {canAccommodate ? (
                <p style={{margin:0, fontSize:'0.85rem'}}>
                  ✓ Available capacity <strong>({availableCap.toLocaleString()})</strong> exceeds required population
                  <strong> ({popRequired.toLocaleString()})</strong>. Surplus: <strong>{(availableCap - popRequired).toLocaleString()}</strong>.
                  Single-site relocation is feasible.
                </p>
              ) : (
                <p style={{margin:0, fontSize:'0.85rem'}}>
                  ⚠ Available capacity <strong>({availableCap.toLocaleString()})</strong> is below required{' '}
                  <strong>({popRequired.toLocaleString()})</strong>.{' '}
                  <strong style={{color:'var(--risk-moderate)'}}>{accommodated.toLocaleString()} can move to {site?.shortName || 'this site'}</strong>.{' '}
                  The remaining <strong style={{color:'var(--risk-extreme)'}}>{overflow.toLocaleString()} people require an additional site</strong>.
                </p>
              )}
            </div>
          </div>

          {/* Site details */}
          {site && (
            <div className="card">
              <h3>Selected Site Details</h3>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:14, fontSize:'0.85rem'}}>
                {[
                  ['Site',           site.shortName || site.name],
                  ['District',       site.district],
                  ['Suitability',    `${site.suitabilityScore}/100`],
                  ['Elevation',      `${site.elevationM} m`],
                  ['Road Access',    site.roadAccess],
                  ['Flood Risk',     site.floodRiskAtSite],
                  ['Limiting Factor',limitingFactor],
                  ['Safe Capacity',  maxSafeCap.toLocaleString()],
                ].map(([k, v]) => (
                  <div key={k} style={{background:'var(--bg-surface)', padding:'10px 12px', borderRadius:6}}>
                    <div style={{fontSize:'0.72rem', color:'var(--text-muted)', marginBottom:2}}>{k}</div>
                    <div style={{fontWeight:600}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — summary + OSRM route map */}
        <div className="right-panel">
          <div className="card">
            <h3>Plan Summary</h3>
            <div className="flex-column gap-3 mt-4" style={{fontSize:'0.88rem'}}>
              <div className="flex-between">
                <span className="text-muted">Habitation</span>
                <span style={{fontWeight:600}}>{hab.name}</span>
              </div>
              <div className="flex-between">
                <span className="text-muted">Population</span>
                <span style={{fontWeight:600}}>{popRequired.toLocaleString()}</span>
              </div>
              <div className="flex-between">
                <span className="text-muted">Selected Site</span>
                <span style={{fontWeight:600}}>{site?.shortName || '—'}</span>
              </div>
              <div className="flex-between">
                <span className="text-muted">Safe Capacity</span>
                <span style={{fontWeight:600}}>{maxSafeCap.toLocaleString()}</span>
              </div>
              <div className="flex-between">
                <span className="text-muted">Available Capacity</span>
                <span style={{fontWeight:600, color: canAccommodate ? 'var(--risk-low)' : 'var(--risk-moderate)'}}>
                  {availableCap.toLocaleString()}
                </span>
              </div>
              <div className="flex-between">
                <span className="text-muted">Suitability Score</span>
                <span style={{fontWeight:600}}>{site?.suitabilityScore ?? '—'}/100</span>
              </div>
              <div className="flex-between">
                <span className="text-muted">Capacity Status</span>
                <span style={{fontWeight:700, color: canAccommodate ? 'var(--risk-low)' : 'var(--risk-extreme)'}}>
                  {canAccommodate ? 'Sufficient ✓' : 'Split Required ⚠'}
                </span>
              </div>
              <div className="flex-between">
                <span className="text-muted">Limiting Factor</span>
                <span style={{fontWeight:600, color:'var(--risk-extreme)'}}>{limitingFactor}</span>
              </div>
            </div>

            <div style={{marginTop:16, padding:'12px', background:'rgba(255,255,255,0.04)', borderRadius:6, fontSize:'0.78rem', color:'var(--text-muted)', lineHeight:1.5}}>
              <strong>Recommended Action:</strong>{' '}
              {canAccommodate
                ? `Proceed with full relocation of ${popRequired.toLocaleString()} people to ${site?.shortName || 'selected site'}. Post-move site utilization will be approximately ${utilPct}%.`
                : `Relocate ${accommodated.toLocaleString()} people to ${site?.shortName || 'this site'}. Identify a secondary site for the remaining ${overflow.toLocaleString()} people. Reassess both sites with district authorities.`}
            </div>

            <p style={{fontSize:'0.73rem', color:'var(--text-muted)', textAlign:'center', marginTop:10}}>
              Illustrative prototype data · Authority validation required before operational use.
            </p>

            <button className="btn btn-primary btn-block mt-4" style={{padding:'14px'}}
              onClick={() => navigate('/reports')}>
              Generate Authority Action Report <ArrowRight size={16} />
            </button>
          </div>

          {/* OSRM route map */}
          <div className="card mt-4">
            <h3 style={{marginBottom:4}}>Route to Site</h3>
            <p className="text-muted" style={{fontSize:'0.8rem', marginBottom:12}}>
              Use the search fields below to calculate the live OSRM evacuation route.
            </p>
            <LiveRouteMap />
          </div>
        </div>
      </div>
    </>
  );
}
