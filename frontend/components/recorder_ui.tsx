"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, ChevronUp, ChevronDown, Trash2, Send, ArrowLeft, Printer, Save } from 'lucide-react';
import PatientCareReport from '@/components/patient_record/record_doc';

type ViewState = 'recording' | 'report';

const RecorderBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [view, setView] = useState<ViewState>('recording');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  
  // Local state for the report data
  const [reportData, setReportData] = useState<any>({
    chief_complaint: "",
    vitals: [{}],
    medications: [{}],
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationIdRef = useRef<number>();
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleCreateReport = () => {
    setReportData((prev: any) => ({
        ...prev,
        chief_complaint: transcript,
        date: new Date().toISOString().split('T')[0]
    }));
    setView('report');
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
                disabled={!transcript && !isRecording}
                className="flex-[2] py-4 rounded-2xl bg-blue-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} /> Create Report
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
                <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-xs font-semibold text-zinc-300 hover:bg-white/10 transition-colors border border-white/5"
                >
                    <Printer size={14} /> Print Report
                </button>
            </div>
            
            {/* THE FIX: Horizontal and Vertical Scroll Area */}
            <div className="flex-1 overflow-auto p-4 md:p-10 custom-scrollbar-styling">
                {/* min-w-fit prevents the flex child from shrinking below its natural size */}
                <div className="min-w-fit flex justify-center pb-10">
                    {/* Fixed width container ensures the report looks like a standard A4/Letter page */}
                    <div className="bg-white shadow-[0_0_50px_rgba(0,0,0,0.3)] rounded-sm origin-top transition-transform duration-300" 
                         style={{ width: '800px', minWidth: '800px' }}>
                        <PatientCareReport 
                            data={reportData} 
                            editable={true} 
                            useHandwriting={true} 
                        />
                    </div>
                </div>
            </div>

            {/* Sticky Footer */}
            <div className="p-4 bg-zinc-950 border-t border-white/10 flex gap-3">
                <button 
                    onClick={() => setIsExpanded(false)}
                    className="flex-1 py-4 rounded-2xl bg-white text-black text-sm font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow-xl"
                >
                    <Save size={18} /> Save & Finalize
                </button>
            </div>
          </div>
        )}
      </div>

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