"use client";
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Share2 } from 'lucide-react';
import PatientCareReport from '@/components/patient_record/record_doc';

interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: any;
  hospitalName: string;
}

const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({
  isOpen,
  onClose,
  reportData,
  hospitalName
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrintReport = async () => {
    if (!reportRef.current) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n');
        } catch (e) {
          console.warn('Could not access stylesheet:', e);
          return '';
        }
      })
      .join('\n');

    const reportClone = reportRef.current.cloneNode(true) as HTMLElement;
    const reportHeight = reportRef.current.scrollHeight;
    const reportWidth = reportRef.current.scrollWidth;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Patient Care Report</title>
          <meta charset="utf-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: white;
              display: flex;
              justify-content: center;
              align-items: flex-start;
              padding: 10mm;
            }
            ${styles}
            @media print {
              html, body { width: 210mm; height: 297mm; margin: 0; padding: 0; overflow: hidden; }
              body { padding: 0; }
              @page { size: A4 portrait; margin: 0; }
              #report-container {
                max-height: 297mm !important;
                max-width: 210mm !important;
                transform-origin: top left;
                page-break-inside: avoid;
              }
              * { print-color-adjust: exact; -webkit-print-color-adjust: exact; page-break-inside: avoid; }
              ${reportHeight > 1122 ? `#report-container { transform: scale(${Math.min(1, 1122 / reportHeight)}); }` : ''}
            }
            #report-container { width: ${reportWidth}px; max-width: 100%; background: white; position: relative; }
          </style>
        </head>
        <body>
          <div id="report-container"></div>
        </body>
      </html>
    `);
    
    const container = printWindow.document.getElementById('report-container');
    if (container) container.appendChild(reportClone);
    printWindow.document.close();
    printWindow.onload = () => setTimeout(() => printWindow.print(), 500);
  };

  const formatObjectToString = (obj: any): string => {
    if (!obj) return 'N/A';
    if (typeof obj === 'string') return obj;
    if (typeof obj === 'object') {
      if (Array.isArray(obj)) {
        return obj.map(item => formatObjectToString(item)).join(', ');
      }
      return Object.entries(obj)
        .filter(([_, value]) => value !== null && value !== undefined && value !== '')
        .map(([key, value]) => {
          const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          const formattedValue = typeof value === 'object' ? formatObjectToString(value) : value;
          return `${formattedKey}: ${formattedValue}`;
        })
        .join('\n');
    }
    return String(obj);
  };

  const handleShare = async (platform: string) => {
    if (!reportData) return;
    
    const patientName = reportData.patient_name || 'Patient';
    const chiefComplaint = reportData.chief_complaint || 'N/A';
    const date = reportData.date || new Date().toISOString().split('T')[0];
    const vitals = reportData.vitals?.[0] || {};
    const medications = reportData.medications || [];
    
    const assessment = formatObjectToString(reportData.abc_assessment);
    const patientSigns = formatObjectToString(reportData.patient_signs);
    
    const vitalsList = [];
    if (vitals.bp) vitalsList.push(`• Blood Pressure: ${vitals.bp}`);
    if (vitals.pulse) vitalsList.push(`• Pulse: ${vitals.pulse}`);
    if (vitals.resp) vitalsList.push(`• Respiratory Rate: ${vitals.resp}`);
    if (vitals.temp) vitalsList.push(`• Temperature: ${vitals.temp}`);
    if (vitals.spo2) vitalsList.push(`• SpO2: ${vitals.spo2}`);
    if (vitals.gcs) vitalsList.push(`• GCS: ${vitals.gcs}`);
    if (vitals.pupils) vitalsList.push(`• Pupils: ${vitals.pupils}`);
    
    const vitalsText = vitalsList.length > 0 ? vitalsList.join('\n') : 'Not recorded';
    
    let medicationsText = 'None administered';
    if (medications.length > 0 && medications[0].name) {
      medicationsText = medications
        .filter((med: any) => med.name)
        .map((med: any, idx: number) => {
          const parts = [`${idx + 1}. ${med.name}`];
          if (med.dose) parts.push(med.dose);
          if (med.route) parts.push(`via ${med.route}`);
          if (med.time) parts.push(`at ${med.time}`);
          return parts.join(' - ');
        })
        .join('\n');
    }
    
    const reportSummary = `📋 PATIENT CARE REPORT

