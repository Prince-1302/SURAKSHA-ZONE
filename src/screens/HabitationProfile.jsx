import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Users, Home, Maximize, Mountain, AlertTriangle, TrendingUp } from 'lucide-react';
import { getHabitationById, calculateFinalRisk, getSiteById } from '../data/data.js';

// ---------------------------------------------------------------------------
// Helper: generate data-driven risk explanation items from habitation values
// ---------------------------------------------------------------------------
function generateRiskIndicators(hab, risk) {
  const items = [];

  // Dominant hazard indicator
  items.push({
    severity: risk.breakdown.hazard >= 70 ? 'extreme' : 'high',
    text: `${risk.dominantHazard} is the dominant hazard with a score of ${Math.max(
      hab.floodRisk, hab.landslideRisk, hab.cloudburstRisk, hab.coastalErosionRisk, hab.rainfallRisk
    )}/100, placing the habitation in a high-intensity hazard zone.`,
  });

  // Elevation indicator
  if (hab.elevationM < 30) {
    items.push({
      severity: 'extreme',
      text: `Critically low elevation (${hab.elevationM} m above sea level) leaves the habitation highly susceptible to flash flooding and waterlogging.`,
    });
  }

  // Vulnerability indicator
  if (hab.vulnerabilityScore >= 70) {
    items.push({
      severity: 'extreme',
      text: `High population vulnerability index (${hab.vulnerabilityScore}/100) — significant proportion of children, elderly, and persons with disabilities.`,
    });
  } else if (hab.vulnerabilityScore >= 50) {
    items.push({
      severity: 'high',
      text: `Moderate-to-high population vulnerability (${hab.vulnerabilityScore}/100) requires priority attention during evacuation planning.`,
    });
  }

  // Disaster history indicator
  if (hab.historicalEvents.length >= 2) {
    items.push({
      severity: hab.disasterHistoryScore >= 75 ? 'extreme' : 'high',
      text: `${hab.historicalEvents.length} recorded disaster events in recent years (disaster history score: ${hab.disasterHistoryScore}/100), indicating a pattern of repeated exposure.`,
    });
  } else if (hab.historicalEvents.length === 1) {
    items.push({
      severity: 'high',
      text: `${hab.historicalEvents.length} recorded disaster event on record (${hab.historicalEvents[0].year}: ${hab.historicalEvents[0].type}, severity: ${hab.historicalEvents[0].severity}).`,
    });
  }

  // Evacuation difficulty indicator
  if (hab.evacuationDifficulty >= 70) {
    items.push({
      severity: 'extreme',
      text: `Evacuation difficulty score is ${hab.evacuationDifficulty}/100 — road access constraints and terrain make emergency evacuation significantly challenging.`,
    });
  } else if (hab.evacuationDifficulty >= 50) {
    items.push({
      severity: 'high',
      text: `Moderate evacuation difficulty (${hab.evacuationDifficulty}/100) — some road access limitations may delay emergency response.`,
    });
  }

  // Exposure indicator
  if (hab.exposureScore >= 70) {
    items.push({
      severity: 'high',
      text: `High infrastructure and population exposure score (${hab.exposureScore}/100) — key services and assets are within the hazard impact zone.`,
    });
  }

  // Cap at 5 items
  return items.slice(0, 5);
}

// ---------------------------------------------------------------------------
// Helper: tier → CSS class name
// ---------------------------------------------------------------------------
function tierToClass(tier) {
  switch (tier?.toLowerCase()) {
    case 'extreme': return 'extreme';
    case 'high': return 'high';
    case 'moderate': return 'moderate';
    default: return 'low';
  }
}

