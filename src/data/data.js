// =============================================================================
// SURAKSHA-ZONE — Prototype Demonstration Dataset
// SIH26191: Intelligent Identification of Hazard-Based Red Zones
// =============================================================================
// IMPORTANT: Prototype demonstration dataset for SIH26191 internal round.
// Values are illustrative and intended for internal-round demonstration only.
// Replace with validated government/official datasets (Census, IMD, Bhuvan,
// NDEM, NDMA) before any production or real-world deployment.
// All coordinates, scores, and population figures are representative samples
// based on the Assam/Brahmaputra floodplain pilot region.
// =============================================================================

import floodHazardData from './hazards/floodHazard.js';
import { getFloodExposure } from '../utils/spatialUtils.js';

// ---------------------------------------------------------------------------
// HABITATION DATASET
// Pilot region: Kamrup Metropolitan & surrounding districts, Assam
// ---------------------------------------------------------------------------
export const habitations = [
  {
    id: 'HAB001',
    name: 'Village Boragaon',
    district: 'Kamrup Metropolitan',
    lat: 26.115,
    lng: 91.685,
    population: 1240,
    households: 286,
    areaSqKm: 4.8,
    elevationM: 18,

    // Hazard sub-scores (0–100 each)
    floodRisk: 91,
    landslideRisk: 48,
    cloudburstRisk: 84,
    coastalErosionRisk: 10,
    rainfallRisk: 78,

    // Exposure, vulnerability and history sub-scores (0–100 each)
    exposureScore: 82,        // population density × infrastructure exposure
    vulnerabilityScore: 79,   // children + elderly + PwD ratio
    disasterHistoryScore: 88, // frequency and severity of past events
    evacuationDifficulty: 82, // road access, terrain, bridge condition

    // Vulnerability demographics (illustrative)
    childrenCount: 184,
    elderlyCount: 210,
    pwdCount: 32,
    highRiskHouseholds: 146,

    // Historical events (illustrative sample)
    historicalEvents: [
      { year: 2022, type: 'Flood', severity: 'Severe', affected: 980 },
      { year: 2020, type: 'Cloudburst', severity: 'Moderate', affected: 420 },
      { year: 2017, type: 'Flood', severity: 'Extreme', affected: 1100 },
    ],

    recommendedSiteId: 'SITE003',
    riskTier: null, // computed by calculateRiskScore()
    priority: null, // computed
  },

  {
    id: 'HAB002',
    name: 'Village Sonapur',
    district: 'Kamrup Metropolitan',
    lat: 26.110,
    lng: 91.800,
    population: 980,
    households: 224,
    areaSqKm: 3.6,
    elevationM: 22,

    floodRisk: 88,
    landslideRisk: 38,
    cloudburstRisk: 78,
    coastalErosionRisk: 8,
    rainfallRisk: 74,

    exposureScore: 76,
    vulnerabilityScore: 72,
    disasterHistoryScore: 84,
    evacuationDifficulty: 76,

    childrenCount: 148,
    elderlyCount: 162,
    pwdCount: 28,
    highRiskHouseholds: 118,

    historicalEvents: [
      { year: 2023, type: 'Flood', severity: 'Extreme', affected: 860 },
      { year: 2019, type: 'Flood', severity: 'Severe', affected: 740 },
    ],

    recommendedSiteId: 'SITE001',
    riskTier: null,
    priority: null,
  },

  {
    id: 'HAB003',
    name: 'Village Chandrapur',
    district: 'Kamrup',
    lat: 26.070,
    lng: 91.720,
    population: 760,
    households: 172,
    areaSqKm: 2.9,
    elevationM: 26,

    floodRisk: 79,
    landslideRisk: 55,
    cloudburstRisk: 70,
    coastalErosionRisk: 6,
    rainfallRisk: 68,

    exposureScore: 70,
    vulnerabilityScore: 65,
    disasterHistoryScore: 74,
    evacuationDifficulty: 68,

    childrenCount: 112,
    elderlyCount: 98,
    pwdCount: 18,
    highRiskHouseholds: 84,

    historicalEvents: [
      { year: 2022, type: 'Landslide', severity: 'Moderate', affected: 310 },
      { year: 2021, type: 'Flood', severity: 'Moderate', affected: 480 },
    ],

    recommendedSiteId: 'SITE003',
    riskTier: null,
    priority: null,
  },

  {
    id: 'HAB004',
    name: 'Hajo',
    district: 'Kamrup',
    lat: 26.250,
    lng: 91.530,
    population: 1420,
    households: 318,
    areaSqKm: 5.4,
    elevationM: 34,

    floodRisk: 68,
    landslideRisk: 44,
    cloudburstRisk: 60,
    coastalErosionRisk: 4,
    rainfallRisk: 58,

    exposureScore: 65,
    vulnerabilityScore: 60,
    disasterHistoryScore: 66,
    evacuationDifficulty: 58,

    childrenCount: 210,
    elderlyCount: 188,
    pwdCount: 42,
    highRiskHouseholds: 124,

    historicalEvents: [
      { year: 2021, type: 'Flood', severity: 'Moderate', affected: 580 },
    ],

    recommendedSiteId: 'SITE002',
    riskTier: null,
    priority: null,
  },

  {
    id: 'HAB005',
    name: 'Boko',
    district: 'Kamrup',
    lat: 26.000,
    lng: 91.000,
    population: 860,
    households: 196,
    areaSqKm: 3.2,
    elevationM: 42,

    floodRisk: 58,
    landslideRisk: 62,
    cloudburstRisk: 52,
    coastalErosionRisk: 2,
    rainfallRisk: 54,

    exposureScore: 58,
    vulnerabilityScore: 55,
    disasterHistoryScore: 58,
    evacuationDifficulty: 65,

    childrenCount: 128,
    elderlyCount: 110,
    pwdCount: 22,
    highRiskHouseholds: 76,

    historicalEvents: [
      { year: 2020, type: 'Landslide', severity: 'Moderate', affected: 290 },
    ],

    recommendedSiteId: 'SITE002',
    riskTier: null,
    priority: null,
  },

  {
    id: 'HAB006',
    name: 'Palashbari',
    district: 'Kamrup',
    lat: 26.120,
    lng: 91.500,
    population: 540,
    households: 124,
    areaSqKm: 2.1,
    elevationM: 48,

    floodRisk: 40,
    landslideRisk: 35,
    cloudburstRisk: 38,
    coastalErosionRisk: 2,
    rainfallRisk: 42,

    exposureScore: 44,
    vulnerabilityScore: 48,
    disasterHistoryScore: 44,
    evacuationDifficulty: 42,

    childrenCount: 82,
    elderlyCount: 74,
    pwdCount: 14,
    highRiskHouseholds: 48,

    historicalEvents: [
      { year: 2019, type: 'Flood', severity: 'Minor', affected: 120 },
    ],

    recommendedSiteId: 'SITE004',
    riskTier: null,
    priority: null,
  },

  {
    id: 'HAB007',
    name: 'Nagarbera',
    district: 'Kamrup',
    lat: 26.180,
    lng: 91.440,
    population: 680,
    households: 152,
    areaSqKm: 2.7,
    elevationM: 36,

    floodRisk: 74,
    landslideRisk: 30,
    cloudburstRisk: 64,
    coastalErosionRisk: 12,
    rainfallRisk: 66,

    exposureScore: 68,
    vulnerabilityScore: 62,
    disasterHistoryScore: 70,
    evacuationDifficulty: 60,

    childrenCount: 104,
    elderlyCount: 96,
    pwdCount: 20,
    highRiskHouseholds: 88,

    historicalEvents: [
      { year: 2023, type: 'Flood', severity: 'Severe', affected: 540 },
      { year: 2020, type: 'Coastal Erosion', severity: 'Moderate', affected: 240 },
    ],

    recommendedSiteId: 'SITE001',
    riskTier: null,
    priority: null,
  },

  {
    id: 'HAB008',
    name: 'Sualkuchi',
    district: 'Kamrup',
    lat: 26.310,
    lng: 91.580,
    population: 920,
    households: 208,
    areaSqKm: 3.8,
    elevationM: 30,

    floodRisk: 82,
    landslideRisk: 28,
    cloudburstRisk: 58,
    coastalErosionRisk: 18,
    rainfallRisk: 70,

    exposureScore: 74,
    vulnerabilityScore: 58,
    disasterHistoryScore: 76,
    evacuationDifficulty: 72,

    childrenCount: 138,
    elderlyCount: 124,
    pwdCount: 24,
    highRiskHouseholds: 102,

    historicalEvents: [
      { year: 2022, type: 'Flood', severity: 'Severe', affected: 720 },
      { year: 2018, type: 'Coastal Erosion', severity: 'Severe', affected: 380 },
    ],

    recommendedSiteId: 'SITE001',
    riskTier: null,
    priority: null,
  },

  {
    id: 'HAB009',
    name: 'Jalukbari',
    district: 'Kamrup Metropolitan',
    lat: 26.143,
    lng: 91.663,
    population: 1180,
    households: 268,
    areaSqKm: 4.2,
    elevationM: 20,

    floodRisk: 85,
    landslideRisk: 42,
    cloudburstRisk: 76,
    coastalErosionRisk: 8,
    rainfallRisk: 72,

    exposureScore: 78,
    vulnerabilityScore: 70,
    disasterHistoryScore: 80,
    evacuationDifficulty: 74,

    childrenCount: 174,
    elderlyCount: 198,
    pwdCount: 30,
    highRiskHouseholds: 134,

    historicalEvents: [
      { year: 2023, type: 'Flood', severity: 'Extreme', affected: 1020 },
      { year: 2021, type: 'Cloudburst', severity: 'Severe', affected: 640 },
    ],

    recommendedSiteId: 'SITE003',
    riskTier: null,
    priority: null,
  },

  {
    id: 'HAB010',
    name: 'Mirza',
    district: 'Kamrup',
    lat: 26.046,
    lng: 91.408,
    population: 480,
    households: 110,
    areaSqKm: 1.9,
    elevationM: 52,

    floodRisk: 30,
    landslideRisk: 28,
    cloudburstRisk: 32,
    coastalErosionRisk: 2,
    rainfallRisk: 36,

    exposureScore: 36,
    vulnerabilityScore: 40,
    disasterHistoryScore: 30,
    evacuationDifficulty: 34,

    childrenCount: 72,
    elderlyCount: 62,
    pwdCount: 10,
    highRiskHouseholds: 36,

    historicalEvents: [],

    recommendedSiteId: 'SITE004',
    riskTier: null,
    priority: null,
  },
];

