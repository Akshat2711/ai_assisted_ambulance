"use client";
import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ArrowLeft, Phone, Navigation, Building2, Signal, Map as MapIcon, List, Clock, Gauge } from 'lucide-react';

const MapComponent = dynamic(() => import('./mapcomponent'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-zinc-950 flex items-center justify-center text-zinc-500 font-mono text-xs animate-pulse">BOOTING GPS...</div>
});

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1*(Math.PI/180)) * Math.cos(lat2*(Math.PI/180)) * Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
};

const tiers = [
  { id: 1, label: 'Tier 1', level: 'primary', color: 'bg-blue-500', description: 'Primary Care • Basic Emergency' },
  { id: 2, label: 'Tier 2', level: 'secondary', color: 'bg-purple-500', description: 'Multi-specialty • Advanced Diagnostics' },
  { id: 3, label: 'Tier 3', level: 'tertiary', color: 'bg-emerald-500', description: 'Super-specialty • ICU & Trauma' },
];

const hospitals = [
  { id: 1, name: "SIVA Hospital 24 x 7", type: "primary", address: "Chengalpattu", lat: 12.6815, lng: 79.9825, phone: "04427420008" },

  { id: 2, name: "Deepam Medfirst Hospital", type: "secondary", address: "Chengalpattu", lat: 12.6930, lng: 79.9770, phone: "04427423000" },

  { id: 3, name: "Sai Hospital (Sai Fertility Centre & Hospital)", type: "secondary", address: "Chengalpattu", lat: 12.6902, lng: 79.9754, phone: "" },

  { id: 4, name: "Parvathy Hospital", type: "secondary", address: "Chengalpattu", lat: 12.6951, lng: 79.9813, phone: "" },

  { id: 5, name: "Jeevan Sumyuktha Hospitals Pvt Ltd", type: "secondary", address: "Chengalpattu", lat: 12.6888, lng: 79.9790, phone: "" },

  { id: 6, name: "Raj Hospital (24 hrs Ortho, Trauma & General)", type: "secondary", address: "Chengalpattu", lat: 12.6867, lng: 79.9832, phone: "" },

  { id: 7, name: "Sree Renga Hospital", type: "secondary", address: "Chengalpattu", lat: 12.6945, lng: 79.9786, phone: "" },

  { id: 8, name: "Chengalpattu Medical College & Hospital", type: "tertiary", address: "GST Road", lat: 12.6841, lng: 79.9798, phone: "04427426666" },

  { id: 9, name: "SRM Medical College Hospital & Research Centre", type: "tertiary", address: "Potheri", lat: 12.8231, lng: 80.0442, phone: "04427417000" },

  { id: 10, name: "Rajalakshmi Health City (Rajalakshmi Medical College Hospital)", type: "tertiary", address: "Chengalpattu region", lat: 12.8123, lng: 80.0301, phone: "" },

  { id: 11, name: "Medway JSP Hospitals", type: "tertiary", address: "Chengalpattu region", lat: 12.7065, lng: 79.9874, phone: "" }
];

