import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Tooltip, ZoomControl, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { getAllHabitations, getRelocationPriorities, DISTRICT_SUMMARY } from '../data/data.js';
import floodHazardData from '../data/hazards/floodHazard.js';
import { computeFloodExposures } from '../utils/spatialUtils.js';

export default function Dashboard() {
  const navigate = useNavigate();

  // Flood layer toggle (ON by default)
  const [showFloodLayer, setShowFloodLayer] = useState(true);

  // Centralized data: all habitations with computedRisk attached
  const allHabitations = getAllHabitations();
  // Top priority habitation is the highest-priority one
  const topPriority = getRelocationPriorities()[0];
  
  // Calculate critical habitations dynamically from Priority Engine
  const redZoneCount = allHabitations.filter(h => h.priorityCategory === 'Immediate').length;

  // Map markers: use real coordinates and computed risk tiers from data.js
  const mapHabitations = allHabitations;

  // Spatial flood exposure: run point-in-polygon check for every habitation
  // against the illustrative flood hazard GeoJSON. Computed once via useMemo.
  const floodExposures = useMemo(
    () => computeFloodExposures(allHabitations, floodHazardData),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Map tier from computed risk tier string to color variable
  const getColor = (tier) => {
    switch(tier?.toLowerCase()) {
      case 'extreme': return 'var(--risk-extreme)';
      case 'high': return 'var(--risk-high)';
      case 'moderate': return 'var(--risk-moderate)';
      default: return 'var(--risk-low)';
    }
  };

  return (
    <>
      <div className="mb-4">
        <h1>Disaster Risk Command Center</h1>
        <p className="text-muted">AI-powered monitoring and proactive relocation planning</p>
      </div>

      <div className="grid-kpi">
        <div className="kpi-card">
          <h4>Vulnerable Habitations</h4>
          <div className="value">{DISTRICT_SUMMARY.totalHabitations}</div>
          <div className="trend">Pilot region — {DISTRICT_SUMMARY.districtName}</div>
        </div>
        <div className="kpi-card">
          <h4>Immediate Priority Habitations</h4>
          <div className="value" style={{color: 'var(--risk-extreme)'}}>{redZoneCount}</div>
          <div className="trend">⚠ Requires Immediate Attention</div>
        </div>
        <div className="kpi-card">
          <h4>Immediate Relocations</h4>
          <div className="value">{DISTRICT_SUMMARY.immediateRelocations}</div>
          <div className="trend">Based on computed risk scores</div>
        </div>
        <div className="kpi-card">
          <h4>People at Risk</h4>
          <div className="value">{DISTRICT_SUMMARY.totalPeopleAtRisk.toLocaleString()}</div>
          <div className="trend">Extreme + High risk tiers</div>
        </div>
        <div className="kpi-card">
          <h4>Relocation Sites</h4>
          <div className="value" style={{color: 'var(--risk-low)'}}>{DISTRICT_SUMMARY.totalRelocationSites}</div>
          <div className="trend good">Assessed — Pilot region</div>
        </div>
      </div>

      <div className="layout-split">
        {/* Main Map */}
        <div className="card" style={{padding:0, display:'flex', flexDirection:'column'}}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <span style={{ width: '10px', height: '10px', background: 'var(--risk-extreme)', borderRadius: '50%', display: 'inline-block' }}></span>
            Live Multi-Hazard Risk Map
          </div>
          <div style={{
            position: 'relative',
            width: '100%',
            height: '500px',
            borderTop: '1px solid var(--border-color)',
            overflow: 'hidden',
            borderRadius: '0 0 8px 8px'
          }}>
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              background: 'white',
              padding: '8px 16px',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              zIndex: 1000,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              color: '#333',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}>
              <span style={{ width: '10px', height: '10px', background: 'var(--risk-extreme)', borderRadius: '50%', display: 'inline-block' }}></span>
              Live Risk Map
            </div>

            {/* Flood layer toggle button — top right */}
            <button
              onClick={() => setShowFloodLayer(v => !v)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '50px',
                background: showFloodLayer ? '#1d4ed8' : 'white',
                color: showFloodLayer ? 'white' : '#1d4ed8',
                border: '2px solid #1d4ed8',
                padding: '6px 14px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                zIndex: 1000,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                fontWeight: 600,
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              🌊 Flood Layer: {showFloodLayer ? 'ON' : 'OFF'}
            </button>

            <button 
              onClick={() => alert('Locate me functionality simulated in overview.')}
              style={{
                position: 'absolute',
                bottom: '24px',
                left: '16px',
                background: 'white',
                padding: '8px 16px',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                zIndex: 1000,
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                color: '#333',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#EF4444" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              Locate Me
            </button>

            <div style={{
              position: 'absolute',
              bottom: '4px',
              right: '4px',
              background: 'rgba(255,255,255,0.9)',
              padding: '2px 8px',
              borderRadius: '4px',
              zIndex: 1000,
              fontSize: '10px',
              color: '#0369a1'
            }}>
              © OSM / Nominatim
            </div>

            <MapContainer center={[26.15, 91.65]} zoom={11} style={{height: '100%', width: '100%', zIndex: 1}} zoomControl={false}>
              <TileLayer
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ZoomControl position="bottomright" />

              {/* Illustrative Flood Hazard GeoJSON Layer — toggleable */}
              {showFloodLayer && (
                <GeoJSON
                  key="flood-hazard-layer"
                  data={floodHazardData}
                  style={(feature) => ({
                    color: feature.properties.severity === 'Extreme' ? '#1d4ed8' : '#3b82f6',
                    fillColor: feature.properties.severity === 'Extreme' ? '#1d4ed8' : '#60a5fa',
                    weight: 2,
                    fillOpacity: 0.30,
                    dashArray: '6 4',
                  })}
                  onEachFeature={(feature, layer) => {
                    layer.bindTooltip(
                      `<strong>${feature.properties.name}</strong><br/>Severity: ${feature.properties.severity}<br/><em style="font-size:10px;color:#999">${feature.properties.dataSource}</em>`,
                      { sticky: true }
                    );
                  }}
                />
              )}

              {/* Habitation markers — sized by risk tier, tooltip shows flood exposure */}
              {mapHabitations.map(hab => {
                const flood = floodExposures[hab.id];
                return (
                  <CircleMarker
                    key={hab.id}
                    center={[hab.lat, hab.lng]}
                    radius={hab.computedRisk.tier === 'Extreme' ? 10 : 8}
                    fillColor={getColor(hab.computedRisk.tier)}
                    color={flood?.exposed ? '#1d4ed8' : getColor(hab.computedRisk.tier)}
                    weight={flood?.exposed ? 3 : 2}
                    fillOpacity={0.80}
                    eventHandlers={{ click: () => navigate(`/habitation/${hab.id}`) }}
                  >
                    <Tooltip>
                      <strong>{hab.name}</strong><br/>
                      Risk Score: {hab.computedRisk.score} ({hab.computedRisk.tier})<br/>
                      Flood Zone (spatial): {flood?.exposed ? `⚠️ ${flood.zoneName}` : '✅ Outside flood zone'}
                    </Tooltip>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>
        </div>

        {/* AI Intelligence Panel — driven by computed top-priority habitation */}
        <div className="right-panel">
          <div className="card">
            <h3 style={{display:'flex', alignItems:'center', gap:8, color:'var(--risk-extreme)'}}>
              <ArrowUpRight size={20} /> AI Risk Intelligence
            </h3>
            <div style={{marginTop:20}}>
              <p className="text-muted" style={{fontSize:'0.8rem'}}>Top Priority (computed)</p>
              <h2>{topPriority.name}</h2>
              
              <div className="flex-between mt-4">
                <div>
                  <div style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>Risk Score</div>
                  <div style={{fontSize:'2rem', fontWeight:700, color:'var(--risk-extreme)'}}>{topPriority.computedRisk.score} <span style={{fontSize:'1rem', color:'var(--text-muted)'}}>/ 100</span></div>
                </div>
                <div className="badge extreme">
                  {topPriority.priorityCategory.toUpperCase()}
                </div>
              </div>

              <div className="flex-between mt-4" style={{borderTop:'1px solid var(--border-color)', paddingTop:16}}>
                <div className="flex-column">
                  <span style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>Population</span>
                  <span style={{fontWeight:600}}>{topPriority.population.toLocaleString()}</span>
                </div>
                <div className="flex-column">
                  <span style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>Households</span>
                  <span style={{fontWeight:600}}>{topPriority.households}</span>
                </div>
              </div>

              <div className="mt-4">
                <p style={{fontSize:'0.85rem', fontWeight:600, marginBottom:10}}>Hazard Breakdown (computed):</p>
                <div className="flex-column gap-2">
                  {[
                    { label: 'Flood Risk', val: topPriority.floodRisk },
                    { label: 'Cloudburst Risk', val: topPriority.cloudburstRisk },
                    { label: 'Disaster History', val: topPriority.disasterHistoryScore },
                  ].map(h => (
                    <div key={h.label}>
                      <div className="flex-between" style={{fontSize:'0.8rem'}}>
                        <span>{h.label}</span>
                        <span style={{color:'var(--risk-extreme)'}}>{h.val}%</span>
                      </div>
                      <div className="progress-bar-container"><div className="progress-bar-fill extreme" style={{width:`${h.val}%`}}></div></div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="btn btn-primary btn-block mt-4" onClick={() => navigate(`/habitation/${topPriority.id}`)}>
                View Detailed Assessment <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