// ---------------------------------------------------------------------------
// RELOCATION SITES DATASET
// Pilot region: Assam — candidate safe sites assessed for receiving displaced populations
// ---------------------------------------------------------------------------
export const relocationSites = [
  {
    id: 'SITE001',
    name: 'Relocation Site A — Palasbari Upland',
    shortName: 'Relocation Site A',
    district: 'Kamrup',
    lat: 26.14,
    lng: 91.80,
    elevationM: 62,

    // Capacity figures (maximum safe persons per category)
    landCapacity: 1400,
    housingCapacity: 1050,
    waterCapacity: 1200,
    healthcareCapacity: 1300,
    educationCapacity: 900,
    infrastructureCapacity: 1100,

    // Infrastructure metrics
    roadAccess: 'Good',           // Good / Moderate / Poor
    waterAvailability: 'Good',
    healthcareAccessKm: 3.2,
    educationAccessKm: 2.8,
    electricityAvailability: true,
    floodRiskAtSite: 'Low',
    landslideRiskAtSite: 'Low',

    suitabilityScore: 87,         // pre-assessed score (illustrative)
    currentOccupancy: 180,
  },

  {
    id: 'SITE002',
    name: 'Relocation Site B — Boko Highland',
    shortName: 'Relocation Site B',
    district: 'Kamrup',
    lat: 26.08,
    lng: 91.76,
    elevationM: 78,

    landCapacity: 1800,
    housingCapacity: 1420,
    waterCapacity: 1600,
    healthcareCapacity: 1500,
    educationCapacity: 1350,
    infrastructureCapacity: 1450,

    roadAccess: 'Moderate',
    waterAvailability: 'Good',
    healthcareAccessKm: 5.4,
    educationAccessKm: 4.1,
    electricityAvailability: true,
    floodRiskAtSite: 'Very Low',
    landslideRiskAtSite: 'Low',

    suitabilityScore: 81,
    currentOccupancy: 240,
  },

  {
    id: 'SITE003',
    name: 'Relocation Site C — Azara Elevated Zone',
    shortName: 'Relocation Site C',
    district: 'Kamrup Metropolitan',
    lat: 26.18,
    lng: 91.72,
    elevationM: 68,

    landCapacity: 1800,
    housingCapacity: 1500,
    waterCapacity: 1500,  // LIMITING FACTOR — water infrastructure constraint
    healthcareCapacity: 1600,
    educationCapacity: 1450,
    infrastructureCapacity: 1700,

    roadAccess: 'Excellent',
    waterAvailability: 'Good',
    healthcareAccessKm: 2.1,
    educationAccessKm: 1.8,
    electricityAvailability: true,
    floodRiskAtSite: 'Low',
    landslideRiskAtSite: 'Very Low',

    suitabilityScore: 92,
    currentOccupancy: 220,
  },

  {
    id: 'SITE004',
    name: 'Relocation Site D — Goroimari Plateau',
    shortName: 'Relocation Site D',
    district: 'Kamrup',
    lat: 26.20,
    lng: 91.60,
    elevationM: 88,

    landCapacity: 900,
    housingCapacity: 800,
    waterCapacity: 750,
    healthcareCapacity: 820,
    educationCapacity: 700,
    infrastructureCapacity: 800,

    roadAccess: 'Moderate',
    waterAvailability: 'Moderate',
    healthcareAccessKm: 8.6,
    educationAccessKm: 7.2,
    electricityAvailability: false,
    floodRiskAtSite: 'Very Low',
    landslideRiskAtSite: 'Moderate',

    suitabilityScore: 65,
    currentOccupancy: 80,
  },

  {
    id: 'SITE005',
    name: 'Relocation Site E — Sualkuchi Ridge',
    shortName: 'Relocation Site E',
    district: 'Kamrup',
    lat: 26.35,
    lng: 91.60,
    elevationM: 74,

    landCapacity: 1200,
    housingCapacity: 1050,
    waterCapacity: 1100,
    healthcareCapacity: 980,
    educationCapacity: 1020,
    infrastructureCapacity: 1080,

    roadAccess: 'Good',
    waterAvailability: 'Good',
    healthcareAccessKm: 4.4,
    educationAccessKm: 3.6,
    electricityAvailability: true,
    floodRiskAtSite: 'Low',
    landslideRiskAtSite: 'Low',

    suitabilityScore: 78,
    currentOccupancy: 140,
  },
];

