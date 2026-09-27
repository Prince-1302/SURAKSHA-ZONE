// =============================================================================
// SPATIAL UTILITIES — SIH26191 Prototype
// =============================================================================
// Pure-JS point-in-polygon using the Ray Casting algorithm.
// No external geospatial library dependency required.
//
// All GeoJSON coordinates are in [longitude, latitude] order (GeoJSON spec).
// All Leaflet/habitation coordinates are in {lat, lng} or (lat, lng) order.
// These functions handle the conversion internally.
// =============================================================================

/**
 * Ray casting point-in-polygon test for a single GeoJSON coordinate ring.
 *
 * @param {number} lat - Latitude of the test point.
 * @param {number} lng - Longitude of the test point.
 * @param {Array} ring - Array of [longitude, latitude] pairs (GeoJSON ring).
 * @returns {boolean} True if the point is inside the ring.
 */
export function isPointInRing(lat, lng, ring) {
  let inside = false;
  const n = ring.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    // GeoJSON coords: [longitude, latitude]
    const xi = ring[i][0]; // longitude of vertex i
    const yi = ring[i][1]; // latitude of vertex i
    const xj = ring[j][0]; // longitude of vertex j
    const yj = ring[j][1]; // latitude of vertex j

    // Check if the horizontal ray from (lng, lat) going east
    // intersects the edge (xi,yi)→(xj,yj)
    const latInBand = (yi > lat) !== (yj > lat);
    if (latInBand) {
      // x-coordinate of the intersection
      const xIntersect = (xj - xi) * (lat - yi) / (yj - yi) + xi;
      if (lng < xIntersect) {
        inside = !inside;
      }
    }
  }

  return inside;
}

/**
 * Test if a point lies inside a GeoJSON Polygon or MultiPolygon feature.
 * For Polygon: checks the outer ring only (holes ignored for prototype).
 * For MultiPolygon: checks outer ring of each polygon part.
 *
 * @param {number} lat - Latitude of the test point.
 * @param {number} lng - Longitude of the test point.
 * @param {object} feature - A GeoJSON Feature object.
 * @returns {boolean} True if the point is inside the feature's geometry.
 */
export function isPointInFeature(lat, lng, feature) {
  if (!feature || !feature.geometry) return false;

  const { type, coordinates } = feature.geometry;

  if (type === 'Polygon') {
    // coordinates[0] is the outer ring; coordinates[1+] are holes (ignored here)
    return isPointInRing(lat, lng, coordinates[0]);
  }

  if (type === 'MultiPolygon') {
    // coordinates is an array of polygon coordinate arrays
    return coordinates.some(polygon => isPointInRing(lat, lng, polygon[0]));
  }

  return false;
}

/**
 * Determine flood spatial exposure for a point against a GeoJSON FeatureCollection.
 * Returns the FIRST feature the point falls inside (highest-severity-first if sorted).
 *
 * @param {number} lat - Latitude of the habitation.
 * @param {number} lng - Longitude of the habitation.
 * @param {object} featureCollection - A GeoJSON FeatureCollection.
 * @returns {{
 *   exposed: boolean,
 *   zoneId: string|null,
 *   zoneName: string|null,
 *   severity: string|null,
 *   description: string|null,
 * }}
 */
export function getFloodExposure(lat, lng, featureCollection) {
  if (!featureCollection || !featureCollection.features) {
    return { exposed: false, zoneId: null, zoneName: null, severity: null, description: null };
  }

  for (const feature of featureCollection.features) {
    if (isPointInFeature(lat, lng, feature)) {
      const props = feature.properties || {};
      return {
        exposed: true,
        zoneId: props.id || null,
        zoneName: props.name || 'Flood Zone',
        severity: props.severity || 'High',
        description: props.description || null,
      };
    }
  }

  return { exposed: false, zoneId: null, zoneName: null, severity: null, description: null };
}

/**
 * Compute flood spatial exposure for all habitations in a list.
 * Returns a plain object keyed by habitation ID.
 *
 * @param {Array} habitations - Array of habitation objects with { id, lat, lng }.
 * @param {object} featureCollection - GeoJSON FeatureCollection to test against.
 * @returns {Object} Map of { [habitationId]: FloodExposureResult }
 */
export function computeFloodExposures(habitations, featureCollection) {
  const result = {};
  for (const hab of habitations) {
    result[hab.id] = getFloodExposure(hab.lat, hab.lng, featureCollection);
  }
  return result;
}
