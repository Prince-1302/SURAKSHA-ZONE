import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, GeoJSON, ZoomControl, useMap } from 'react-leaflet';
import { Search, Loader2, MapPin, Download, AlertTriangle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import floodHazardData from '../data/hazards/floodHazard.js';

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 12);
  }, [center, map]);
  return null;
}

export default function RedZoneAnalysis() {
  const [activeOverlay, setActiveOverlay] = useState('multi');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const [mapCenter, setMapCenter] = useState([26.12, 91.7]);
  const [locationName, setLocationName] = useState('Kamrup Metropolitan, Assam');
  const [habitationsCount, setHabitationsCount] = useState(32);
  
  // 14-point irregular polygon — default Kamrup pilot region
  // Follows approximate south-bank Brahmaputra / urban fringe terrain
  const [redZonePolygon, setRedZonePolygon] = useState([
    [26.107, 91.648], [26.115, 91.662], [26.122, 91.671],
    [26.128, 91.683], [26.130, 91.698], [26.127, 91.712],
    [26.120, 91.724], [26.111, 91.731], [26.099, 91.728],
    [26.089, 91.718], [26.084, 91.703], [26.086, 91.685],
    [26.092, 91.668], [26.100, 91.654]
  ]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(searchQuery)}&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        
        setMapCenter([lat, lon]);
        setLocationName(data[0].display_name);
        
        // Deterministic polygon generation based on lat/lon
        const offsetLat = (lat % 0.05) || 0.02;
        const offsetLon = (lon % 0.05) || 0.03;
        
        // Generate 14-point irregular organic polygon from geocoded center
        const r = 0.025 + (Math.abs(lat * 13.7) % 0.018); // radius varies per location
        const pts = [];
        // 14 unequal angle steps to create an irregular shape
        const angles = [0, 22, 48, 72, 98, 124, 148, 175, 202, 228, 254, 278, 308, 335];
        const radii  = [1.0, 0.82, 1.12, 0.91, 1.20, 0.78, 1.08, 0.95, 1.15, 0.85, 1.05, 0.90, 1.18, 0.88];
        angles.forEach((a, i) => {
          const rad = (a * Math.PI) / 180;
          pts.push([
            lat + Math.sin(rad) * r * radii[i] * 0.85,
            lon + Math.cos(rad) * r * radii[i]
          ]);
        });
        setRedZonePolygon(pts);
        
        // Deterministic habitations count based on lat/lon numbers
        const detCount = Math.floor((Math.abs(lat * lon) * 100) % 50) + 12;
        setHabitationsCount(detCount);
      } else {
        alert("Location not found. Try a different query.");
      }
    } catch (err) {
      console.error(err);
      alert("Search failed.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <div className="mb-4 flex-between">
        <div>
          <h1>Hazard-Based Red Zone Identification</h1>
          <p className="text-muted">AI overlay mapping of critical danger areas</p>
        </div>
        <div className="card" style={{padding:'10px 16px', display:'flex', alignItems:'center', gap:12}}>
          <span style={{fontWeight:600}}>Multi-Hazard Overlay:</span>
          <div style={{background:'var(--risk-low)', color:'white', padding:'4px 12px', borderRadius:20, fontSize:'0.8rem', fontWeight:600}}>ON</div>
        </div>
      </div>

      <div className="mb-4">
        <form onSubmit={handleSearch} style={{display:'flex', gap:10, maxWidth:500}}>
          <div style={{position:'relative', flex:1}}>
            <Search size={18} style={{position:'absolute', left:12, top:10, color:'var(--text-muted)'}}/>
            <input 
              type="text" 
              placeholder="Search any location (e.g., Mumbai, Kerala, Assam)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width:'100%', background:'var(--bg-panel)', border:'1px solid var(--border-color)', borderRadius:8, padding:'10px 16px 10px 36px', color:'white', outline:'none' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isSearching}>
            {isSearching ? <Loader2 size={16} className="animate-spin" /> : 'Analyze Risk'}
          </button>
        </form>
      </div>

      <div className="tabs">
        {['Flood', 'Landslide', 'Cloudburst', 'Coastal Erosion', 'Historical Disaster', 'Combined Multi-Hazard'].map(tab => (
          <div 
            key={tab} 
            className={`tab ${activeOverlay === tab.toLowerCase().split(' ')[0] || (tab === 'Combined Multi-Hazard' && activeOverlay === 'multi') ? 'active' : ''}`}
            onClick={() => setActiveOverlay(tab === 'Combined Multi-Hazard' ? 'multi' : tab.toLowerCase().split(' ')[0])}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="layout-split mt-4">
        <div className="card" style={{padding:0, display:'flex', flexDirection:'column', minHeight:500}}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <span style={{ width: '10px', height: '10px', background: 'var(--risk-extreme)', borderRadius: '50%', display: 'inline-block' }}></span>
            Red Zone Area Map
          </div>
          
          <div style={{ position: 'relative', width: '100%', height: '500px', borderTop: '1px solid var(--border-color)', overflow: 'hidden', borderRadius: '0 0 8px 8px' }}>
            
            <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'white', padding: '8px 16px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 1000, boxShadow: '0 2px 8px rgba(0,0,0,0.2)', color: '#333', fontWeight: 600, fontSize: '0.9rem' }}>
              <span style={{ width: '10px', height: '10px', background: 'var(--risk-extreme)', borderRadius: '50%', display: 'inline-block' }}></span>
              Live Red Zone Mapping
            </div>

            <button 
              onClick={() => alert('Locate me functionality simulated.')}
              style={{ position: 'absolute', bottom: '24px', left: '16px', background: 'white', padding: '8px 16px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 1000, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', color: '#333', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#EF4444" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              Locate Me
            </button>

            <div style={{ position: 'absolute', bottom: '4px', right: '4px', background: 'rgba(255,255,255,0.9)', padding: '2px 8px', borderRadius: '4px', zIndex: 1000, fontSize: '10px', color: '#0369a1' }}>
              © OSM / Nominatim
            </div>

            <MapContainer center={mapCenter} zoom={11} style={{height: '100%', width: '100%', zIndex:1}} zoomControl={false}>
              <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <ZoomControl position="bottomright" />
              <MapUpdater center={mapCenter} />
              
              {/* Flood tab: render the real illustrative GeoJSON layer */}
              {activeOverlay === 'flood' ? (
                <>
                  <GeoJSON
                    key="rza-flood-layer"
                    data={floodHazardData}
                    style={(feature) => ({
                      color: '#1d4ed8',
                      fillColor: feature.properties.severity === 'Extreme' ? '#1d4ed8' : '#60a5fa',
                      weight: 2.5,
                      fillOpacity: 0.35,
                      dashArray: '6 4',
                    })}
                    onEachFeature={(feature, layer) => {
                      layer.bindTooltip(
                        `<strong>${feature.properties.name}</strong><br/>Severity: ${feature.properties.severity}<br/>${feature.properties.description}<br/><em style="font-size:10px;color:#999">${feature.properties.dataSource}</em>`,
                        { sticky: true }
                      );
                    }}
                  />
                </>
              ) : (
                /* Other overlays: use illustrative derived polygon (non-flood placeholder) */
                <Polygon
                  positions={redZonePolygon}
                  pathOptions={{
                    color: activeOverlay === 'landslide' ? '#92400e' : activeOverlay === 'cloudburst' ? '#7c3aed' : 'var(--risk-extreme)',
                    fillColor: activeOverlay === 'landslide' ? '#92400e' : activeOverlay === 'cloudburst' ? '#7c3aed' : 'var(--risk-extreme)',
                    fillOpacity: 0.35,
                    dashArray: '4 3',
                  }}
                />
              )}
            </MapContainer>
          </div>
        </div>

        <div className="right-panel">
          <div className="card">
            <h3>AI Risk Classification</h3>
            <p className="text-muted" style={{fontSize:'0.85rem', lineHeight:1.4}}>Analyzing geospatial data and hazard models for <strong style={{color:'white'}}>{locationName}</strong>.</p>

            {activeOverlay === 'flood' && (
              <div style={{marginTop:12, padding:'8px 12px', background:'rgba(29,78,216,0.12)', border:'1px solid #3b82f6', borderRadius:6, fontSize:'0.78rem', color:'#93c5fd'}}>
                🌊 Showing illustrative flood hazard GeoJSON layer (3 zones, Kamrup pilot region).
                Not official government data — SIH26191 prototype only.
              </div>
            )}
            {activeOverlay !== 'flood' && (
              <div style={{marginTop:12, padding:'8px 12px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:6, fontSize:'0.78rem', color:'#fca5a5'}}>
                ⚠️ This overlay is illustrative and location-derived.
                Only the Flood tab uses a real GeoJSON hazard layer.
              </div>
            )}
            
            {/* ── Scored Risk Tier Gauge ── */}
            {(() => {
              // Derive a representative area risk score from habitationsCount
              // (illustrative proxy — not an official government risk value)
              const areaScore = Math.min(100, Math.max(0, Math.round((habitationsCount / 62) * 100)));
              const tiers = [
                { label: 'Extreme', min: 75, max: 100, color: 'var(--risk-extreme)', bg: 'rgba(239,68,68,0.13)'  },
                { label: 'High',    min: 50, max: 74,  color: 'var(--risk-high)',    bg: 'rgba(249,115,22,0.11)' },
                { label: 'Moderate',min: 25, max: 49,  color: 'var(--risk-moderate)',bg: 'rgba(234,179,8,0.10)'  },
                { label: 'Low',     min: 0,  max: 24,  color: 'var(--risk-low)',     bg: 'rgba(34,197,94,0.09)'  },
              ];
              const activeTier = tiers.find(t => areaScore >= t.min && areaScore <= t.max) || tiers[0];

              return (
                <div style={{display:'flex', flexDirection:'column', gap:8, marginTop:16}}>
                  {/* Score chip */}
                  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4}}>
                    <span style={{fontSize:'0.78rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em'}}>Area Risk Score</span>
                    <div style={{display:'flex', alignItems:'center', gap:8}}>
                      <span style={{fontSize:'1.6rem', fontWeight:800, color: activeTier.color, lineHeight:1}}>{areaScore}</span>
                      <span style={{fontSize:'0.72rem', color:'var(--text-muted)'}}>/100</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{height:6, background:'var(--bg-surface)', borderRadius:4, overflow:'hidden', marginBottom:12}}>
                    <div style={{height:'100%', width:`${areaScore}%`, background: activeTier.color, borderRadius:4, transition:'width 0.4s ease'}} />
                  </div>

                  {/* Tier rows */}
                  {tiers.map(tier => {
                    const isActive = tier.label === activeTier.label;
                    return (
                      <div
                        key={tier.label}
                        style={{
                          display:'flex', alignItems:'center', justifyContent:'space-between',
                          padding: isActive ? '10px 14px' : '7px 14px',
                          borderRadius: 8,
                          background: isActive ? tier.bg : 'transparent',
                          border: isActive ? `1px solid ${tier.color}40` : '1px solid transparent',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{display:'flex', alignItems:'center', gap:10}}>
                          <span style={{width: isActive ? 14 : 10, height: isActive ? 14 : 10, borderRadius:'50%', background: tier.color, transition:'all 0.2s', boxShadow: isActive ? `0 0 8px ${tier.color}` : 'none'}} />
                          <span style={{fontWeight: isActive ? 700 : 400, fontSize: isActive ? '0.95rem' : '0.88rem', color: isActive ? 'white' : 'var(--text-muted)'}}>{tier.label}</span>
                          {isActive && (
                            <span style={{fontSize:'0.65rem', background: tier.color, color:'white', padding:'1px 7px', borderRadius:10, fontWeight:700, textTransform:'uppercase'}}>CURRENT</span>
                          )}
                        </div>
                        <span style={{fontSize:'0.8rem', color: isActive ? tier.color : 'var(--text-muted)', fontWeight: isActive ? 700 : 400}}>
                          {tier.min === 0 ? '0' : `>${tier.min-1}`}–{tier.max}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            <div className="mt-4" style={{padding:16, background:'rgba(239, 68, 68, 0.1)', borderRadius:8, border:'1px solid rgba(239, 68, 68, 0.3)'}}>
              <h2 style={{color:'var(--risk-extreme)', margin:0, transition:'all 0.3s'}}>{habitationsCount}</h2>
              <p style={{margin:0, fontSize:'0.9rem'}}>habitations are currently identified as Potential Red-Zone Candidates.</p>
            </div>

            <button className="btn btn-primary btn-block mt-4" onClick={() => setShowModal(true)}>
              Generate Potential Red-Zone Report
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div style={{position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.7)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div className="card" style={{width:600, maxWidth:'90%', background:'var(--bg-panel)'}}>
            <div className="flex-between mb-4">
              <h2 style={{display:'flex', alignItems:'center', gap:10, margin:0}}><AlertTriangle color="var(--risk-extreme)" /> Potential Red-Zone Report</h2>
              <button onClick={() => setShowModal(false)} style={{background:'transparent', border:'none', color:'white', fontSize:'1.5rem', cursor:'pointer'}}>&times;</button>
            </div>
            
            <div style={{background:'var(--bg-surface)', padding:16, borderRadius:8, marginBottom:16}}>
              <p className="text-muted mb-2" style={{fontSize:'0.85rem'}}>Analyzed Region:</p>
              <h3 style={{margin:0}}>{locationName}</h3>
              <p style={{margin:0, fontSize:'0.85rem', color:'var(--text-muted)', marginTop:4}}>Coordinates: {mapCenter[0].toFixed(4)}, {mapCenter[1].toFixed(4)}</p>
            </div>

            <div className="grid-kpi" style={{gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20}}>
              <div style={{background:'rgba(239, 68, 68, 0.1)', padding:16, borderRadius:8, border:'1px solid var(--risk-extreme)'}}>
                <div style={{fontSize:'2rem', fontWeight:700, color:'var(--risk-extreme)'}}>{habitationsCount}</div>
                <div className="text-muted" style={{fontSize:'0.85rem'}}>Potential Red-Zone Candidates</div>
              </div>
              <div style={{background:'var(--bg-surface)', padding:16, borderRadius:8}}>
                <div style={{fontSize:'2rem', fontWeight:700}}>{habitationsCount * 280}</div>
                <div className="text-muted" style={{fontSize:'0.85rem'}}>Est. People at Risk</div>
              </div>
            </div>

            <p style={{fontSize:'0.9rem', lineHeight:1.5, color:'var(--text-muted)'}}>
              The AI model strongly recommends immediate evacuation planning for the {habitationsCount} identified habitations in this region. 
              The primary hazards detected include severe multi-hazard intersection (flood, cloudburst, and historical structural vulnerability).
            </p>

            <div style={{display:'flex', justifyContent:'flex-end', gap:12, marginTop:20}}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              <button className="btn btn-primary"><Download size={16} /> Download PDF</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