// =============================================================================
// RISK CALCULATION ENGINE
// =============================================================================
// Formula (SIH26191 Weighted Multi-Hazard Risk Model — Illustrative):
//
//   Hazard Score    = max(flood, cloudburst, landslide, coastal, rainfall) × 0.6
//                   + average(flood, cloudburst, landslide, coastal, rainfall) × 0.4
//
//   Risk Score      = 0.35 × Hazard
//                   + 0.25 × Exposure
//                   + 0.20 × Vulnerability
//                   + 0.20 × DisasterHistory
//
//   Final Score is normalized to 0–100 (all inputs are already 0–100)
//   Dominant hazard is whichever raw hazard score is highest.
//
// This formula is transparent and demonstrably computed — not hardcoded.
// =============================================================================

/**
 * Calculate a composite risk score for a habitation from its component indicators.
 * @param {object} hab - A habitation object from the habitations array.
 * @returns {{ score: number, dominantHazard: string, tier: string, breakdown: object }}
 */
export function calculateRiskScore(hab) {
  // Step 1: Compute hazard score from all hazard types
  const hazardScores = {
    Flood: hab.floodRisk,
    Landslide: hab.landslideRisk,
    Cloudburst: hab.cloudburstRisk,
    'Coastal Erosion': hab.coastalErosionRisk,
    Rainfall: hab.rainfallRisk,
  };

  const hazardValues = Object.values(hazardScores);
  const maxHazard = Math.max(...hazardValues);
  const avgHazard = hazardValues.reduce((a, b) => a + b, 0) / hazardValues.length;

  // Weighted hazard: emphasize the peak hazard (dominant threat)
  const combinedHazard = maxHazard * 0.6 + avgHazard * 0.4;

  // Step 2: Composite risk using the weighted formula
  const rawScore =
    0.35 * combinedHazard +
    0.25 * hab.exposureScore +
    0.20 * hab.vulnerabilityScore +
    0.20 * hab.disasterHistoryScore;

  // Step 3: Normalize to 0–100 (inputs are 0–100, weights sum to 1, so output is already in range)
  const score = Math.min(100, Math.round(rawScore));

  // Step 4: Identify dominant hazard
  const dominantHazard = Object.entries(hazardScores).reduce(
    (max, [name, val]) => (val > max.val ? { name, val } : max),
    { name: '', val: -1 }
  ).name;

  // Step 5: Classify risk tier
  let tier;
  let priority;
  if (score >= 75) {
    tier = 'Extreme';
    priority = 'Immediate';
  } else if (score >= 50) {
    tier = 'High';
    priority = 'Short Term';
  } else if (score >= 25) {
    tier = 'Moderate';
    priority = 'Medium Term';
  } else {
    tier = 'Low';
    priority = 'Monitor';
  }

  return {
    score,
    dominantHazard,
    tier,
    priority,
    breakdown: {
      hazard: Math.round(combinedHazard),
      exposure: hab.exposureScore,
      vulnerability: hab.vulnerabilityScore,
      disasterHistory: hab.disasterHistoryScore,
    },
  };
}

