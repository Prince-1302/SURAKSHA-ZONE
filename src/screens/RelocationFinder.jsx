import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl, useMap } from 'react-leaflet';
import { ArrowRight, CheckCircle2, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { getAllSites, getSiteMaxCapacity, getAllHabitations } from '../data/data.js';

// ---------------------------------------------------------------------------
// FitBounds: auto-fit the map to show all site markers on first render
// ---------------------------------------------------------------------------
function FitBoundsToSites({ sites }) {
  const map = useMap();
  useEffect(() => {
    if (!sites || sites.length === 0) return;
    const bounds = sites.map(s => [s.lat, s.lng]);
    map.fitBounds(bounds, { padding: [48, 48] });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

// ---------------------------------------------------------------------------
// FlyToSite: fly map to the selected site when card is clicked
// ---------------------------------------------------------------------------
function FlyToSite({ site }) {
  const map = useMap();
  useEffect(() => {
    if (site) map.flyTo([site.lat, site.lng], 13, { duration: 0.8 });
  }, [site, map]);
  return null;
}

// ---------------------------------------------------------------------------
// Colour helpers
// ---------------------------------------------------------------------------
function riskColor(riskLabel) {
  const r = (riskLabel || '').toLowerCase();
  if (r === 'very low' || r === 'low') return 'var(--risk-low)';
  if (r === 'moderate') return 'var(--risk-moderate)';
  return 'var(--risk-high)';
}

function suitabilityColor(score) {
  if (score >= 85) return 'var(--risk-low)';
  if (score >= 70) return 'var(--risk-moderate)';
  return 'var(--risk-high)';
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function RelocationFinder() {
  const navigate = useNavigate();
  const [activeSiteId, setActiveSiteId] = useState(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const allHabs = getAllHabitations();
  const [selectedHab, setSelectedHab] = useState(allHabs.find(h => h.name.includes('Boragaon')) || allHabs[0]);
  const [searchError, setSearchError] = useState('');

  // Load all 5 sites from the centralized data engine (includes capacity obj)
  const allSites = getAllSites().map(s => ({
    ...s,
    cap: getSiteMaxCapacity(s),          // { maxSafeCapacity, limitingFactor, availableCapacity }
    isRecommended: s.suitabilityScore === Math.max(...getAllSites().map(x => x.suitabilityScore)),
  }));

  // Sorted: highest suitability first
  const sortedSites = [...allSites].sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  const activeSite = allSites.find(s => s.id === activeSiteId) || null;

  // Refs for site card scrolling
  const cardRefs = useRef({});
  const setCardRef = useCallback((id, el) => { cardRefs.current[id] = el; }, []);

  // When a marker is clicked → scroll the right-side card into view
  const handleMarkerClick = (site) => {
    setActiveSiteId(site.id);
    setTimeout(() => {
      cardRefs.current[site.id]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 60);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase();
    const found = allHabs.find(h => h.name.toLowerCase().includes(query) || h.district.toLowerCase().includes(query));

    if (found) {
      setSelectedHab(found);
      setSearchError('');
    } else {
      setSearchError('Location not found — please select an available habitation');
    }
  };

  return (
    <>
      <div className="mb-4">
        <h1>Safe Relocation Site Assessment</h1>
        <p className="text-muted">Find locations capable of safely supporting displaced populations.</p>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <form onSubmit={handleSearch} style={{display:'flex', gap:10, maxWidth:600}}>
          <div style={{position:'relative', flex:1}}>
            <MapPin size={18} style={{position:'absolute', left:12, top:10, color:'var(--text-muted)'}}/>
            <input 
              type="text" 
              placeholder="Enter habitation/location (e.g., Boragaon, Sonapur)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width:'100%', background:'var(--bg-panel)', border:'1px solid var(--border-color)', borderRadius:8, padding:'10px 16px 10px 36px', color:'white', outline:'none' }}
            />
          </div>
          <button type="submit" className="btn btn-primary">Find Sites</button>
        </form>
        {searchError && <div style={{color:'var(--risk-high)', fontSize:'0.85rem', marginTop:8}}>{searchError}</div>}
      </div>

      {/* Banner */}
      <div className="card mb-4" style={{display:'flex', gap:40, alignItems:'center', padding:'16px 24px', background:'rgba(18, 59, 109, 0.2)', border:'1px solid var(--govt-blue)'}}>
        <div>
          <span className="text-muted" style={{fontSize:'0.8rem'}}>Selected habitation:</span>
          <h3 style={{margin:0}}>{selectedHab.name}</h3>
        </div>
        <div>
          <span className="text-muted" style={{fontSize:'0.8rem'}}>Population requiring relocation:</span>
          <h3 style={{margin:0, color:'var(--risk-extreme)'}}>{selectedHab.population.toLocaleString()}</h3>
        </div>
        <div style={{marginLeft:'auto', fontSize:'0.78rem', color:'var(--text-muted)', textAlign:'right'}}>
          {allSites.length} candidate sites · Sorted by suitability
        </div>
      </div>

      <div className="layout-split">
        {/* ── MAP ── */}
        <div className="card" style={{padding:0, minHeight:520, position:'relative'}}>
          {/* Legend overlay */}
          <div style={{position:'absolute', top:12, left:12, zIndex:1000, background:'rgba(10,15,30,0.85)', padding:'8px 14px', borderRadius:8, fontSize:'0.75rem', color:'white', lineHeight:1.8, backdropFilter:'blur(4px)'}}>
            <div style={{fontWeight:700, marginBottom:4, letterSpacing:'0.05em', textTransform:'uppercase', fontSize:'0.68rem', color:'var(--text-muted)'}}>Legend</div>
            <div style={{display:'flex', alignItems:'center', gap:7}}><span style={{width:10, height:10, borderRadius:'50%', background:'var(--risk-extreme)', display:'inline-block'}} /> Risk Origin (Boragaon)</div>
            <div style={{display:'flex', alignItems:'center', gap:7}}><span style={{width:10, height:10, borderRadius:'50%', background:'var(--risk-low)', display:'inline-block'}} /> Safe Relocation Site</div>
            <div style={{display:'flex', alignItems:'center', gap:7}}><span style={{width:10, height:10, borderRadius:'50%', background:'var(--risk-moderate)', display:'inline-block'}} /> Moderate Suitability</div>
          </div>

          <MapContainer
            center={[26.20, 91.68]}
            zoom={10}
            style={{height:'520px', width:'100%', borderRadius:8}}
            zoomControl={false}
          >
            <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OSM" />
            <ZoomControl position="bottomright" />

            {/* Auto-fit to all sites on load */}
            <FitBoundsToSites sites={allSites} />

            {/* Fly to selected habitation when it changes */}
            <FlyToSite site={selectedHab} />
            
            {/* Fly to selected relocation site when card is clicked */}
            {activeSite && <FlyToSite site={activeSite} />}

            {/* ── Origin habitation ── */}
            <CircleMarker
              center={[selectedHab.lat, selectedHab.lng]}
              radius={10}
              pathOptions={{ fillColor: '#ef4444', color: '#fff', weight: 2, fillOpacity: 0.9 }}
            >
              <Popup>
                <div style={{minWidth:140}}>
                  <strong style={{color:'#ef4444'}}>⚠ Risk Origin</strong><br/>
                  <strong>{selectedHab.name}</strong><br/>
                  Population: {selectedHab.population.toLocaleString()}
                </div>
              </Popup>
            </CircleMarker>

            {/* ── Relocation site markers ── */}
            {sortedSites.map(site => {
              const isActive = activeSiteId === site.id;
              const markerColor = suitabilityColor(site.suitabilityScore);
              return (
                <CircleMarker
                  key={site.id}
                  center={[site.lat, site.lng]}
                  radius={isActive ? 14 : 9}
                  pathOptions={{
                    fillColor: markerColor,
                    color: isActive ? '#fff' : markerColor,
                    weight: isActive ? 3 : 1.5,
                    fillOpacity: isActive ? 1 : 0.78,
                  }}
                  eventHandlers={{ click: () => handleMarkerClick(site) }}
                >
                  <Popup>
                    <div style={{minWidth:190, fontFamily:'inherit'}}>
                      {site.isRecommended && (
                        <div style={{background:'#22c55e', color:'white', padding:'2px 8px', borderRadius:8, fontSize:'0.7rem', fontWeight:700, marginBottom:6, display:'inline-block'}}>
                          #1 RECOMMENDED
                        </div>
                      )}
                      <strong style={{fontSize:'0.95rem'}}>{site.shortName}</strong><br/>
                      <span style={{fontSize:'0.78rem', color:'#64748b'}}>{site.district}</span>
                      <hr style={{margin:'6px 0', borderColor:'#e2e8f0'}}/>
                      <table style={{width:'100%', fontSize:'0.82rem', borderCollapse:'collapse'}}>
                        <tbody>
                          <tr><td style={{color:'#64748b', paddingRight:8}}>Suitability</td><td><strong style={{color: suitabilityColor(site.suitabilityScore) === 'var(--risk-low)' ? '#22c55e' : '#f97316'}}>{site.suitabilityScore}/100</strong></td></tr>
                          <tr><td style={{color:'#64748b', paddingRight:8}}>Safe Capacity</td><td><strong>{site.cap.maxSafeCapacity.toLocaleString()}</strong></td></tr>
                          <tr><td style={{color:'#64748b', paddingRight:8}}>Available</td><td><strong>{site.cap.availableCapacity.toLocaleString()}</strong></td></tr>
                          <tr><td style={{color:'#64748b', paddingRight:8}}>Flood Risk</td><td><strong style={{color: site.floodRiskAtSite === 'Very Low' ? '#22c55e' : site.floodRiskAtSite === 'Low' ? '#84cc16' : '#f97316'}}>{site.floodRiskAtSite}</strong></td></tr>
                          <tr><td style={{color:'#64748b', paddingRight:8}}>Elevation</td><td>{site.elevationM} m</td></tr>
                          <tr><td style={{color:'#64748b', paddingRight:8}}>Road Access</td><td>{site.roadAccess}</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        {/* ── SITE CARDS ── */}
        <div className="right-panel" style={{overflowY:'auto', maxHeight:540, paddingRight:6}}>
          {sortedSites.map((site, index) => {
            const isActive = activeSiteId === site.id;
            const col = suitabilityColor(site.suitabilityScore);
            return (
              <div
                key={site.id}
                ref={el => setCardRef(site.id, el)}
                className="card"
                style={{
                  border: isActive ? `2px solid ${col}` : site.isRecommended ? '2px solid var(--risk-low)' : '1px solid var(--border-color)',
                  position: 'relative',
                  cursor: 'pointer',
                  opacity: activeSiteId && !isActive ? 0.65 : 1,
                  transition: 'all 0.2s',
                  boxShadow: isActive ? `0 0 0 3px ${col}22` : 'none',
                }}
                onClick={() => setActiveSiteId(isActive ? null : site.id)}
              >
                {/* Recommended badge */}
                {site.isRecommended && (
                  <div style={{position:'absolute', top:-12, left:20, background:'var(--risk-low)', color:'white', padding:'4px 12px', borderRadius:12, fontSize:'0.75rem', fontWeight:700, display:'flex', alignItems:'center', gap:4}}>
                    <CheckCircle2 size={13} /> #1 RECOMMENDED
                  </div>
                )}

                {/* Header */}
                <div className="flex-between mt-2">
                  <div style={{display:'flex', alignItems:'center', gap:8}}>
                    <MapPin size={15} color={col} />
                    <h3 style={{margin:0, fontSize:'0.95rem'}}>{site.shortName}</h3>
                  </div>
                  <div className="badge" style={{background:`${col}20`, color:col, fontSize:'0.72rem'}}>SUITABLE</div>
                </div>
                <div style={{fontSize:'0.78rem', color:'var(--text-muted)', marginTop:2, marginBottom:12}}>{site.district} · {site.elevationM} m elevation</div>

                {/* KPI grid */}
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14}}>
                  <div style={{background:'var(--bg-surface)', padding:'10px 12px', borderRadius:6}}>
                    <div style={{fontSize:'0.72rem', color:'var(--text-muted)', marginBottom:2}}>Suitability</div>
                    <div style={{fontSize:'1.4rem', fontWeight:700, color:col, lineHeight:1}}>
                      {site.suitabilityScore} <span style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>/ 100</span>
                    </div>
                  </div>
                  <div style={{background:'var(--bg-surface)', padding:'10px 12px', borderRadius:6}}>
                    <div style={{fontSize:'0.72rem', color:'var(--text-muted)', marginBottom:2}}>Safe Capacity</div>
                    <div style={{fontSize:'1.4rem', fontWeight:700, lineHeight:1}}>{site.cap.maxSafeCapacity.toLocaleString()}</div>
                  </div>
                </div>

                {/* Detail rows */}
                <div style={{display:'flex', flexDirection:'column', gap:6, fontSize:'0.83rem', marginBottom:14}}>
                  <div className="flex-between">
                    <span className="text-muted">Available capacity</span>
                    <strong style={{color: site.cap.availableCapacity >= selectedHab.population ? 'var(--risk-low)' : 'var(--risk-moderate)'}}>
                      {site.cap.availableCapacity.toLocaleString()}
                    </strong>
                  </div>
                  <div className="flex-between">
                    <span className="text-muted">Flood risk at site</span>
                    <span style={{color: riskColor(site.floodRiskAtSite)}}>{site.floodRiskAtSite}</span>
                  </div>
                  <div className="flex-between">
                    <span className="text-muted">Road access</span>
                    <span>{site.roadAccess}</span>
                  </div>
                  <div className="flex-between">
                    <span className="text-muted">Limiting factor</span>
                    <span className="text-muted">{site.cap.limitingFactor}</span>
                  </div>
                </div>

                {/* Expand on select */}
                {isActive && (
                  <button
                    className="btn btn-primary btn-block"
                    onClick={e => {
                      e.stopPropagation();
                      navigate('/capacity', { state: { site, hab: selectedHab } });
                    }}
                  >
                    View Full Capacity Analysis <ArrowRight size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
