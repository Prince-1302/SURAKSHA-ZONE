// =============================================================================
// ILLUSTRATIVE FLOOD HAZARD GEOJSON — SIH26191 Prototype
// =============================================================================
// SOURCE / PROVENANCE:
//   This is an ILLUSTRATIVE flood hazard layer created for SIH26191 internal-
//   round demonstration purposes. It is NOT official government data.
//   It is NOT sourced from NDEM, NDMA, CWC, IMD, or Bhuvan/ISRO portals.
//
//   The polygon geometries represent plausible flood-prone zones in the
//   Kamrup Metropolitan / Brahmaputra south-bank pilot region of Assam, India,
//   broadly consistent with well-known publicly documented flood geography
//   of the Guwahati urban fringe and Brahmaputra floodplain.
//
//   Do NOT present these boundaries as:
//     - Official government flood zone declarations
//     - CWC (Central Water Commission) flood inundation extents
//     - NDMA notified hazard boundaries
//     - Any legally binding flood-zone designation
//
//   For production use, replace with validated spatial data from:
//     - CWC Flood Inundation Mapping (https://cwc.gov.in)
//     - Bhuvan NRSC Disaster Management Portal (https://bhuvan.nrsc.gov.in)
//     - NDMA GIS layers
//     - State Disaster Management Authority (ASDMA) flood maps
//
//   Pilot Region: Kamrup Metropolitan + Kamrup (Rural), Assam, India
//   Geographic Coverage: approx. 26.04°N–26.20°N, 91.40°E–91.98°E
//   Coordinate System: WGS84 / EPSG:4326
// =============================================================================

export const floodHazardGeoJSON = {
  type: 'FeatureCollection',
  name: 'Illustrative Flood Hazard Zones — Kamrup Pilot Region (SIH26191)',
  features: [
    // -----------------------------------------------------------------------
    // Zone F1: Central Brahmaputra South-Bank Floodplain
    // Approx. coverage: Guwahati urban fringe, south bank of Brahmaputra
    // Habitations within this zone (illustrative): HAB001, HAB002, HAB003, HAB009
    // -----------------------------------------------------------------------
    {
      type: 'Feature',
      properties: {
        id: 'F1',
        name: 'Central Brahmaputra South-Bank Floodplain',
        severity: 'High',
        hazardType: 'Flood',
        description: 'South bank floodplain of the Brahmaputra, historically inundated during peak monsoon. Includes urban fringe of Guwahati.',
        dataSource: 'Illustrative — SIH26191 prototype only',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [91.620, 26.058],
            [91.620, 26.152],
            [91.700, 26.155],
            [91.760, 26.148],
            [91.820, 26.138],
            [91.860, 26.118],
            [91.860, 26.062],
            [91.790, 26.052],
            [91.700, 26.048],
            [91.620, 26.058],  // closed ring
          ],
        ],
      },
    },

    // -----------------------------------------------------------------------
    // Zone F2: Western Tributary Floodplain (Kulsi / Bharalu tributaries)
    // Approx. coverage: West of Guwahati, Palashbari area
    // Habitations within this zone (illustrative): HAB006
    // -----------------------------------------------------------------------
    {
      type: 'Feature',
      properties: {
        id: 'F2',
        name: 'Western Tributary Floodplain (Palashbari Sector)',
        severity: 'Moderate',
        hazardType: 'Flood',
        description: 'Floodplain of western tributaries of the Brahmaputra. Periodically inundated during heavy monsoon discharge.',
        dataSource: 'Illustrative — SIH26191 prototype only',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [91.450, 26.095],
            [91.450, 26.145],
            [91.565, 26.140],
            [91.590, 26.120],
            [91.590, 26.090],
            [91.520, 26.085],
            [91.450, 26.095],  // closed ring
          ],
        ],
      },
    },

    // -----------------------------------------------------------------------
    // Zone F3: Eastern Char / Riverine Island Zone
    // Approx. coverage: East of Guwahati, braided channel chars
    // No pilot habitations within this zone in the current dataset
    // -----------------------------------------------------------------------
    {
      type: 'Feature',
      properties: {
        id: 'F3',
        name: 'Eastern Char & Riverine Island Zone',
        severity: 'Extreme',
        hazardType: 'Flood',
        description: 'Braided river channel and char (river island) zone east of the pilot area. Extremely high flood frequency and severity.',
        dataSource: 'Illustrative — SIH26191 prototype only',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [91.870, 26.100],
            [91.870, 26.195],
            [91.950, 26.180],
            [91.980, 26.130],
            [91.960, 26.095],
            [91.870, 26.100],  // closed ring
          ],
        ],
      },
    },
  ],
};

export default floodHazardGeoJSON;