// =============================================================================
// SPATIAL RISK FUSION ENGINE
// =============================================================================
// Prototype parameter for SIH26191 demonstration.
// Not an official government risk weighting.
// Requires expert calibration before operational deployment.
export const SPATIAL_FLOOD_ADJUSTMENT = 5;

/**
 * Connect the pure mathematical base risk to the real GeoJSON GIS layer.
 * Creates a derived final risk score with spatial evidence.
 */
export function calculateFinalRisk(hab) {
  const baseRisk = calculateRiskScore(hab);
  const floodExposure = getFloodExposure(hab.lat, hab.lng, floodHazardData);
  
  const spatialAdjustment = floodExposure.exposed ? SPATIAL_FLOOD_ADJUSTMENT : 0;
  
  // IMPORTANT: We do NOT double-count the base floodRisk. 
  // The base hazard already uses the habitation's internal floodRisk value.
  // This +5 adjustment represents independent GIS spatial confirmation that the 
  // habitation is physically inside the authoritative/illustrative hazard polygon.
  const finalScore = Math.min(100, baseRisk.score + spatialAdjustment);
  
  let tier, priority;
  if (finalScore >= 75) {
    tier = 'Extreme';
    priority = 'Immediate';
  } else if (finalScore >= 50) {
    tier = 'High';
    priority = 'Short Term';
  } else if (finalScore >= 25) {
    tier = 'Moderate';
    priority = 'Medium Term';
  } else {
    tier = 'Low';
    priority = 'Monitor';
  }

  let explanation = `Base risk: ${baseRisk.score}.`;
  if (floodExposure.exposed) {
    explanation += `\nSpatial flood analysis confirms the habitation lies inside ${floodExposure.zoneName} (${floodExposure.zoneId}).`;
    explanation += `\nPrototype spatial adjustment: +${spatialAdjustment}.`;
  } else {
    explanation += `\nGIS Flood Exposure: Not detected. Spatial Adjustment: +0.`;
  }
  explanation += `\nFinal risk: ${finalScore}.`;

  return {
    ...baseRisk, // Keeps base breakdown
    baseScore: baseRisk.score,
    spatialAdjustment,
    score: finalScore, // Replaces base score so UI gets final score seamlessly
    tier,
    priority,
    spatialFloodExposure: floodExposure.exposed,
    floodZoneId: floodExposure.zoneId,
    floodZoneName: floodExposure.zoneName,
    explanation,
  };
}

