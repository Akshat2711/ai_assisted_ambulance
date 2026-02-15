"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Phone,
  Navigation,
  FileText,
  MessageSquare,
  Bed,
  Send,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Activity,
  Eye
} from 'lucide-react';
import dynamic from 'next/dynamic';
import ReportPreviewModal from './ReportPreviewModal';

const MapComponent = dynamic(() => import('../mapcomponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-zinc-950 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
    </div>
  )
});

interface Hospital {
  id: number;
  name: string;
  type: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  dist: number;
  eta: string;
}

interface HospitalDetailViewProps {
  hospital: Hospital;
  userLoc: { lat: number; lng: number };
  speed: number;
  onBack: () => void;
}

const HospitalDetailView: React.FC<HospitalDetailViewProps> = ({
  hospital,
  userLoc,
  speed,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'nav' | 'report' | 'message'>('nav');
  const [reportSent, setReportSent] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [message, setMessage] = useState('');
  const [savedReport, setSavedReport] = useState<any>(null);
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [bedData, setBedData] = useState({
    general: Math.floor(Math.random() * 15) + 5,
    icu: Math.floor(Math.random() * 8) + 2,
    emergency: Math.floor(Math.random() * 10) + 3
  });

  // Load saved report from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const reportData = localStorage.getItem('latestPatientReport');
      if (reportData) {
        try {
          setSavedReport(JSON.parse(reportData));
        } catch (err) {
          console.error('Failed to parse saved report:', err);
        }
      }
    }
  }, []);

  // Simulate bed availability updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBedData({
        general: Math.floor(Math.random() * 15) + 5,
        icu: Math.floor(Math.random() * 8) + 2,
        emergency: Math.floor(Math.random() * 10) + 3
      });
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSendReport = () => {
    setReportSent(true);
    setTimeout(() => setReportSent(false), 3000);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessageSent(true);
      setMessage('');
      setTimeout(() => setMessageSent(false), 3000);
    }
  };

  const tabs = [
    { id: 'nav' as const, label: 'Navigate', icon: Navigation },
    { id: 'report' as const, label: 'Report', icon: FileText },
    { id: 'message' as const, label: 'Message', icon: MessageSquare }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 flex flex-col bg-zinc-950"
    >
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-white/[0.03] bg-zinc-900/40 backdrop-blur-2xl z-30">
        <div className="flex items-center gap-3 mb-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="p-2.5 bg-white/[0.03] rounded-xl border border-white/5 text-zinc-400"
          >
            <ArrowLeft size={18} />
          </motion.button>
          <div className="flex-1">
            <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" /> En Route
            </h2>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight line-clamp-1">
              {hospital.name}
            </h1>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1">Distance</div>
            <div className="text-lg font-black text-white">{hospital.dist.toFixed(1)}<span className="text-xs text-zinc-400 ml-1">km</span></div>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1">ETA</div>
            <div className="text-lg font-black text-white">{hospital.eta}</div>
          </div>
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
            <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-1">Speed</div>
            <div className="text-lg font-black text-white">{speed.toFixed(0)}<span className="text-xs text-zinc-400 ml-1">km/h</span></div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-4 border-b border-white/[0.03] bg-zinc-900/20">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10'
            }`}
          >
            <tab.icon size={14} />
            <span className="hidden sm:inline">{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'nav' && (
          <div className="h-full flex flex-col">
            {/* Map */}
            <div className="flex-1 relative">
              <MapComponent
                userLoc={userLoc}
                hospitals={[hospital]}
                focusHospital={{ lat: hospital.lat, lng: hospital.lng }}
                speed={speed}
              />
            </div>

            {/* Bed Availability Overlay */}
            <div className="p-4 bg-zinc-900/95 backdrop-blur-xl border-t border-white/[0.05]">
              <div className="flex items-center gap-2 mb-3">
                <Bed size={16} className="text-blue-400" />
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Live Bed Availability</span>
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse ml-auto" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="text-2xl font-black text-white mb-1">{bedData.general}</div>
                  <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">General</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="text-2xl font-black text-white mb-1">{bedData.icu}</div>
                  <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">ICU</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="text-2xl font-black text-white mb-1">{bedData.emergency}</div>
                  <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Emergency</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 bg-zinc-900/95 backdrop-blur-xl border-t border-white/[0.05] flex gap-2">
              <motion.a
                whileTap={{ scale: 0.98 }}
                href={`tel:${hospital.phone}`}
                className="flex-1 py-4 bg-emerald-500 rounded-xl flex items-center justify-center gap-2"
              >
                <Phone size={16} fill="black" className="text-black" />
                <span className="text-sm font-black text-black uppercase tracking-wider">Call Hospital</span>
              </motion.a>
              <motion.a
                whileTap={{ scale: 0.98 }}
                href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 bg-blue-600 rounded-xl flex items-center justify-center"
              >
                <MapPin size={18} />
              </motion.a>
            </div>
          </div>
        )}

        {activeTab === 'report' && (
          <div className="h-full overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Saved Report Preview Banner */}
            {savedReport && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <CheckCircle2 size={18} className="text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-emerald-300 mb-1">Report Available</h3>
                    <p className="text-xs text-emerald-200/80">
                      Patient: {savedReport.patient_name || 'N/A'} • 
                      Created: {savedReport.date ? new Date(savedReport.date).toLocaleDateString() : 'Today'}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowReportPreview(true)}
                  className="w-full py-3 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-xl flex items-center justify-center gap-2 text-emerald-300 text-sm font-bold transition-colors"
                >
                  <Eye size={16} />
                  View Full Report
                </motion.button>
              </motion.div>
            )}

            {/* Send Report Section */}
            <div className="p-5 bg-zinc-900/40 border border-white/5 rounded-2xl">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2.5 bg-blue-500/10 rounded-xl">
                  <FileText size={18} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">Send to Hospital</h3>
                  <p className="text-xs text-zinc-400">
                    {savedReport 
                      ? 'Send your prepared report to the hospital emergency department'
                      : 'Send your medical info and vitals to the hospital'}
                  </p>
                </div>
              </div>

              {!savedReport && (
                <div className="space-y-3 mb-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-2">Patient Info</div>
                    <div className="text-sm text-white">Name, Age, Blood Group, Allergies</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-2">Current Vitals</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-white">Heart Rate: <span className="text-emerald-400 font-bold">72 bpm</span></div>
                      <div className="text-white">BP: <span className="text-emerald-400 font-bold">120/80</span></div>
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-2">Emergency Type</div>
                    <div className="text-sm text-white">Cardiac, Trauma, Medical, Other</div>
                  </div>
                </div>
              )}

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSendReport}
                disabled={reportSent}
                className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm uppercase tracking-wider transition-all ${
                  reportSent
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                    : 'bg-blue-600 text-white'
                }`}
              >
                {reportSent ? (
                  <>
                    <CheckCircle2 size={16} />
                    Report Sent to {hospital.name}
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Report
                  </>
                )}
              </motion.button>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex gap-3">
              <AlertCircle size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-200">
                This report will be sent directly to the hospital's emergency department. Ensure all information is accurate.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'message' && (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="p-5 bg-zinc-900/40 border border-white/5 rounded-2xl">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2.5 bg-purple-500/10 rounded-xl">
                    <MessageSquare size={18} className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Direct Messaging</h3>
                    <p className="text-xs text-zinc-400">Communicate with hospital staff in real-time</p>
                  </div>
                </div>

                {/* Mock message history */}
                <div className="space-y-3 mb-4 min-h-[200px]">
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl rounded-tl-none">
                    <div className="text-[10px] text-blue-400 font-bold mb-1">Emergency Dept • 2m ago</div>
                    <div className="text-sm text-white">We're ready for your arrival. Emergency bay 3 is prepared.</div>
                  </div>
                  
                  {messageSent && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl rounded-tr-none ml-auto max-w-[80%]"
                    >
                      <div className="text-[10px] text-emerald-400 font-bold mb-1">You • Just now</div>
                      <div className="text-sm text-white">Message delivered</div>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex gap-3">
                <Activity size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-200">
                  Staff typically responds within 1-2 minutes. For immediate assistance, call the hospital directly.
                </p>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 bg-zinc-900/95 backdrop-blur-xl border-t border-white/[0.05]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className={`px-5 py-3 rounded-xl flex items-center justify-center transition-all ${
                    message.trim()
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Report Preview Modal */}
      <ReportPreviewModal
        isOpen={showReportPreview}
        onClose={() => setShowReportPreview(false)}
        reportData={savedReport}
        hospitalName={hospital.name}
      />
    </motion.div>
  );
};

export default HospitalDetailView;