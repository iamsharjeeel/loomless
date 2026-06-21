import { useState, useEffect, FormEvent } from "react";
import { 
  Monitor, 
  Camera, 
  Layers, 
  Mic, 
  Video, 
  Settings, 
  Sliders, 
  Check, 
  HelpCircle,
  Play,
  X
} from "lucide-react";

interface CaptureSetupProps {
  onStartCapture: (config: {
    source: "screen" | "camera" | "pip";
    quality: string;
    audio: boolean;
    title: string;
  }) => void;
  onClose: () => void;
}

export default function CaptureSetup({ onStartCapture, onClose }: CaptureSetupProps) {
  const [source, setSource] = useState<"screen" | "camera" | "pip">("pip");
  const [quality, setQuality] = useState("4K (High Quality)");
  const [micActive, setMicActive] = useState(true);
  const [title, setTitle] = useState("");
  const [countdown, setCountdown] = useState<number | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Warm up countdown simulation
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      onStartCapture({
        source,
        quality,
        audio: micActive,
        title: title.trim() || `Walkthrough Capture - ${new Date().toLocaleTimeString()}`
      });
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white dark:bg-[#1E2113] border border-[#CBD0B9] dark:border-[#454932] rounded-xl w-full max-w-lg shadow-2xl relative overflow-hidden select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Grid Mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(210,240,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(210,240,0,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        {/* Header bar */}
        <div className="p-4 border-b border-[#DCDFCF] dark:border-[#454932] flex justify-between items-center bg-[#FAFBF7] dark:bg-[#121408] relative">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D2F000] animate-pulse"></span>
            <h2 className="font-sans font-bold text-sm tracking-tight text-[#1C1D17] dark:text-white uppercase">
              Configure Video Capture
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-[#7B7E6B] dark:text-[#C6C9AB] hover:text-red-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {countdown === null ? (
          /* Input Parameter Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-6 relative">
            
            {/* Title field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#7B7E6B] dark:text-[#C6C9AB]">
                Walkthrough Document Title
              </label>
              <input 
                type="text" 
                placeholder="e.g. Design Walkthrough, Onboarding Review V2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded bg-[#F4F6EE] dark:bg-[#121408] border border-[#CBD0B9] dark:border-[#454932] text-[#1C1D17] dark:text-white outline-none focus:border-[#D2F000] focus:ring-1 focus:ring-[#D2F000]"
              />
            </div>

            {/* Video Source Cards */}
            <div className="space-y-2">
              <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#7B7E6B] dark:text-[#C6C9AB]">
                Capture feed source
              </label>
              <div className="grid grid-cols-3 gap-3">
                {/* Screen only */}
                <button 
                  type="button"
                  onClick={() => setSource("screen")}
                  className={`p-3 rounded-lg border flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer ${
                    source === "screen" 
                      ? "bg-[#1C1D17] text-white dark:bg-[#D2F000] dark:text-[#1E2113] border-[#1C1D17] dark:border-[#D2F000] shadow"
                      : "bg-[#FDFEFA] dark:bg-[#16180B] border-[#D9DCCB] dark:border-[#2C2E1F] text-[#454932] dark:text-[#C6C9AB] hover:border-[#1C1D17]"
                  }`}
                >
                  <Monitor className="w-5 h-5" />
                  <span className="text-[10px] font-sans font-semibold">Desktop</span>
                </button>

                {/* Camera only */}
                <button 
                  type="button"
                  onClick={() => setSource("camera")}
                  className={`p-3 rounded-lg border flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer ${
                    source === "camera" 
                      ? "bg-[#1C1D17] text-white dark:bg-[#D2F000] dark:text-[#1E2113] border-[#1C1D17] dark:border-[#D2F000] shadow"
                      : "bg-[#FDFEFA] dark:bg-[#16180B] border-[#D9DCCB] dark:border-[#2C2E1F] text-[#454932] dark:text-[#C6C9AB] hover:border-[#1C1D17]"
                  }`}
                >
                  <Camera className="w-5 h-5" />
                  <span className="text-[10px] font-sans font-semibold">Camera POV</span>
                </button>

                {/* PIP Screen + Cam */}
                <button 
                  type="button"
                  onClick={() => setSource("pip")}
                  className={`p-3 rounded-lg border flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer ${
                    source === "pip" 
                      ? "bg-[#1C1D17] text-white dark:bg-[#D2F000] dark:text-[#1E2113] border-[#1C1D17] dark:border-[#D2F000] shadow"
                      : "bg-[#FDFEFA] dark:bg-[#16180B] border-[#D9DCCB] dark:border-[#2C2E1F] text-[#454932] dark:text-[#C6C9AB] hover:border-[#1C1D17]"
                  }`}
                >
                  <Layers className="w-5 h-5" />
                  <span className="text-[10px] font-sans font-semibold">Desktop + PIP</span>
                </button>
              </div>
            </div>

            {/* Sub-parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Quality parameter */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#7B7E6B] dark:text-[#C6C9AB]">
                  Recorded Quality
                </label>
                <select 
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full text-xs bg-[#F4F6EE] dark:bg-[#121408] border border-[#CBD0B9] dark:border-[#454932] text-[#1C1D17] dark:text-white px-3 py-1.5 rounded outline-none"
                >
                  <option>4K Ultra (240fps)</option>
                  <option>1080p HD (60fps)</option>
                  <option>720p Mobile Quick</option>
                </select>
              </div>

              {/* Mic audio parameter */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#7B7E6B] dark:text-[#C6C9AB]">
                  Audio input
                </label>
                <button 
                  type="button"
                  onClick={() => setMicActive(!micActive)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded border text-xs cursor-pointer transition-colors ${
                    micActive 
                      ? "bg-[#ECEFE2] text-[#556900] dark:bg-[#1F2113] dark:text-[#D2F000] border-[#9AA572] dark:border-[#454932]" 
                      : "bg-[#F4F6EE] text-[#7B7E6B] dark:bg-[#121408] dark:text-[#C6C9AB] border-[#CBD0B9] dark:border-[#454932]/70"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Mic className="w-3.5 h-3.5" />
                    <span>{micActive ? "Macbook Array Mic" : "Mic Muted"}</span>
                  </div>
                  {micActive && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>

            </div>

            {/* Footer warning info */}
            <div className="p-3 rounded bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border border-amber-250 dark:border-amber-950/30 text-[10px] space-y-0.5">
              <span className="font-bold uppercase block">Iframe notice:</span>
              <span>Loomless will simulate video and SOP capture pipeline in the sandboxed preview screen perfectly. Ensure you grant mic permissions to verify audio indicators.</span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4 border-t border-[#DCDFCF] dark:border-[#454932]">
              <button 
                type="button"
                onClick={onClose}
                className="w-1/2 py-2.5 text-xs font-sans text-center rounded bg-slate-100 hover:bg-slate-200 dark:bg-[#292B1D] text-slate-800 dark:text-white cursor-pointer select-none"
              >
                Cancel setup
              </button>
              <button 
                type="submit"
                className="w-1/2 py-2.5 bg-[#1C1D17] text-[#D2F000] dark:bg-[#D2F000] dark:text-[#2C3400] text-xs font-sans font-bold rounded flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg transition-shadow select-none"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Start Capture
              </button>
            </div>

          </form>
        ) : (
          /* Warm-up Countdown display overlay */
          <div className="p-12 flex flex-col items-center justify-center space-y-6 bg-gradient-to-b from-[#FAFBF7] to-white dark:from-[#1E2113] dark:to-[#121408]">
            <div className="relative flex items-center justify-center w-28 h-28">
              {/* Circular expanding glow rings */}
              <div className="absolute inset-0 rounded-full border border-[#D2F000]/60 dark:border-[#D2F000]/20 animate-ping" />
              <div className="absolute inset-3 rounded-full border border-[#D2F000]/80 dark:border-[#D2F000]/40 animate-pulse" />
              
              <div className="w-20 h-20 rounded-full bg-[#1C1D17] dark:bg-[#D2F000] text-[#D2F000] dark:text-[#1C1D17] flex items-center justify-center font-sans font-extrabold text-4xl shadow-xl border border-[#D2F000]/30 select-none">
                {countdown}
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="font-sans font-bold text-base text-[#1C1D17] dark:text-white uppercase tracking-wider">
                System prep sequence
              </h3>
              <p className="text-xs text-[#7B7E6B] dark:text-[#C6C9AB] mt-1">
                Warming workspace viewport canvas... Please don't hide browser.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
