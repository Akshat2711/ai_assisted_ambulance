"use client";
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Clock, Phone } from 'lucide-react';

// Marker Icon Fixes
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const UserIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapController({ focusHospital }: { focusHospital: { lat: number, lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (focusHospital) {
      map.flyTo([focusHospital.lat, focusHospital.lng], 16, { duration: 1.8 });
    }
  }, [focusHospital, map]);
  return null;
}

export default function MapComponent({ userLoc, hospitals, focusHospital, speed }: any) {
  const getETA = (dist: number) => {
    const velocity = speed > 5 ? speed : 40; // Default to 40km/h if stationary
    const mins = Math.round((dist / velocity) * 60);
    return mins < 1 ? "Under 1 min" : `${mins} mins`;
  };

  return (
    <div className="h-full w-full">
      <MapContainer center={[userLoc.lat, userLoc.lng]} zoom={13} className="h-full w-full">
        <MapController focusHospital={focusHospital} />
        <TileLayer
          attribution='© CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <Marker position={[userLoc.lat, userLoc.lng]} icon={UserIcon}>
          <Popup>Current Position ({speed.toFixed(0)} km/h)</Popup>
        </Marker>

        {hospitals.map((h: any) => (
          <Marker key={h.id} position={[h.lat, h.lng]} icon={DefaultIcon}>
            <Popup>
              <div className="text-zinc-900 p-1 min-w-[140px]">
                <p className="font-bold text-sm leading-tight mb-1">{h.name}</p>
                <div className="flex flex-col gap-0.5 mb-2">
                  <p className="text-[10px] text-zinc-500 font-medium">{h.dist.toFixed(1)} km</p>
                  <p className="text-[10px] text-emerald-600 font-bold italic flex items-center gap-1">
                    <Clock size={10} /> ETA: {getETA(h.dist)}
                  </p>
                </div>
                <a href={`tel:${h.phone}`} className="block text-center py-2 bg-zinc-950 text-white rounded-lg text-xs font-bold no-underline">
                  Call Hospital
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <style jsx global>{`
        .leaflet-popup-content-wrapper { border-radius: 12px; }
        .leaflet-container { background: #09090b !important; }
      `}</style>
    </div>
  );
}