const TierSelector = () => {
  const [activeTier, setActiveTier] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [userLoc, setUserLoc] = useState<{lat: number, lng: number} | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [focusHospital, setFocusHospital] = useState<{lat: number, lng: number} | null>(null);
  const [speed, setSpeed] = useState<number>(40); // Initial fallback km/h

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        // pos.coords.speed is in m/s, convert to km/h
        if (pos.coords.speed && pos.coords.speed > 0) {
          setSpeed(pos.coords.speed * 3.6);
        }
      },
      () => setUserLoc({ lat: 12.6819, lng: 79.9864 }),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const sortedHospitals = useMemo(() => {
    return hospitals
      .filter(h => h.type === selectedLevel)
      .map(h => {
        const dist = userLoc ? calculateDistance(userLoc.lat, userLoc.lng, h.lat, h.lng) : 0;
        const velocity = speed > 5 ? speed : 40; 
        const etaMins = Math.round((dist / velocity) * 60);
        return { ...h, dist, eta: etaMins < 1 ? "Under 1 min" : `${etaMins} mins` };
      })
      .sort((a, b) => a.dist - b.dist);
  }, [userLoc, selectedLevel, speed]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-zinc-950 text-white overflow-hidden mt-[2vh]">
      <div className="relative w-full max-w-2xl h-[85vh] overflow-hidden border border-white/10 rounded-[2.5rem] bg-zinc-900/20 shadow-2xl">
        
        {/* VIEW 1: TIER SELECTION */}
        <div className={`absolute inset-0 flex flex-col p-6 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] 
          ${selectedLevel ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
        <div className="flex gap-3 items-start mb-8">


        {/* Hospital tier bubble */}
        <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-2xl">
          <p className="text-zinc-500 text-sm">
            Select Hospital tier
          </p>
        </div>

        {/* Speed bubble */}
        <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-2xl flex items-center gap-2">
          <Gauge size={14} className="text-blue-400" />
          <span className="text-[10px] font-mono text-zinc-300">
            {speed.toFixed(0)} KM/H
          </span>
        </div>

      </div>


          <div className="flex-1 flex flex-col gap-3 relative">
            {tiers.map((tier) => (
              <button key={tier.id} onClick={() => { setActiveTier(tier.id); setSelectedLevel(tier.level); }}
                className="relative flex-1 group flex flex-col items-center justify-center px-6 rounded-[2rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all"
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={`h-2 w-2 rounded-full ${activeTier === tier.id ? tier.color + ' scale-150' : 'bg-zinc-700'}`} />
                  <span className="text-4xl md:text-5xl font-black tracking-tighter transition-colors">{tier.label}</span>
                  <p className="text-xs md:text-sm font-medium text-zinc-400">{tier.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* VIEW 2: HOSPITAL LIST / MAP */}
        <div className={`absolute inset-0 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
          ${selectedLevel ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
          
          <div className="p-6 flex items-center justify-between bg-zinc-900/50 backdrop-blur-xl border-b border-white/5 z-30">
            <div className="flex items-center gap-4">
              <button onClick={() => setSelectedLevel(null)} className="p-2.5 bg-white/5 rounded-full hover:bg-white/10 active:scale-90"><ArrowLeft size={20} /></button>
              <div>
                <h2 className="text-lg font-bold capitalize leading-none mb-1">{selectedLevel} Care</h2>
                <p className="text-[10px] text-zinc-500 flex items-center gap-1 uppercase tracking-widest font-bold font-mono tracking-tighter">
                    {speed.toFixed(0)} km/h <Signal size={10} className="text-emerald-500 animate-pulse" />
                </p>
              </div>
            </div>

            <button onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-2xl text-xs font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
            >
              {viewMode === 'list' ? <><MapIcon size={16} /> Map</> : <><List size={16} /> List</>}
            </button>
          </div>

          <div className="flex-1 relative overflow-hidden bg-zinc-950/50">
            {viewMode === 'list' ? (
              <div className="h-full overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {sortedHospitals.map((hospital, idx) => (
                  <div key={idx} className="group p-5 bg-white/5 border border-white/5 rounded-[2rem] hover:bg-white/10 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400"><Building2 size={24} /></div>
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-100 leading-tight">{hospital.name}</span>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[10px] text-blue-400 font-mono font-bold">{hospital.dist.toFixed(1)} KM</span>
                            <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                                <Clock size={10} /> ETA: {hospital.eta}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <a href={`tel:${hospital.phone}`} className="flex-1 py-3.5 bg-emerald-500 text-black rounded-xl flex items-center justify-center gap-2 text-xs font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10"><Phone size={14}/> Emergency Call</a>
                      <button onClick={() => { setFocusHospital({ lat: hospital.lat, lng: hospital.lng }); setViewMode('map'); }}
                        className="p-3.5 bg-white/5 text-zinc-300 border border-white/5 rounded-xl hover:bg-white/10 transition-all"><Navigation size={18}/></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full w-full">
                {userLoc && <MapComponent userLoc={userLoc} hospitals={sortedHospitals} focusHospital={focusHospital} speed={speed} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TierSelector;