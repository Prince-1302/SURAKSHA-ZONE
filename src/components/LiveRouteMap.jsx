import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Navigation, Crosshair, Map as MapIcon } from 'lucide-react';

// Custom icons for start and end
const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const endIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map centering and zooming
function MapController({ routeGeoJSON, start, end }) {
  const map = useMap();
  
  useEffect(() => {
    if (routeGeoJSON) {
      const bounds = L.geoJSON(routeGeoJSON).getBounds();
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (start) {
      map.flyTo([start.lat, start.lon], 13);
    }
  }, [routeGeoJSON, start, map]);

  return null;
}

export default function LiveRouteMap() {
  const [sourceQuery, setSourceQuery] = useState('');
  const [destQuery, setDestQuery] = useState('');
  
  const [source, setSource] = useState(null);
  const [dest, setDest] = useState(null);
  
  const [routeGeoJSON, setRouteGeoJSON] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const [mapCenter, setMapCenter] = useState([22.9, 78.8]); // Default center (India roughly)

  const handleSearch = async (query, setLocation) => {
    if (!query) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=jsonv2&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        setLocation({ lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), name: data[0].display_name });
      } else {
        alert("Location not found");
      }
    } catch (err) {
      console.error(err);
      alert("Error searching location");
    }
  };

  const calculateRoute = async () => {
    if (!source || !dest) return;
    setLoading(true);
    try {
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${source.lon},${source.lat};${dest.lon},${dest.lat}?overview=full&geometries=geojson`);
      const data = await res.json();
      
      if (data.code === 'Ok' && data.routes.length > 0) {
        setRouteGeoJSON(data.routes[0].geometry);
        setRouteInfo({
          distance: (data.routes[0].distance / 1000).toFixed(1), // km
          duration: Math.round(data.routes[0].duration / 60) // minutes
        });
      } else {
        alert("Could not find a route.");
      }
    } catch (err) {
      console.error(err);
      alert("Error calculating route");
    } finally {
      setLoading(false);
    }
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setMapCenter([latitude, longitude]);
        setSource({ lat: latitude, lon: longitude, name: "My Location" });
        setSourceQuery("My Location");
      }, () => {
        alert("Geolocation permission denied.");
      });
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Search Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Source</label>
          <div style={{ display: 'flex' }}>
            <input 
              type="text" 
              value={sourceQuery} 
              onChange={e => setSourceQuery(e.target.value)}
              placeholder="e.g. Boragaon, Assam"
              style={{ flex: 1, padding: '8px 12px', borderRadius: '4px 0 0 4px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'white' }}
            />
            <button onClick={() => handleSearch(sourceQuery, setSource)} style={{ padding: '8px 12px', background: 'var(--govt-blue)', color: 'white', border: 'none', borderRadius: '0 4px 4px 0', cursor: 'pointer' }}>
              <Search size={16} />
            </button>
          </div>
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Destination</label>
          <div style={{ display: 'flex' }}>
            <input 
              type="text" 
              value={destQuery} 
              onChange={e => setDestQuery(e.target.value)}
              placeholder="e.g. Guwahati"
              style={{ flex: 1, padding: '8px 12px', borderRadius: '4px 0 0 4px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'white' }}
            />
            <button onClick={() => handleSearch(destQuery, setDest)} style={{ padding: '8px 12px', background: 'var(--govt-blue)', color: 'white', border: 'none', borderRadius: '0 4px 4px 0', cursor: 'pointer' }}>
              <Search size={16} />
            </button>
          </div>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={calculateRoute}
          disabled={!source || !dest || loading}
          style={{ height: '37px', opacity: (!source || !dest) ? 0.5 : 1 }}
        >
          {loading ? 'Calculating...' : 'Get Route'}
        </button>
      </div>

      {routeInfo && (
        <div style={{ padding: '12px 16px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid var(--risk-low)', borderRadius: '6px', display: 'flex', gap: '24px' }}>
          <div><strong style={{ color: 'var(--risk-low)' }}>Distance:</strong> {routeInfo.distance} km</div>
          <div><strong style={{ color: 'var(--risk-low)' }}>Estimated Time:</strong> {routeInfo.duration} mins</div>
        </div>
      )}

      {/* Map Section matching reference image */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <span style={{ width: '10px', height: '10px', background: 'var(--risk-low)', borderRadius: '50%', display: 'inline-block' }}></span>
          Route Preview
        </div>
        
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          height: '400px', 
          borderRadius: '12px', 
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          border: '1px solid var(--border-color)'
        }}>
          
          {/* Custom overlays over the map */}
          
          {/* Top Left Badge */}
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
            <span style={{ width: '10px', height: '10px', background: '#22C55E', borderRadius: '50%', display: 'inline-block' }}></span>
            Live OSRM Route
          </div>

          {/* Bottom Left Locate Me */}
          <button 
            onClick={handleLocateMe}
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
            <MapPin size={16} color="#EF4444" fill="#EF4444" />
            Locate Me
          </button>

          {/* Custom attribution (bottom right) */}
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

          {/* Map itself */}
          <MapContainer 
            center={mapCenter} 
            zoom={5} 
            zoomControl={false}
            style={{ height: '100%', width: '100%', zIndex: 1 }}
          >
            <TileLayer
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Native Zoom control placed on right */}
            <ZoomControl position="bottomright" />

            <MapController routeGeoJSON={routeGeoJSON} start={source} end={dest} />

            {source && <Marker position={[source.lat, source.lon]} icon={startIcon} />}
            {dest && <Marker position={[dest.lat, dest.lon]} icon={endIcon} />}
            
            {routeGeoJSON && (
              <GeoJSON 
                key={JSON.stringify(routeGeoJSON)} 
                data={routeGeoJSON} 
                style={{ color: '#3b82f6', weight: 4, opacity: 0.8 }} 
              />
            )}
          </MapContainer>
          
        </div>
      </div>
    </div>
  );
}
