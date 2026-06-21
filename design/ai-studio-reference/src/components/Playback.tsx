import { useState } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  Settings, 
  Maximize2, 
  FileText, 
  ChevronRight, 
  Download, 
  BadgeHelp,
  Sparkles,
  Clipboard,
  Check,
  RotateCcw,
  Clock
} from "lucide-react";
import { Recording } from "../types";

interface PlaybackProps {
  recording: Recording;
  onBack: () => void;
  onOpenShareModal: (rec: Recording) => void;
}

export default function Playback({ recording, onBack, onOpenShareModal }: PlaybackProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("01:20");
  const [currentProgress, setCurrentProgress] = useState(30); // percents
  const [volume, setVolume] = useState(80);
  const [activeTab, setActiveTab] = useState<"transcript" | "sop">("transcript");
  
  // SOP State
  const [sopMarkdown, setSopMarkdown] = useState<string | null>(null);
  const [loadingSop, setLoadingSop] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Synchronized transcript scrubbing
  const handleTranscriptClick = (time: string) => {
    setCurrentTime(time);
    // Convert time e.g. "01:20" to progress percent
    const [m, s] = time.split(":").map(Number);
    const totalSecs = m * 60 + s;
    // Supposing 300s scale
    const pct = Math.min(100, Math.max(0, (totalSecs / 300) * 100));
    setCurrentProgress(Math.floor(pct));
    setIsPlaying(true);
  };

  const handleGenerateSOP = async () => {
    setLoadingSop(true);
    setActiveTab("sop");
    try {
      const response = await fetch("/api/generate-sop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: recording.title,
          transcript: recording.transcript || []
        })
      });
      const data = await response.json();
      if (data.success) {
        setSopMarkdown(data.sop);
      } else {
        setSopMarkdown("# SOP Generation Failed\nWe couldn't generate the process walkthrough.");
      }
    } catch (err) {
      console.error(err);
      setSopMarkdown("# SOP System Network Error\nUnable to access full stack generation service.");
    } finally {
      setLoadingSop(false);
    }
  };

  const handleCopySOP = () => {
    if (!sopMarkdown) return;
    navigator.clipboard.writeText(sopMarkdown);
    setCopiedLink(true);
    setTimeout(() => {
      setCopiedLink(false);
    }, 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 pb-24 md:pb-8">
      {/* Header Back bar */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-sans font-bold text-[#7B7E6B] dark:text-[#C6C9AB] hover:text-[#1C1D17] dark:hover:text-white cursor-pointer select-none"
        >
          ← Return to recordings feed
        </button>

        <button 
          onClick={() => onOpenShareModal(recording)}
          className="px-4 py-1.5 bg-[#FAFBF7] hover:bg-[#F2F4EB] dark:bg-[#1E2113] dark:hover:bg-[#292B1D] text-xs font-sans font-bold rounded border border-[#D9DCCB] dark:border-[#454932] text-[#1C1D17] dark:text-white cursor-pointer select-none"
        >
          Share video walkthrough
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns (Video Player Column) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#1E2113] border border-[#E9EBE0] dark:border-[#2C2E1F] rounded-xl overflow-hidden shadow-lg">
            
            {/* Player Frame Viewport */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <img 
                src={recording.thumbnail} 
                alt={recording.title} 
                className="w-full h-full object-cover opacity-85"
              />

              {/* Pulsating play bubble in absolute center */}
              {!isPlaying && (
                <button 
                  onClick={() => setIsPlaying(true)}
                  className="absolute p-5 rounded-full bg-[#D2F000] text-[#1C1D17] hover:scale-110 transition-transform shadow-2xl cursor-pointer"
                >
                  <Play className="w-8 h-8 fill-current translate-x-0.5" />
                </button>
              )}

              {/* Viewport controls top overlay */}
              <div className="absolute top-4 left-4 right-4 flex justify-between select-none">
                <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded border border-white/10 text-[10px] font-bold text-white tracking-wider uppercase">
                  {recording.privacy} VIEWING ONLY
                </span>
                <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md rounded text-[10px] text-white/80 font-mono">
                  RES: 2160p Lossless
                </span>
              </div>
            </div>

            {/* Custom Interactive Player Control Tray */}
            <div className="p-4 bg-[#FAFBF7] dark:bg-[#121408] border-t border-[#E9EBE0] dark:border-[#2C2E1F]">
              
              {/* Scrub timeline slider with waveform simulation */}
              <div className="relative flex items-center gap-1.5 h-10 mb-4 select-none">
                {/* Simulated waveforms */}
                <div className="absolute inset-x-0 bottom-2.5 h-6 flex items-end justify-between opacity-20 pointer-events-none">
                  {Array.from({ length: 48 }).map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`w-[4px] rounded-full bg-[#1C1D17] dark:bg-[#D2F000]`}
                      style={{ height: `${Math.sin(idx * 0.2) * 50 + 50}%` }}
                    />
                  ))}
                </div>

                {/* Scrubber path */}
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={currentProgress}
                  onChange={(e) => setCurrentProgress(Number(e.target.value))}
                  className="w-full absolute bottom-1 h-1.5 rounded-lg bg-slate-200 dark:bg-stone-800 accent-[#D2F000] outline-none cursor-pointer"
                />
              </div>

              {/* Action buttons row */}
              <div className="flex justify-between items-center select-none font-sans">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 text-[#1C1D17] dark:text-white hover:text-[#556900] dark:hover:text-[#D2F000] cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                  </button>

                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-[#7B7E6B] dark:text-[#C6C9AB]" />
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-16 h-1 rounded bg-slate-200 dark:bg-stone-800 accent-[#D2F000]"
                    />
                  </div>

                  <div className="text-xs font-mono text-[#7B7E6B] dark:text-[#C6C9AB]">
                    <span>{currentTime}</span>
                    <span className="opacity-50"> / {recording.duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-1.5 py-0.5 bg-[#EAF0DF] dark:bg-[#1B1D10] text-[#1C1D17] dark:text-[#D2F000] border border-[#CBD0B9] dark:border-[#454932] rounded text-[10px] font-bold font-mono">
                    1.0x Speed
                  </span>
                  <Maximize2 className="w-4 h-4 text-[#7B7E6B] dark:text-[#C6C9AB] cursor-pointer" />
                </div>
              </div>

            </div>
          </div>

          {/* Video Overview details */}
          <div className="space-y-2">
            <h1 className="text-xl md:text-2xl font-sans font-bold text-[#1C1D17] dark:text-white leading-tight">
              {recording.title}
            </h1>
            <div className="flex items-center gap-3 text-xs text-[#7B7E6B] dark:text-[#C6C9AB]">
              <span className="font-sans font-medium">Logged in folder "{recording.category}"</span>
              <span>•</span>
              <span>Updated {recording.createdAt}</span>
            </div>
            <p className="text-sm text-[#5C5E54] dark:text-[#C6C9AB] leading-relaxed pt-2">
              {recording.description}
            </p>
          </div>

        </div>

        {/* Right Column (Synchronized Transcripts & SOP Generator) */}
        <div className="lg:col-span-1 flex flex-col h-full bg-white dark:bg-[#1E2113] border border-[#E9EBE0] dark:border-[#2C2E1F] rounded-xl overflow-hidden shadow-md">
          
          {/* Tab switches */}
          <div className="flex border-b border-[#E9EBE0] dark:border-[#2C2E1F]">
            <button 
              onClick={() => setActiveTab("transcript")}
              className={`flex-1 py-3 text-xs font-sans font-bold select-none cursor-pointer ${
                activeTab === "transcript" 
                  ? "border-b-2 border-[#1C1D17] dark:border-[#D2F000] text-[#1C1D17] dark:text-[#D2F000]" 
                  : "text-[#7B7E6B] dark:text-[#C6C9AB] hover:text-[#1C1D17]"
              }`}
            >
              Walkthrough Transcript
            </button>
            <button 
              onClick={() => {
                if (sopMarkdown === null && !loadingSop) {
                  handleGenerateSOP();
                } else {
                  setActiveTab("sop");
                }
              }}
              className={`flex-1 py-3 text-xs font-sans font-bold flex items-center justify-center gap-1.5 select-none cursor-pointer ${
                activeTab === "sop" 
                  ? "border-b-2 border-[#1C1D17] dark:border-[#D2F000] text-[#1C1D17] dark:text-[#D2F000]" 
                  : "text-[#7B7E6B] dark:text-[#C6C9AB] hover:text-[#1C1D17]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D2F000] fill-current" />
              SOP Document
            </button>
          </div>

          {/* Interactive content section */}
          <div className="p-4 flex-1 overflow-y-auto max-h-[420px] font-sans">
            
            {activeTab === "transcript" && (
              <div className="space-y-4">
                <p className="text-[10px] text-[#7B7E6B] dark:text-[#C6C9AB] uppercase tracking-wider font-bold">
                  Click times to jump play scrubber
                </p>

                <div className="space-y-3">
                  {recording.transcript && recording.transcript.map((item, idx) => (
                    <div 
                      key={idx}
                      onClick={() => handleTranscriptClick(item.time)}
                      className="p-2.5 rounded hover:bg-[#F4F6EE] dark:hover:bg-[#292B1D] cursor-pointer transition-colors border border-transparent hover:border-[#D9DCCB] dark:hover:border-transparent group"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-[#D2F000] bg-[#1C1D17] dark:bg-[#121408] px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0">
                          <Clock className="w-2.5 h-2.5" />
                          {item.time}
                        </span>
                        <span className="text-[10px] font-bold text-slate-800 dark:text-neutral-300">
                          {item.speaker || "Speaker 1"}
                        </span>
                      </div>
                      <p className="text-xs text-[#1C1D17] dark:text-[#C6C9AB] leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                  {!recording.transcript && (
                    <p className="text-xs text-[#7B7E6B] dark:text-[#C6C9AB] text-center py-6">
                      No synchronized voice comments located.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "sop" && (
              <div className="space-y-4">
                {loadingSop ? (
                  /* Loading placeholders skeleton code rules */
                  <div className="space-y-4 py-4">
                    <div className="flex items-center gap-2 shrink-0 animate-pulse">
                      <div className="w-3 h-3 bg-[#D2F000] rounded-full shrink-0" />
                      <span className="text-xs text-[#1C1D17] dark:text-white uppercase font-bold">
                        AI Extracting Process Matrix...
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-[#F2F4EB] dark:bg-[#121408] rounded w-3/4 animate-pulse" />
                      <div className="h-3 bg-[#F2F4EB] dark:bg-[#121408] rounded w-full animate-pulse" />
                      <div className="h-3 bg-[#F2F4EB] dark:bg-[#121408] rounded w-5/6 animate-pulse" />
                      <div className="h-4 bg-[#F2F4EB] dark:bg-[#121408] rounded w-1/2 animate-pulse" />
                    </div>
                  </div>
                ) : sopMarkdown ? (
                  /* Generated Markdown output area with checklists */
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-[#E9EBE0] dark:border-[#2C2E1F] pb-3">
                      <span className="text-[10px] text-[#7B7E6B] dark:text-[#C6C9AB] uppercase tracking-wider font-bold">
                        Standard Process Document
                      </span>
                      <div className="flex gap-2">
                        <button 
                          onClick={handleCopySOP}
                          className="px-2 py-1 text-[10px] font-sans font-bold bg-[#F4F6EE] hover:bg-[#ECEFE2] dark:bg-[#121408] dark:hover:bg-[#292B1D] text-[#1C1D17] dark:text-white rounded border border-[#D9DCCB] dark:border-[#454932] flex items-center gap-1 cursor-pointer"
                        >
                          {copiedLink ? (
                            <>
                              <Check className="w-2.5 h-2.5 text-[#D2F000]" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Clipboard className="w-2.5 h-2.5" />
                              Copy Markdown
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Pre-packaged styling for inner generated markdown blocks */}
                    <div className="text-xs text-[#1C1D17] dark:text-[#C6C9AB] space-y-4 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                      {sopMarkdown}
                    </div>
                  </div>
                ) : (
                  /* Unstimulated starting frame folder block */
                  <div className="text-center py-8 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-[#FAFBF7] dark:bg-[#121408] border border-[#D9DCCB] dark:border-[#454932] flex items-center justify-center mx-auto">
                      <FileText className="w-5 h-5 text-[#7B7E6B]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1C1D17] dark:text-white">Generate Process SOP</h4>
                      <p className="text-[11px] text-[#7B7E6B] dark:text-[#C6C9AB] max-w-xs mx-auto mt-1">
                        Extract key milestones, checklists, and actionable task descriptions automatically with smart AI.
                      </p>
                    </div>
                    <button 
                      onClick={handleGenerateSOP}
                      className="px-4 py-2 bg-[#1C1D17] text-[#D2F000] dark:bg-[#D2F000] dark:text-[#191E00] font-sans font-bold text-xs rounded hover:opacity-90 cursor-pointer shadow"
                    >
                      Process with AI
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

          <div className="p-4 bg-[#FAFBF7] dark:bg-[#121408] border-t border-[#E9EBE0] dark:border-[#2C2E1F] flex items-center justify-between text-[11px] text-[#7B7E6B] dark:text-[#C6C9AB] select-none">
            <span>Author: {recording.author || "Alex Chen"}</span>
            <button 
              onClick={handleGenerateSOP}
              className="text-[#D2F000] hover:underline font-bold"
            >
              regenerate SOP document
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
