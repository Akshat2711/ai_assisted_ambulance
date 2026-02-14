"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, ChevronUp, ChevronDown, Trash2, Send, ArrowLeft, Printer, Share2 } from 'lucide-react';
import PatientCareReport from '@/components/patient_record/record_doc';
import { createReport } from '@/services/report_create_api';

type ViewState = 'recording' | 'report';

const RecorderBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [view, setView] = useState<ViewState>('recording');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const [loading, setLoading] = useState(false);
  
  // Local state for the report data
  const [reportData, setReportData] = useState<any>({
    chief_complaint: "",
    vitals: [{}],
    medications: [{}],
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let interim = '';
          let final = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPart = event.results[i][0].transcript;
            if (event.results[i].isFinal) final += transcriptPart + ' ';
            else interim += transcriptPart;
          }
          if (final) setTranscript(prev => prev + final);
          setInterimTranscript(interim);
        };
        recognitionRef.current = recognition;
      }
    }
    return () => { if (recognitionRef.current) recognitionRef.current.stop(); };
  }, []);

  const startVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyzerRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyzerRef.current);
      analyzerRef.current.fftSize = 64;

      const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas || !analyzerRef.current) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const bufferLength = analyzerRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyzerRef.current.getByteFrequencyData(dataArray);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(1, '#8b5cf6');
        ctx.fillStyle = gradient;
        const barWidth = (canvas.width / bufferLength) * 2;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
          const y = (canvas.height - barHeight) / 2;
          ctx.fillRect(x, y, barWidth - 2, barHeight);
          x += barWidth;
        }
        animationIdRef.current = requestAnimationFrame(draw);
      };
      draw();
    } catch (err) { console.error("Microphone access denied", err); }
  };

  const startTimer = () => {
    setRecordingTime(0);
    timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setView('recording');
      startVisualizer();
      if (recognitionRef.current) recognitionRef.current.start();
      startTimer();
      setIsRecording(true);
      setIsExpanded(true);
    } else {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
      stopTimer();
      setIsRecording(false);
    }
  };

  const handleCreateReport = async () => {
    try {
      setLoading(true);
      const response = await createReport(transcript);

      setReportData((prev: any) => ({
        ...prev,
        ...response.patient_data,
        abc_assessment: response.abc_assessment,
        patient_signs: response.patient_signs,
        date: new Date().toISOString().split("T")[0]
      }));

      setView("report");

    } catch (err) {
      console.error("Report creation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReport = async () => {
    if (!reportRef.current) return;
    
    // Create a print-friendly window
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Get all stylesheets from the current document
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

    // Clone the report element
    const reportClone = reportRef.current.cloneNode(true) as HTMLElement;
    
    // Get the computed height
    const reportHeight = reportRef.current.scrollHeight;
    const reportWidth = reportRef.current.scrollWidth;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Patient Care Report</title>
          <meta charset="utf-8">
          <style>
            /* Reset and base styles */
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            html, body {
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: hidden;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: white;
              display: flex;
              justify-content: center;
              align-items: flex-start;
              padding: 10mm;
            }
            
            /* Include all existing styles */
            ${styles}
            
            /* Print-specific styles */
            @media print {
              html, body {
                width: 210mm;
                height: 297mm;
                margin: 0;
                padding: 0;
                overflow: hidden;
              }
              
              body {
                padding: 0;
              }
              
              @page {
                size: A4 portrait;
                margin: 0;
              }
              
              /* Force content to fit on one page */
              #report-container {
                max-height: 297mm !important;
                max-width: 210mm !important;
                transform-origin: top left;
                page-break-inside: avoid;
                page-break-after: avoid;
                page-break-before: avoid;
              }
              
              /* Prevent page breaks */
              * {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
                page-break-inside: avoid;
              }
              
              /* Scale content if needed */
              ${reportHeight > 1122 ? `
                #report-container {
                  transform: scale(${Math.min(1, 1122 / reportHeight)});
                }
              ` : ''}
            }
            
            /* Container styling */
            #report-container {
              width: ${reportWidth}px;
              max-width: 100%;
              background: white;
              position: relative;
            }
          </style>
        </head>
        <body>
          <div id="report-container"></div>
        </body>
      </html>
    `);
    
    const container = printWindow.document.getElementById('report-container');
    if (container) {
      container.appendChild(reportClone);
    }
    
    printWindow.document.close();
    
    // Wait for content and styles to load then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  };

  const formatObjectToString = (obj: any): string => {
    if (!obj) return 'N/A';
    if (typeof obj === 'string') return obj;
    if (typeof obj === 'object') {
      // If it's an array, join with commas
      if (Array.isArray(obj)) {
        return obj.map(item => formatObjectToString(item)).join(', ');
      }
      // If it's an object, format key-value pairs
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
    const patientName = reportData.patient_name || 'Patient';
    const chiefComplaint = reportData.chief_complaint || 'N/A';
    const date = reportData.date || new Date().toISOString().split('T')[0];
    const vitals = reportData.vitals?.[0] || {};
    const medications = reportData.medications || [];
    
    // Format assessment and patient signs properly
    const assessment = formatObjectToString(reportData.abc_assessment);
    const patientSigns = formatObjectToString(reportData.patient_signs);
    
    // Build vitals string
    const vitalsList = [];
    if (vitals.bp) vitalsList.push(`• Blood Pressure: ${vitals.bp}`);
    if (vitals.pulse) vitalsList.push(`• Pulse: ${vitals.pulse}`);
    if (vitals.resp) vitalsList.push(`• Respiratory Rate: ${vitals.resp}`);
    if (vitals.temp) vitalsList.push(`• Temperature: ${vitals.temp}`);
    if (vitals.spo2) vitalsList.push(`• SpO2: ${vitals.spo2}`);
    if (vitals.gcs) vitalsList.push(`• GCS: ${vitals.gcs}`);
    if (vitals.pupils) vitalsList.push(`• Pupils: ${vitals.pupils}`);
    
    const vitalsText = vitalsList.length > 0 ? vitalsList.join('\n') : 'Not recorded';
    
    // Build medications string
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
    
    // Create detailed report summary
    const reportSummary = `📋 PATIENT CARE REPORT

👤 Patient: ${patientName}
📅 Date: ${date}

🏥 CHIEF COMPLAINT
${chiefComplaint}

💊 VITALS
${vitalsText}

💉 MEDICATIONS
${medicationsText}

${assessment !== 'N/A' ? `🔍 ASSESSMENT\n${assessment}\n` : ''}
${patientSigns !== 'N/A' ? `📝 PATIENT SIGNS\n${patientSigns}\n` : ''}
---
Generated via Medical Voice Recorder`;

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
        console.error('Failed to copy:', err);
        // Fallback for older browsers
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
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] z-50 
      ${isExpanded 
        ? (view === 'report' ? 'w-[98vw] md:w-[900px] h-[90vh]' : 'w-[95vw] md:w-[500px] h-96') 
        : 'w-[90vw] md:w-[450px] h-16'} 
      bg-zinc-950/95 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden`}>
      
      {/* Interaction Bar (Sticky Top) */}
      <div className="flex items-center justify-between px-3 md:px-5 h-16 min-h-[64px] border-b border-white/5 bg-zinc-950/50">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-3 hover:bg-white/5 active:scale-95 rounded-full transition-all text-zinc-400"
        >
          {isExpanded ? <ChevronDown size={22} /> : <ChevronUp size={22} />}
        </button>

        <div className="flex-1 flex justify-center items-center h-full px-2 overflow-hidden">
          {isRecording ? (
            <canvas ref={canvasRef} width={180} height={32} className="w-full max-w-[180px] h-8" />
          ) : (
            <span className="text-zinc-400 text-sm font-medium tracking-wide">
              {view === 'report' ? 'REPORT PREVIEW' : 'VOICE RECORDER'}
            </span>
          )}
        </div>

        <button 
          onClick={toggleRecording}
          className={`relative p-4 rounded-full transition-all duration-300 active:scale-90
            ${isRecording ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
        >
          {isRecording ? <Square size={20} fill="currentColor" /> : <Mic size={20} />}
        </button>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-0 transition-opacity duration-500 ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        {view === 'recording' ? (
          /* RECORDING VIEW */
          <div className="flex-1 flex flex-col p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Live Transcription</span>
              <span className="text-xs text-blue-400 font-mono bg-blue-400/10 px-2 py-1 rounded">{formatTime(recordingTime)}</span>
            </div>
            
            <div className="flex-1 bg-white/5 rounded-2xl p-5 text-zinc-300 text-sm overflow-y-auto mb-6 border border-white/5 leading-relaxed">
              {transcript || interimTranscript ? (
                <div>
                  <span className="opacity-90">{transcript}</span>
                  <span className="text-zinc-500 italic">{interimTranscript}</span>
                  <span className="inline-block w-1.5 h-4 bg-blue-500 ml-1 animate-pulse align-middle" />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-500 italic tracking-tight">
                  Start speaking to generate content...
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => {setTranscript(''); setInterimTranscript(''); setRecordingTime(0);}} 
                className="flex-1 py-4 rounded-2xl bg-zinc-900 text-zinc-400 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
              >
                <Trash2 size={16} /> Discard
              </button>
              <button
                onClick={handleCreateReport}
                disabled={(!transcript && !isRecording) || loading}
                className="flex-[2] py-4 rounded-2xl bg-blue-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Create Report
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* REPORT PREVIEW VIEW (SCROLLABLE VIEWPORT) */
          <div className="flex-1 flex flex-col overflow-hidden bg-zinc-900/40">
            {/* Sub-header Actions */}
            <div className="px-6 py-3 bg-zinc-950/80 flex justify-between items-center border-b border-white/5">
              <button 
                onClick={() => setView('recording')}
                className="text-xs font-bold text-zinc-500 flex items-center gap-2 hover:text-blue-400 transition-colors uppercase tracking-widest"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <div className="flex gap-2">
                {/* Share Button with Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-xs font-semibold text-zinc-300 hover:bg-white/10 transition-colors border border-white/5"
                  >
                    <Share2 size={14} /> Share
                  </button>
                  
                  {/* Share Menu Dropdown */}
                  {showShareMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-zinc-900 border border-white/10 rounded-lg shadow-xl overflow-hidden z-10">
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

                <button 
                  onClick={handlePrintReport}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 rounded-lg text-xs font-semibold text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
                >
                  <Printer size={14} /> Print Report
                </button>
              </div>
            </div>
            
            {/* Scrollable Report Area */}
            <div className="flex-1 overflow-auto p-4 md:p-10 custom-scrollbar-styling">
              <div className="min-w-fit flex justify-center pb-10">
                <div 
                  ref={reportRef}
                  data-report-container
                  className="bg-white shadow-[0_0_50px_rgba(0,0,0,0.3)] rounded-sm origin-top transition-transform duration-300" 
                  style={{ width: '800px', minWidth: '800px' }}
                >
                  <PatientCareReport 
                    data={reportData} 
                    editable={true} 
                    useHandwriting={true} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close share menu */}
      {showShareMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowShareMenu(false)}
        />
      )}

      <style jsx>{`
        .custom-scrollbar-styling::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar-styling::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .custom-scrollbar-styling::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar-styling::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default RecorderBar;