// =============================================================================
// RELOCATION PRIORITY ENGINE
// =============================================================================

// Prototype prioritization weights for SIH26191.
// Not an official government prioritization standard.
// Requires expert/domain validation before operational deployment.
export const PRIORITY_WEIGHTS = {
  risk: 0.45,
  exposure: 0.20,
  vulnerability: 0.15,
  history: 0.10,
  evacuation: 0.10
};

export const PRIORITY_THRESHOLDS = {
  immediate: 80,
  shortTerm: 65,
  mediumTerm: 50
};

/**
 * Calculate the comprehensive relocation priority using a multi-factor formula.
 * Normalizes inputs and clamps final priority to 0-100.
 */
export function calculateRelocationPriority(hab) {
  const finalRisk = calculateFinalRisk(hab);
  
  // Apply weights
  const rawPriorityScore = 
    (finalRisk.score * PRIORITY_WEIGHTS.risk) +
    (hab.exposureScore * PRIORITY_WEIGHTS.exposure) +
    (hab.vulnerabilityScore * PRIORITY_WEIGHTS.vulnerability) +
    (hab.disasterHistoryScore * PRIORITY_WEIGHTS.history) +
    (hab.evacuationDifficulty * PRIORITY_WEIGHTS.evacuation);
    
  const score = Math.min(100, Math.round(rawPriorityScore));
  
  let category;
  if (score >= PRIORITY_THRESHOLDS.immediate) {
    category = "Immediate";
  } else if (score >= PRIORITY_THRESHOLDS.shortTerm) {
    category = "Short-Term";
  } else if (score >= PRIORITY_THRESHOLDS.mediumTerm) {
    category = "Medium-Term";
  } else {
    category = "Monitor";
  }
  
  const factors = [
    { name: 'final risk', val: finalRisk.score },
    { name: 'population exposure', val: hab.exposureScore },
    { name: 'vulnerability', val: hab.vulnerabilityScore },
    { name: 'disaster history', val: hab.disasterHistoryScore },
    { name: 'evacuation difficulty', val: hab.evacuationDifficulty }
  ];
  
  factors.sort((a, b) => b.val - a.val);
  const highestFactor = factors[0];
  
  const explanation = `${category} priority because ${highestFactor.name} is high, with significant contributing factors.`;

  return {
    ...hab,
    computedRisk: finalRisk, // Base mathematical + spatial risk
    riskTier: finalRisk.tier,
    priorityCategory: category, // For backward compatibility with things expecting a string priority
    priorityEngine: { // The transparent priority explanation
      score,
      category,
      explanation,
      highestFactor: highestFactor.name,
      components: {
        finalRisk: finalRisk.score,
        exposure: hab.exposureScore,
        vulnerability: hab.vulnerabilityScore,
        disasterHistory: hab.disasterHistoryScore,
        evacuationDifficulty: hab.evacuationDifficulty
      }
    }
  };
}

