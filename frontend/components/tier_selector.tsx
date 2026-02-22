"use client";
import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Phone, Navigation, Building2, Signal, 
  Map as MapIcon, List, Clock, Gauge 
} from 'lucide-react';
import HospitalDetailView from './hospital_detailed_view/HospitalDetailView';

const MapComponent = dynamic(() => import('./mapcomponent'), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-zinc-950 flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Booting GPS...</span>
    </div>
  )
});

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1*(Math.PI/180)) * Math.cos(lat2*(Math.PI/180)) * Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
};

const tiers = [
  { id: 1, label: 'Tier 3', level: 'primary', color: 'bg-blue-500', description: 'Primary Care • Basic Emergency' },
  { id: 2, label: 'Tier 2', level: 'secondary', color: 'bg-purple-500', description: 'Multi-specialty • Diagnostics' },
  { id: 3, label: 'Tier 1', level: 'tertiary', color: 'bg-emerald-500', description: 'Super-specialty • ICU & Trauma' },
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
  const [selectedHospital, setSelectedHospital] = useState<any | null>(null);
  const [speed, setSpeed] = useState<number>(40);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        if (pos.coords.speed && pos.coords.speed > 0) setSpeed(pos.coords.speed * 3.6);
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
    <div className="w-full min-h-screen flex items-center justify-center p-0 sm:p-4 bg-zinc-950 text-white overflow-hidden mt-[-10vh]">
      <div className="relative w-full max-w-2xl h-[90vh] sm:h-[85vh] overflow-hidden sm:border border-white/10 sm:rounded-[2.5rem] bg-zinc-950 sm:bg-zinc-900/20 shadow-2xl backdrop-blur-sm">
        
        <AnimatePresence mode="wait" initial={false}>
          {!selectedLevel ? (
            /* --- VIEW 1: TIER SELECTION --- */
            <motion.div 
              key="selector-view"
              initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="absolute inset-0 flex flex-col p-6 pt-12 sm:pt-6"
            >
              <div className="flex flex-wrap gap-2 items-center mb-8">
                <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Emergency Console</p>
                </div>
                <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
                  <Gauge size={12} className="text-blue-400" />
                  <span className="text-[10px] font-mono font-bold text-zinc-300">{speed.toFixed(0)} KM/H</span>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-3">
                {tiers.map((tier) => (
                  <motion.button
                    key={tier.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setActiveTier(tier.id); setSelectedLevel(tier.level); }}
                    className="group relative flex-1 flex flex-col items-center justify-center px-6 rounded-[2rem] border border-white/[0.05] bg-gradient-to-b from-white/[0.03] to-transparent transition-all hover:border-white/10"
                  >
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className={`h-1.5 w-1.5 rounded-full mb-4 ${activeTier === tier.id ? tier.color + ' scale-150 shadow-[0_0_15px_white]' : 'bg-zinc-700'}`} />
                      <span className="text-5xl sm:text-6xl font-black tracking-tighter mb-1 transition-transform duration-500">
                        {tier.label}
                      </span>
                      <p className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">
                        {tier.description}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : selectedHospital ? (
            /* --- VIEW 3: HOSPITAL DETAIL VIEW --- */
            <HospitalDetailView
              key="hospital-detail"
              hospital={selectedHospital}
              userLoc={userLoc || { lat: 12.6819, lng: 79.9864 }}
              speed={speed}
              onBack={() => setSelectedHospital(null)}
            />
          ) : (
            /* --- VIEW 2: HOSPITAL DASHBOARD --- */
            <motion.div 
              key="hospital-list-view"
              initial={{ opacity: 0, x: 40, filter: "blur(5px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 40, filter: "blur(5px)" }}
              transition={{ type: "spring", damping: 25, stiffness: 150 }}
              className="absolute inset-0 flex flex-col bg-zinc-950"
            >
              <div className="p-4 sm:p-6 flex items-center justify-between border-b border-white/[0.03] bg-zinc-900/40 backdrop-blur-2xl z-30">
                <div className="flex items-center gap-3 sm:gap-5">
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setSelectedLevel(null); setActiveTier(null); }} 
                    className="p-2.5 bg-white/[0.03] rounded-xl border border-white/5 text-zinc-400"
                  >
                    <ArrowLeft size={18} />
                  </motion.button>
                  <div>
                    <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" /> Live Response
                    </h2>
                    <h1 className="text-lg font-bold text-white tracking-tight capitalize">{selectedLevel} Care</h1>
                  </div>
                </div>

                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                  className="p-2.5 sm:px-5 sm:py-2.5 bg-blue-600/10 border border-blue-500/20 rounded-xl text-blue-400 text-xs font-bold transition-all active:scale-95"
                >
                  {viewMode === 'list' ? <MapIcon size={18} /> : <List size={18} />}
                </motion.button>
              </div>

              <div className="flex-1 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {viewMode === 'list' ? (
                    <motion.div 
                      key="list-mode"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="h-full overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar pb-24"
                    >
                      {sortedHospitals.map((hospital, idx) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          key={hospital.id}
                          className="relative group p-5 sm:p-6 rounded-[2rem] bg-zinc-900/40 border border-white/[0.05] hover:border-white/10 transition-all"
                        >
                          <div className="absolute top-5 right-5 font-mono text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
                            {hospital.dist.toFixed(1)}KM
                          </div>

                          <div className="flex flex-col gap-5">
                            <div className="flex items-start gap-4">
                              <div className="hidden sm:block p-3.5 rounded-2xl bg-zinc-800/50 border border-white/5">
                                <Building2 size={22} className="text-zinc-400" />
                              </div>
                              <div className="flex-1 pr-10">
                                <h3 className="text-md sm:text-lg font-bold text-zinc-100 leading-tight mb-1.5">{hospital.name}</h3>
                                <div className="flex flex-wrap gap-3">
                                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                    <Navigation size={10} /> {hospital.address}
                                  </span>
                                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                    <Clock size={10} /> {hospital.eta}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <motion.a 
                                whileTap={{ scale: 0.98 }}
                                href={`tel:${hospital.phone}`} 
                                className="flex-1 py-3.5 bg-emerald-500 rounded-xl flex items-center justify-center gap-2"
                              >
                                <Phone size={14} fill="black" className="text-black" />
                                <span className="text-[11px] font-black text-black uppercase tracking-wider">Call Now</span>
                              </motion.a>

                              <motion.button 
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSelectedHospital(hospital)}
                                className="px-5 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center text-white font-bold text-sm"
                              >
                                Go Here
                              </motion.button>
                              
                  
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="map-mode"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full w-full"
                    >
                      {userLoc && (
                        <MapComponent 
                          userLoc={userLoc} 
                          hospitals={sortedHospitals} 
                          focusHospital={focusHospital} 
                          speed={speed} 
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default TierSelector;