👤 Patient: ${patientName}
📅 Date: ${date}
🏥 Hospital: ${hospitalName}

🏥 CHIEF COMPLAINT
${chiefComplaint}

💊 VITALS
${vitalsText}

💉 MEDICATIONS
${medicationsText}

${assessment !== 'N/A' ? `🔍 ASSESSMENT\n${assessment}\n` : ''}
${patientSigns !== 'N/A' ? `📝 PATIENT SIGNS\n${patientSigns}\n` : ''}
---
Generated via Emergency Care System`;

    const encodedText = encodeURIComponent(reportSummary);

    const shareUrls: { [key: string]: string } = {
      whatsapp: `https://wa.me/?text=${encodedText}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      telegram: `https://t.me/share/url?text=${encodedText}`,
      email: `mailto:?subject=${encodeURIComponent('Patient Care Report - ' + patientName)}&body=${encodedText}`,
    };

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(reportSummary);
        alert('✅ Report summary copied to clipboard!');
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = reportSummary;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('✅ Report summary copied to clipboard!');
      }
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }

    setShowShareMenu(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-white/10"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 bg-zinc-950/80 flex justify-between items-center border-b border-white/5">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Patient Care Report</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {reportData?.patient_name || 'Patient'} • {reportData?.date ? new Date(reportData.date).toLocaleDateString() : 'Today'}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  {/* Share Button */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors"
                      title="Share report"
                    >
                      <Share2 size={18} />
                    </button>
                    
                    {showShareMenu && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-zinc-800 border border-white/10 rounded-lg shadow-xl overflow-hidden z-10">
                        <div className="px-4 py-2 border-b border-white/5">
                          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Share Report</p>
                        </div>
                        <button
                          onClick={() => handleShare('whatsapp')}
                          className="w-full px-4 py-2.5 text-left text-sm text-zinc-300 hover:bg-white/5 transition-colors flex items-center gap-3"
                        >
                          <span className="text-green-500">💬</span> WhatsApp
                        </button>
                        <button
                          onClick={() => handleShare('twitter')}
                          className="w-full px-4 py-2.5 text-left text-sm text-zinc-300 hover:bg-white/5 transition-colors flex items-center gap-3"
                        >
                          <span className="text-blue-400">🐦</span> Twitter
                        </button>
                        <button
                          onClick={() => handleShare('telegram')}
                          className="w-full px-4 py-2.5 text-left text-sm text-zinc-300 hover:bg-white/5 transition-colors flex items-center gap-3"
                        >
                          <span className="text-blue-500">✈️</span> Telegram
                        </button>
                        <button
                          onClick={() => handleShare('email')}
                          className="w-full px-4 py-2.5 text-left text-sm text-zinc-300 hover:bg-white/5 transition-colors flex items-center gap-3"
                        >
                          <span className="text-red-500">📧</span> Email
                        </button>
                        <div className="border-t border-white/5"></div>
                        <button
                          onClick={() => handleShare('copy')}
                          className="w-full px-4 py-2.5 text-left text-sm text-zinc-300 hover:bg-white/5 transition-colors flex items-center gap-3"
                        >
                          <span>📋</span> Copy Summary
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Print Button */}
                  <button 
                    onClick={handlePrintReport}
                    className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors"
                    title="Print report"
                  >
                    <Printer size={18} />
                  </button>

                  {/* Close Button */}
                  <button 
                    onClick={onClose}
                    className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Content - Scrollable Report */}
              <div className="flex-1 overflow-auto p-6 md:p-10 bg-zinc-900/40 custom-scrollbar">
                <div className="flex justify-center">
                  <div 
                    ref={reportRef}
                    className="bg-white shadow-2xl rounded-sm" 
                    style={{ width: '800px', minWidth: '800px' }}
                  >
                    <PatientCareReport 
                      data={reportData} 
                      editable={false} 
                      useHandwriting={true} 
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside share menu to close */}
      {showShareMenu && isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowShareMenu(false)}
        />
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </>
  );
};

export default ReportPreviewModal;