/**
 * Get the minimum (limiting) capacity across all infrastructure categories for a site.
 * This represents the true maximum safe population the site can support.
 * @param {object} site - A relocation site object.
 * @returns {{ maxSafeCapacity: number, limitingFactor: string }}
 */
export function getSiteMaxCapacity(site) {
  const categories = {
    'Land': site.landCapacity,
    'Housing': site.housingCapacity,
    'Water': site.waterCapacity,
    'Healthcare': site.healthcareCapacity,
    'Education': site.educationCapacity,
    'Infrastructure': site.infrastructureCapacity,
  };

  const limitingEntry = Object.entries(categories).reduce(
    (min, [name, val]) => (val < min.val ? { name, val } : min),
    { name: '', val: Infinity }
  );

  return {
    maxSafeCapacity: limitingEntry.val,
    limitingFactor: limitingEntry.name,
    availableCapacity: Math.max(0, limitingEntry.val - site.currentOccupancy),
    categories,
  };
}

// =============================================================================
// ACCESSOR FUNCTIONS
// =============================================================================

/** Get all habitations with their computed risk scores attached. */
export function getAllHabitations() {
  return habitations.map(hab => calculateRelocationPriority(hab));
}

/** Get all relocation sites with their computed capacity attached. */
export function getAllSites() {
  return relocationSites.map(site => ({
    ...site,
    capacity: getSiteMaxCapacity(site),
  }));
}

/** Get a single habitation by ID with computed risk attached. */
export function getHabitationById(id) {
  const hab = habitations.find(h => h.id === id);
  if (!hab) return null;
  return calculateRelocationPriority(hab);
}

/**
 * Get habitations ranked by relocation priority score (highest first).
 */
export function getRelocationPriorities() {
  const allHabs = getAllHabitations();
  return allHabs.sort((a, b) => b.priorityEngine.score - a.priorityEngine.score);
}

/** Get a single relocation site by ID with capacity computed. */
export function getSiteById(id) {
  const site = relocationSites.find(s => s.id === id);
  if (!site) return null;
  return { ...site, capacity: getSiteMaxCapacity(site) };
}

/**
 * Get habitations ranked by computed risk score (highest first).
 * Useful for the Relocation Priority screen.
 */
export function getHabitationsRankedByRisk() {
  return getAllHabitations().sort((a, b) => b.computedRisk.score - a.computedRisk.score);
}

/**
 * Get relocation sites ranked by suitability score (highest first).
 */
export function getSitesRankedBySuitability() {
  return getAllSites().sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}

// ---------------------------------------------------------------------------
// SUMMARY STATISTICS (for KPI cards on the Dashboard)
// ---------------------------------------------------------------------------
function computedHabs() {
  return getAllHabitations();
}

export const DISTRICT_SUMMARY = {
  districtName: 'Kamrup Metropolitan',
  state: 'Assam',
  totalHabitations: habitations.length,
  get redZoneHabitations() {
    return computedHabs().filter(h => h.computedRisk.tier === 'Extreme').length;
  },
  get immediateRelocations() {
    return computedHabs().filter(h => h.computedRisk.priority === 'Immediate').length;
  },
  get totalPeopleAtRisk() {
    return computedHabs()
      .filter(h => h.computedRisk.tier === 'Extreme' || h.computedRisk.tier === 'High')
      .reduce((sum, h) => sum + h.population, 0);
  },
  totalRelocationSites: relocationSites.length,
};