// ---------------------------------------------------------------------------
// Regional Risk Report — hardcoded, location-specific, prototype/illustrative
// ---------------------------------------------------------------------------
const REGIONAL_REPORTS = {
  HAB001: {
    summary: 'Boragaon is situated on the low-lying southern floodplain of the Brahmaputra, making it one of the most flood-exposed habitations in the Kamrup Metropolitan pilot region. Recurring monsoon inundations have significantly degraded the built environment and eroded community resilience over successive seasons.',
    dominantHazard: 'Flood (Brahmaputra floodplain inundation)',
    keyFactors: [
      'Located within the illustrative F1 Central Brahmaputra South-Bank Floodplain zone',
      'Critically low elevation (~8 m) offers minimal natural protection against surge events',
      'Dense household clustering increases cascading infrastructure failure risk',
      'Access road frequently submerged, severely limiting emergency ingress/egress',
    ],
    populationExposure: 'An estimated 1,240 residents across 286 households are exposed to high-severity flood events. Children and elderly persons constitute a significant proportion of the at-risk population, compounding emergency response complexity.',
    disasterHistory: 'Multiple severe flood events recorded in recent years, including major inundations causing displacement of several hundred residents. The settlement has not been formally elevated or structurally protected, leaving the population in a cycle of recurring loss.',
    evacuationConcern: 'Evacuation routes converge on a single arterial road that becomes impassable within 6–12 hours of a significant rainfall event. The absence of an elevated refuge point within 2 km compounds the life-safety risk for mobility-impaired residents.',
    recommendedAction: 'Immediate assessment for permanent relocation to a safe elevated site. Interim flood-resistant emergency shelters and early-warning dissemination are recommended as transitional measures pending relocation. Authority validation required before any formal Red Zone declaration.',
  },
  HAB002: {
    summary: 'Sonapur occupies a transitional zone between the Brahmaputra south bank and the eastern urban fringe of Kamrup, placing it within the documented extent of the F1 floodplain. The settlement experiences near-annual inundation during peak monsoon discharge, and the frequency and depth of flooding have increased in recent assessment cycles.',
    dominantHazard: 'Flood (eastern Brahmaputra floodplain and tributary overflow)',
    keyFactors: [
      'Located within the illustrative F1 Central Brahmaputra South-Bank Floodplain zone',
      'Proximity to eastern tributary channels increases compound flood risk',
      'High population density relative to available safe land area',
      'Existing embankment infrastructure shows signs of deterioration',
    ],
    populationExposure: 'Approximately 980 residents across 224 households. The settlement includes a notable proportion of elderly residents and economically vulnerable households with limited self-evacuation capacity.',
    disasterHistory: 'Repeated flood inundations recorded over the past decade, with at least two events classified as high-severity. Livelihood losses from agricultural land submersion have been reported in multiple seasons.',
    evacuationConcern: 'Primary evacuation corridor passes through low-lying terrain susceptible to waterlogging. Secondary routes add significant travel time, particularly challenging for households without motorised transport.',
    recommendedAction: 'Priority relocation assessment recommended. Short-term: reinforcement of existing embankments and installation of flood gauges. Medium-term: structured resettlement to an identified safe site with community consultation. Authority validation required before formal designation.',
  },
  HAB003: {
    summary: 'Chandrapur is located at the southern margin of the Brahmaputra inundation corridor, where the terrain transitions from the floodplain to slightly elevated agricultural land. While elevation provides marginal protection compared to settlements closer to the river, the area remains susceptible to prolonged waterlogging and localised flash flooding from upstream catchment runoff.',
    dominantHazard: 'Flood (southern floodplain margin and cloudburst runoff)',
    keyFactors: [
      'Falls within the southern extent of the illustrative F1 Floodplain zone',
      'Cloudburst runoff from adjacent elevated terrain channels into the settlement',
      'Poor stormwater drainage infrastructure exacerbates inundation duration',
      'Agricultural land surrounding the settlement is regularly lost to seasonal floods',
    ],
    populationExposure: 'Approximately 760 residents across 175 households. A moderate vulnerability index reflects a mix of working-age adults and elderly dependants. Disruption to livelihoods during flood seasons has been observed.',
    disasterHistory: 'Historical records indicate multiple instances of flash flooding and extended waterlogging. Structural damage to low-quality housing units has been reported following severe rainfall events.',
    evacuationConcern: 'Cloudburst events may cause rapid inundation with limited warning time. The evacuation road to higher ground is a single unpaved track that degrades under heavy rainfall, increasing evacuation difficulty.',
    recommendedAction: 'Medium-term relocation assessment recommended. Immediate actions include improved stormwater drainage, early-warning systems, and community preparedness training. Long-term: planned resettlement to a site with robust drainage infrastructure and safe elevation.',
  },
  HAB004: {
    summary: 'Hajo is positioned at a comparatively higher elevation in the northwest of the pilot region, offering greater natural protection from Brahmaputra floodplain inundation than lower-lying settlements. However, the habitation faces a distinct risk profile characterised by landslide susceptibility from adjacent hill terrain and high population exposure from its large and dense settlement pattern.',
    dominantHazard: 'Landslide (hill slope instability adjacent to settlement)',
    keyFactors: [
      'Adjacent hill slopes are susceptible to shallow landslides during intense rainfall events',
      'Large population (1,420 residents) creates high aggregate exposure',
      'Infrastructure serving the settlement is vulnerable to slope failures on access roads',
      'Not within the illustrative flood floodplain zones — flood risk is comparatively low',
    ],
    populationExposure: 'The largest habitation in the pilot dataset with approximately 1,420 residents across 328 households. High aggregate exposure despite a lower per-household risk index. Evacuation logistics for this population size require coordinated institutional response.',
    disasterHistory: 'Historical records include landslide-related incidents during peak monsoon seasons. Road disruption from slope instability has periodically isolated the community from emergency services.',
    evacuationConcern: 'Landslide events can block the primary access road, cutting off the settlement from emergency response. Alternative evacuation routes are limited by terrain. Pre-positioned resources and community drills are critical.',
    recommendedAction: 'Short-to-medium term monitoring and slope stabilisation works recommended. Relocation of households in direct proximity to steep slopes should be prioritised. Landslide early-warning systems and regular slope surveys are advised. Authority validation required before formal Red Zone declaration.',
  },
  HAB005: {
    summary: 'Boko lies in the central corridor of the pilot region at moderate elevation. While not falling within the primary Brahmaputra floodplain zones, the settlement experiences localised flooding from seasonal tributary overflow and is exposed to moderate cloudburst risk from adjacent elevated terrain. The overall risk profile is classified as high but not extreme.',
    dominantHazard: 'Rainfall & Cloudburst (tributary overflow and surface runoff)',
    keyFactors: [
      'Tributary channel adjacent to the settlement is prone to seasonal overflow',
      'Moderate cloudburst risk from elevated terrain to the north',
      'Infrastructure quality is variable, with some housing units in poor condition',
      'Not within primary illustrative floodplain zones',
    ],
    populationExposure: 'Approximately 860 residents across 197 households. Population vulnerability index is moderate, reflecting a community with reasonable self-evacuation capacity but dependent on seasonal agricultural livelihoods susceptible to flood disruption.',
    disasterHistory: 'Documented instances of localised flooding from tributary overflow. One significant cloudburst event in recent years caused structural damage to several dwellings.',
    evacuationConcern: 'Evacuation difficulty is moderate. Main road access is generally reliable but may be compromised by simultaneous flooding of the adjacent tributary. Community familiarity with evacuation routes should be reinforced through regular drills.',
    recommendedAction: 'Short-term flood mitigation measures (drainage improvement, tributary channel maintenance) recommended. Targeted relocation of the most vulnerable households nearest the channel. Medium-term assessment of full relocation feasibility based on updated hazard surveys.',
  },
  HAB006: {
    summary: 'Palashbari is located in the western sector of the pilot region, within the illustrative F2 Western Tributary Floodplain zone associated with the Kulsi and Bharalu tributaries of the Brahmaputra. Despite having a comparatively lower base risk index than eastern settlements, the spatial flood exposure confirmation adds meaningful additional risk evidence that warrants monitoring and preparedness investment.',
    dominantHazard: 'Flood (western tributary — Kulsi/Bharalu floodplain)',
    keyFactors: [
      'Located within the illustrative F2 Western Tributary Floodplain zone',
      'Periodic inundation from western tributary discharge during peak monsoon',
      'Lower vulnerability index relative to eastern habitations',
      'Significant distance from emergency services adds response time',
    ],
    populationExposure: 'Approximately 540 residents across 124 households. Lower population density compared to eastern settlements reduces aggregate exposure. However, distance from district emergency services means response times during events may be significantly delayed.',
    disasterHistory: 'Moderate historical disaster record. Seasonal tributary overflow events have been documented, though events have generally been of lower severity compared to Brahmaputra floodplain habitations.',
    evacuationConcern: 'Primary evacuation concerns relate to the distance from district-level emergency services and the potential for road flooding during simultaneous tributary overflow. Community self-reliance during early-stage emergencies is critical.',
    recommendedAction: 'Medium-term monitoring designation recommended. Priority actions include community early-warning capability, drainage improvements, and a formal feasibility study for partial or full relocation of the most exposed households. Authority validation required before formal designation.',
  },
  HAB007: {
    summary: 'Nalbari is situated in the northern part of the pilot region at higher elevation, beyond the primary Brahmaputra inundation zones. The habitation faces moderate risk primarily from localised seasonal flooding and infrastructure exposure. Its higher elevation and lower hazard exposure give it a comparatively lower overall risk classification.',
    dominantHazard: 'Rainfall & Surface Runoff (localised seasonal flooding)',
    keyFactors: [
      'Not within any primary illustrative flood hazard zones',
      'Located at higher elevation, reducing direct floodplain inundation risk',
      'Moderate infrastructure exposure due to proximity to regional transport routes',
      'Seasonal rainfall-induced runoff poses localised inundation risk',
    ],
    populationExposure: 'Approximately 1,080 residents. Moderate vulnerability index. Proximity to regional transport routes provides better emergency access compared to more remote settlements.',
    disasterHistory: 'Localised flood events recorded. Severity has generally been moderate compared to Brahmaputra floodplain settlements.',
    evacuationConcern: 'Evacuation routes are better maintained than in more remote habitations. Coordination with district authorities for timely early warning is the primary operational requirement.',
    recommendedAction: 'Monitor designation. Seasonal drainage maintenance and community preparedness investment recommended. Formal relocation assessment is lower priority compared to floodplain settlements, but should be reviewed if hazard surveys indicate worsening conditions.',
  },
  HAB008: {
    summary: 'Rangia is located in the northeastern corridor of the pilot region. It falls outside the primary illustrative flood hazard zones, but faces moderate risk from cloudburst events and localised runoff due to its position between elevated terrain and lower agricultural land.',
    dominantHazard: 'Cloudburst & Surface Runoff',
    keyFactors: [
      'Not within primary illustrative flood zones',
      'Cloudburst risk elevated due to proximity to higher terrain',
      'Localised drainage issues exacerbate surface runoff during intense rainfall',
      'Moderate evacuation difficulty due to partially unpaved road network',
    ],
    populationExposure: 'Approximately 920 residents. Moderate vulnerability profile. Livelihoods are primarily agricultural, creating seasonal disruption risk during prolonged wet periods.',
    disasterHistory: 'Cloudburst-induced localised flooding events recorded. No extreme-severity events in the recent dataset, but pattern of increasing rainfall intensity is a concern.',
    evacuationConcern: 'Road conditions deteriorate during intense rainfall, reducing evacuation window. Early warning dissemination and pre-positioned community resources are recommended.',
    recommendedAction: 'Short-term drainage improvement and cloudburst early-warning installation recommended. Seasonal monitoring designation. Formal relocation assessment to be considered if hazard frequency increases.',
  },
  HAB009: {
    summary: 'Jalukbari is located on the western urban fringe of Guwahati within the southern corridor of the Brahmaputra influence zone. It falls within the illustrative F1 floodplain area, facing compounded urban flood risk from both river inundation and inadequate urban drainage during peak monsoon. The urban setting adds complexity to evacuation and emergency response logistics.',
    dominantHazard: 'Flood (urban fringe — Brahmaputra influence zone)',
    keyFactors: [
      'Within the illustrative F1 Central Brahmaputra South-Bank Floodplain zone',
      'Urban drainage infrastructure struggles to handle peak monsoon discharge',
      'High density of built environment limits natural flood buffering',
      'Multiple vulnerable population clusters in low-lying residential areas',
    ],
    populationExposure: 'Approximately 1,650 residents. Urban density creates complex evacuation logistics. A notable proportion of residents are in low-quality housing vulnerable to inundation damage.',
    disasterHistory: 'Urban flood events recorded multiple times, often coinciding with peak Brahmaputra discharge periods. Waterlogging of key access roads has been observed during severe rainfall events.',
    evacuationConcern: 'Urban context creates multiple evacuation bottlenecks. Traffic congestion during emergency events adds significant delays. Multi-agency coordination is essential for effective evacuation.',
    recommendedAction: 'Short-term: Urban flood risk mapping and drainage infrastructure audit. Medium-term: structured community relocation plan for the most flood-exposed residential clusters. Authority validation and multi-agency coordination required.',
  },
  HAB010: {
    summary: 'Goreswar is the northernmost habitation in the pilot dataset, located beyond the primary Brahmaputra inundation influence. It faces a lower overall risk profile, primarily characterised by moderate rainfall and localised runoff risk from adjacent terrain. Its remote location, however, presents challenges for emergency response and access.',
    dominantHazard: 'Rainfall & Localised Runoff',
    keyFactors: [
      'Not within any primary illustrative flood hazard zones',
      'Remote location increases emergency response time',
      'Localised runoff from nearby terrain poses seasonal risk',
      'Road network is partially unpaved and weather-dependent',
    ],
    populationExposure: 'Approximately 680 residents. Lower vulnerability index. Remote location means that even moderate events can have outsized impact due to delayed emergency response.',
    disasterHistory: 'Minimal recorded disaster events. Localised road damage from runoff has been documented in wet seasons.',
    evacuationConcern: 'Remote location is the primary evacuation concern. Distance from district emergency services means self-reliance in early-stage events is critical. Community preparedness investment is a high-value intervention.',
    recommendedAction: 'Monitor designation. Investment in community early-warning capability and seasonal road maintenance are the highest-priority actions. Formal relocation assessment is not indicated at present risk levels but should be reviewed periodically.',
  },
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function HabitationProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Load habitation from centralized data by URL param ID
  const hab = getHabitationById(id);

  // --- Not-found state ---
  if (!hab) {
    return (
      <div style={{ padding: 60, textAlign: 'center' }}>
        <AlertTriangle size={48} color="var(--risk-high)" style={{ marginBottom: 16 }} />
        <h2>Habitation Not Found</h2>
        <p className="text-muted" style={{ marginBottom: 24 }}>
          No habitation record exists for ID: <code>{id}</code>
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Compute final risk score with spatial evidence
  const risk = calculateFinalRisk(hab);
  const recommendedSite = getSiteById(hab.recommendedSiteId);

  // Generate data-driven explanation items
  const riskIndicators = generateRiskIndicators(hab, risk);

  const hazardBars = [
    { name: 'Flood Risk', score: hab.floodRisk },
    { name: 'Cloudburst Risk', score: hab.cloudburstRisk },
    { name: 'Landslide Risk', score: hab.landslideRisk },
    { name: 'Coastal Erosion Risk', score: hab.coastalErosionRisk },
    { name: 'Rainfall Risk', score: hab.rainfallRisk },
    { name: 'Historical Disaster Exposure', score: hab.disasterHistoryScore },
    { name: 'Infrastructure Exposure', score: hab.exposureScore },
    { name: 'Evacuation Difficulty', score: hab.evacuationDifficulty },
  ];

  return (
    <>
      <div className="flex-between mb-4">
        <div>
          <button
            className="btn btn-secondary mb-2"
            onClick={() => navigate(-1)}
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 style={{ margin: 0 }}>{hab.name}</h1>
            <div className={`badge ${tierToClass(risk.tier)}`}>
              🔴 {risk.priority.toUpperCase()} RELOCATION
            </div>
          </div>
          <p className="text-muted" style={{ marginTop: 4, fontSize: '0.9rem' }}>
            {hab.district} · Elevation: {hab.elevationM} m · Area: {hab.areaSqKm} km²
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/relocation-sites')}
        >
          Find Safe Relocation Sites <ArrowRight size={16} />
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid-kpi" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="kpi-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Users size={32} color="var(--govt-blue)" />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Population</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{hab.population.toLocaleString()}</div>
          </div>
        </div>
        <div className="kpi-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Home size={32} color="var(--govt-blue)" />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Households</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{hab.households}</div>
          </div>
        </div>
        <div className="kpi-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Maximize size={32} color="var(--govt-blue)" />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Area</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{hab.areaSqKm} km²</div>
          </div>
        </div>
        <div className="kpi-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Mountain size={32} color="var(--govt-blue)" />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Elevation</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{hab.elevationM} m</div>
          </div>
        </div>
      </div>

      <div className="layout-split">
        {/* Left Column */}
        <div className="flex-column gap-4">

          {/* Risk Score */}
          <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div className="score-circle">{risk.score}</div>
            <h2 className="mt-4" style={{ color: `var(--risk-${tierToClass(risk.tier)})` }}>
              {risk.tier} Risk
            </h2>
            <p className="text-muted" style={{ maxWidth: 400, margin: '0 auto', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Base Mathematical Risk: <strong>{risk.baseScore}</strong><br/>
              Computed using: Hazard ({risk.breakdown.hazard}) · Exposure ({risk.breakdown.exposure}) · Vulnerability ({risk.breakdown.vulnerability}) · History ({risk.breakdown.disasterHistory})
            </p>
            
            {/* GIS Evidence Box */}
            <div style={{ marginTop: 24, padding: '16px', background: risk.spatialFloodExposure ? 'rgba(29,78,216,0.1)' : 'var(--bg-surface)', border: risk.spatialFloodExposure ? '1px solid #3b82f6' : '1px solid var(--border-color)', borderRadius: 8, display: 'inline-block', fontSize: '0.85rem', textAlign: 'left', minWidth: 280 }}>
              <div className="flex-between mb-2">
                <span className="text-muted">Base Risk Score</span>
                <strong>{risk.baseScore}</strong>
              </div>
              <div className="flex-between mb-2 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {risk.spatialFloodExposure ? '🌊 GIS Flood Exposure' : 'GIS Flood Exposure'}
                </span>
                <span style={{ color: risk.spatialFloodExposure ? '#60a5fa' : 'var(--text-muted)' }}>+{risk.spatialAdjustment}</span>
              </div>
              <div className="flex-between">
                <strong>Final Risk Score</strong>
                <strong style={{ color: `var(--risk-${tierToClass(risk.tier)})` }}>{risk.score}</strong>
              </div>
              
              {risk.spatialFloodExposure ? (
                <div style={{ marginTop: 12, fontSize: '0.75rem', color: '#93c5fd', lineHeight: 1.4 }}>
                  Spatial analysis confirms habitation inside <strong>{risk.floodZoneName}</strong>.
                </div>
              ) : (
                <div style={{ marginTop: 12, fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Not detected inside illustrative flood hazard polygons.
                </div>
              )}
            </div>

            <div style={{ marginTop: 20, fontSize: '0.85rem' }}>
              Dominant hazard: <strong style={{ color: 'var(--risk-extreme)' }}>{risk.dominantHazard}</strong>
            </div>
          </div>

          {/* Priority Engine Score */}
          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={20} color="var(--govt-blue)" /> Relocation Priority Engine
            </h3>
            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ padding: 16, background: 'var(--bg-surface)', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 4 }}>Priority Score</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: `var(--risk-${tierToClass(hab.riskTier)})` }}>{hab.priorityEngine.score}</div>
              </div>
              <div style={{ padding: 16, background: 'var(--bg-surface)', borderRadius: 8, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 4 }}>Category</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: `var(--risk-${tierToClass(hab.riskTier)})` }}>{hab.priorityCategory.toUpperCase()}</div>
              </div>
            </div>
            
            <p style={{ marginTop: 16, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-muted)' }}>
              <strong>AI Explanation:</strong> {hab.priorityEngine.explanation}
            </p>
            
            <div style={{ marginTop: 16, fontSize: '0.75rem', padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 6 }}>
              <strong>Engine Components:</strong> Final Risk ({hab.priorityEngine.components.finalRisk}) · Exposure ({hab.priorityEngine.components.exposure}) · Vulnerability ({hab.priorityEngine.components.vulnerability}) · History ({hab.priorityEngine.components.disasterHistory}) · Evacuation Difficulty ({hab.priorityEngine.components.evacuationDifficulty})
            </div>
          </div>

          {/* Hazard Bars */}
          <div className="card">
            <h3>Hazard & Risk Breakdown</h3>
            <div className="flex-column gap-4 mt-4">
              {hazardBars.map(h => {
                const cls = h.score >= 75 ? 'extreme' : h.score >= 50 ? 'high' : h.score >= 25 ? 'moderate' : 'low';
                return (
                  <div key={h.name}>
                    <div className="flex-between mb-2">
                      <span style={{ fontWeight: 500 }}>{h.name}</span>
                      <span style={{ fontWeight: 600 }}>{h.score}</span>
                    </div>
                    <div className="progress-bar-container" style={{ height: 10 }}>
                      <div className={`progress-bar-fill ${cls}`} style={{ width: `${h.score}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Historical Events */}
          {hab.historicalEvents.length > 0 && (
            <div className="card">
              <h3>Historical Disaster Events</h3>
              <div className="flex-column gap-3 mt-4">
                {hab.historicalEvents.map((evt, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 14px', background: 'var(--bg-surface)', borderRadius: 6,
                      borderLeft: '4px solid var(--risk-high)'
                    }}
                  >
                    <div>
                      <strong>{evt.year}</strong> — {evt.type}
                      <span className="text-muted" style={{ marginLeft: 8, fontSize: '0.85rem' }}>({evt.severity})</span>
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.85rem' }}>{evt.affected.toLocaleString()} affected</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="right-panel">

          {/* ============================================================ */}
          {/* Regional Risk Report — Location-specific, prototype/illustrative */}
          {/* ============================================================ */}
          {(() => {
            const report = REGIONAL_REPORTS[hab.id];
            if (!report) return null;
            const pillColor = hab.riskTier === 'Extreme' ? 'var(--risk-extreme)'
                            : hab.riskTier === 'High' ? 'var(--risk-high)'
                            : hab.riskTier === 'Moderate' ? 'var(--risk-moderate)'
                            : 'var(--risk-low)';
            return (
              <div className="card" style={{ borderTop: `3px solid ${pillColor}` }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <h3 style={{ margin: 0 }}>Regional Risk Report</h3>
                  <span style={{ fontSize: '0.68rem', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', border: '1px solid var(--border-color)', padding: '2px 8px', borderRadius: 20, whiteSpace: 'nowrap', marginLeft: 8 }}>
                    ILLUSTRATIVE · SIH26191
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--text-muted)', marginBottom: 18 }}>{report.summary}</p>

                {/* Dominant Hazard */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 4 }}>Dominant Hazard</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: pillColor, flexShrink: 0, display: 'inline-block' }} />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{report.dominantHazard}</span>
                  </div>
                </div>

                {/* Key Risk Factors */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6 }}>Key Risk Factors</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {report.keyFactors.map((f, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, fontSize: '0.83rem', lineHeight: 1.5 }}>
                        <span style={{ color: pillColor, flexShrink: 0, marginTop: 2, fontWeight: 700 }}>▸</span>
                        <span style={{ color: 'var(--text-secondary, #cbd5e1)' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Separator */}
                <div style={{ borderTop: '1px solid var(--border-color)', margin: '14px 0' }} />

                {/* Population & Exposure */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 5 }}>Population &amp; Exposure</div>
                  <p style={{ fontSize: '0.83rem', lineHeight: 1.55, margin: 0, color: 'var(--text-secondary, #cbd5e1)' }}>{report.populationExposure}</p>
                </div>

                {/* Disaster History */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 5 }}>Disaster History</div>
                  <p style={{ fontSize: '0.83rem', lineHeight: 1.55, margin: 0, color: 'var(--text-secondary, #cbd5e1)' }}>{report.disasterHistory}</p>
                </div>

                {/* Evacuation Concern */}
                <div style={{ marginBottom: 12, padding: '10px 12px', background: 'rgba(249,115,22,0.07)', borderRadius: 6, borderLeft: '3px solid var(--risk-high)' }}>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--risk-high)', marginBottom: 4 }}>Evacuation Concern</div>
                  <p style={{ fontSize: '0.83rem', lineHeight: 1.55, margin: 0 }}>{report.evacuationConcern}</p>
                </div>

                {/* Recommended Action */}
                <div style={{ padding: '10px 12px', background: 'rgba(16,185,129,0.07)', borderRadius: 6, borderLeft: '3px solid var(--risk-low)' }}>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--risk-low)', marginBottom: 4 }}>Recommended Action</div>
                  <p style={{ fontSize: '0.83rem', lineHeight: 1.55, margin: 0 }}>{report.recommendedAction}</p>
                </div>
              </div>
            );
          })()}

          {/* Key Risk Indicators */}
          <div className="card">
            <h3>
              <TrendingUp size={18} style={{ marginRight: 8, color: 'var(--risk-extreme)', verticalAlign: 'middle' }} />
              Key Risk Indicators
            </h3>
            <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: 16 }}>
              Potential red-zone indicators based on computed risk analysis.
              This is a decision-support assessment — not a legally declared Red Zone.
            </p>
            <div className="flex-column gap-2">
              {riskIndicators.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', gap: 12, padding: 12,
                    background: `rgba(${item.severity === 'extreme' ? '239,68,68' : '249,115,22'}, 0.1)`,
                    borderRadius: 6,
                    borderLeft: `4px solid var(--risk-${item.severity})`
                  }}
                >
                  <AlertTriangle size={18} color={`var(--risk-${item.severity})`} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: '0.88rem', lineHeight: 1.5 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vulnerability Profile */}
          <div className="card">
            <h3>Vulnerability Profile</h3>
            <div className="grid-kpi mt-4" style={{ gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 0 }}>
              <div style={{ background: 'var(--bg-surface)', padding: 16, borderRadius: 6, textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--risk-high)' }}>{hab.childrenCount}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Children</div>
              </div>
              <div style={{ background: 'var(--bg-surface)', padding: 16, borderRadius: 6, textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--risk-high)' }}>{hab.elderlyCount}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Elderly</div>
              </div>
              <div style={{ background: 'var(--bg-surface)', padding: 16, borderRadius: 6, textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--risk-extreme)' }}>{hab.pwdCount}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Persons with Disabilities</div>
              </div>
              <div style={{ background: 'var(--bg-surface)', padding: 16, borderRadius: 6, textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--risk-high)' }}>{hab.highRiskHouseholds}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>High-risk Households</div>
              </div>
            </div>
          </div>

          {/* Recommended Site */}
          {recommendedSite && (
            <div className="card" style={{ border: '1px solid var(--risk-low)' }}>
              <h3>Recommended Relocation Site</h3>
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{recommendedSite.shortName}</div>
                <div className="text-muted" style={{ fontSize: '0.85rem', marginBottom: 12 }}>{recommendedSite.district}</div>
                <div className="flex-between" style={{ fontSize: '0.9rem', marginBottom: 6 }}>
                  <span className="text-muted">Suitability Score:</span>
                  <strong style={{ color: 'var(--risk-low)' }}>{recommendedSite.suitabilityScore}/100</strong>
                </div>
                <div className="flex-between" style={{ fontSize: '0.9rem', marginBottom: 6 }}>
                  <span className="text-muted">Water Capacity:</span>
                  <span>{recommendedSite.waterCapacity.toLocaleString()}</span>
                </div>
                <div className="flex-between" style={{ fontSize: '0.9rem' }}>
                  <span className="text-muted">Road Access:</span>
                  <span>{recommendedSite.roadAccess}</span>
                </div>
              </div>
              <button
                className="btn btn-primary btn-block mt-4"
                onClick={() => navigate('/relocation-sites')}
              >
                View Full Site Assessment <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
