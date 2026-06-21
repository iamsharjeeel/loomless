import { useState, useEffect } from "react";
import { 
  Square, 
  Mic, 
  MicOff, 
  Camera, 
  Monitor, 
  Layers,
  Pause,
  Play
} from "lucide-react";

interface ViewfinderProps {
  config: {
    source: "screen" | "camera" | "pip";
    quality: string;
    audio: boolean;
    title: string;
  };
  onStopCapture: (elapsedSeconds: number) => void;
}

export default function Viewfinder({ config, onStopCapture }: ViewfinderProps) {
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [audioLevels, setAudioLevels] = useState([12, 10, 4, 18, 25, 14, 8, 16]);

  // Recording timer tick
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
      
      // Randomize audio indicator levels
      if (config.audio) {
        setAudioLevels(prev => prev.map(() => Math.floor(Math.random() * 26) + 4));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, config.audio]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-[#0C0D08] text-white flex flex-col z-50">
      
      {/* Top Meta Status bar */}
      <header className="h-16 px-6 bg-[#16180F] border-b border-[#2C2E1F] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
          <span className="text-xs font-sans font-extrabold tracking-widest text-red-500 uppercase flex items-center gap-1.5">
            ● RECORDING
          </span>
          <span className="text-xs text-[#C6C9AB]/80 border-l border-[#2C2E1F] pl-3 font-sans">
            {config.title}
          </span>
        </div>

        {/* Status flags */}
        <div className="flex items-center gap-4 text-xs text-[#C6C9AB] font-mono">
          <span className="px-2 py-0.5 bg-[#292B1D] text-[#D2F000] border border-[#454932] rounded uppercase text-[10px]">
            {config.quality}
          </span>
          <span>FPS: 60.00</span>
          <span>BPS: 5.4 Mbps</span>
        </div>
      </header>

      {/* Main Viewfinder Monitor */}
      <main className="flex-1 relative bg-neutral-900 overflow-hidden flex items-center justify-center p-4">
        {/* Decorative Camera grid lines */}
        <div className="absolute inset-x-8 inset-y-12 border border-white/5 pointer-events-none grid grid-cols-3 grid-rows-3 select-none">
          <div className="border-r border-b border-white/5" />
          <div className="border-r border-b border-white/5" />
          <div className="border-b border-white/5" />
          <div className="border-r border-b border-white/5" />
          <div className="border-r border-b border-white/5" />
          <div className="border-b border-white/5" />
          <div className="border-r border-white/5" />
          <div className="border-r border-white/5" />
          <div />
        </div>

        {/* Center reticle target indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none select-none">
          <div className="absolute top-1/2 left-0 w-8 h-px bg-white/20 -translate-y-1/2" />
          <div className="absolute top-0 left-1/2 w-px h-8 bg-white/20 -translate-x-1/2" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-white/20" />
        </div>

        {/* Simulated Video Canvas Frame (using high contrast hotlinks) */}
        <div className="w-full max-w-4xl aspect-video rounded-lg overflow-hidden border-2 border-[#D2F000] shadow-2xl relative bg-stone-950">
          
          {config.source === "screen" && (
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8QbWBoZTnvZVGQW-7v_OAun3kCMJMDLZDmZfrXDtJWEO98HTZvEm31Whkdp0p6QxxHaxu-PKvtSId7JLW6BlmyFuFfamiitCWc8D6iZmtwsZXxkdHhNsF8kDG2wxQUM8GblFd1cPKb_5sLEwgaezC35eF83flsYGvCV_Sqq9ec3D6pU5hRbtYnf5uVEWVG9dI6vyhIIucCeC9Q5eiVGKKZvK4yNJvd2zxJN6WuITZ5ziyz6fsqdSTpZGd9beNUGVxVNiW7YdBa0Cd" 
              alt="Simulated Desktop" 
              className="w-full h-full object-cover"
            />
          )}

          {config.source === "camera" && (
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPTaq0NURwEW8WakZoSXlTzu2oI8GhPtAFxyRhaGreVzxV5MOOfR2_T7DuwPmimWIpiz1vlPRoMc2hU5NcNuoS2ZB8UFpAiLGenWd7FvMItkhN00pi4sUg5L2-yvfBX67Wwzwcp7GriaqUhckrDF5avvpmSxSNljsx6LrLXECFFBisSqf0R2hRqPEBme6J6Te5uxA6QlAwOqsAhpVoA4H-OkVRF1TP2h_H96K-j1tDrjjmMHsl3NE4B5bLxq4U_ehSOEfVQPFjAvUZ" 
              alt="Simulated Camera User Walkthrough" 
              className="w-full h-full object-cover"
            />
          )}

          {config.source === "pip" && (
            <div className="relative w-full h-full">
              {/* Desktop background */}
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8QbWBoZTnvZVGQW-7v_OAun3kCMJMDLZDmZfrXDtJWEO98HTZvEm31Whkdp0p6QxxHaxu-PKvtSId7JLW6BlmyFuFfamiitCWc8D6iZmtwsZXxkdHhNsF8kDG2wxQUM8GblFd1cPKb_5sLEwgaezC35eF83flsYGvCV_Sqq9ec3D6pU5hRbtYnf5uVEWVG9dI6vyhIIucCeC9Q5eiVGKKZvK4yNJvd2zxJN6WuITZ5ziyz6fsqdSTpZGd9beNUGVxVNiW7YdBa0Cd" 
                alt="Simulated Desktop" 
                className="w-full h-full object-cover"
              />
              {/* Picture in picture circular Camera */}
              <div className="absolute bottom-4 right-4 w-28 h-28 rounded-full border-2 border-[#D2F000] overflow-hidden shadow-2xl bg-zinc-950">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPTaq0NURwEW8WakZoSXlTzu2oI8GhPtAFxyRhaGreVzxV5MOOfR2_T7DuwPmimWIpiz1vlPRoMc2hU5NcNuoS2ZB8UFpAiLGenWd7FvMItkhN00pi4sUg5L2-yvfBX67Wwzwcp7GriaqUhckrDF5avvpmSxSNljsx6LrLXECFFBisSqf0R2hRqPEBme6J6Te5uxA6QlAwOqsAhpVoA4H-OkVRF1TP2h_H96K-j1tDrjjmMHsl3NE4B5bLxq4U_ehSOEfVQPFjAvUZ" 
                  alt="Simulated Face Camera" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Source indicator tag overlay */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white border border-white/10 px-3 py-1 rounded text-xs flex items-center gap-2">
            {config.source === "screen" && <><Monitor className="w-3.5 h-3.5" /> <span>Desktop Share Only</span></>}
            {config.source === "camera" && <><Camera className="w-3.5 h-3.5" /> <span>Face Camera Capture</span></>}
            {config.source === "pip" && <><Layers className="w-3.5 h-3.5" /> <span>Composite Canvas</span></>}
          </div>

          {/* Moving sound waves bottom tag overlay */}
          {config.audio && (
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-[#D2F000] border border-white/10 px-3 py-1.5 rounded-full text-xs flex items-center gap-3">
              <Mic className="w-4 h-4 text-[#D2F000]" />
              <div className="flex items-end gap-[2px] h-3">
                {audioLevels.map((val, idx) => (
                  <div 
                    key={idx}
                    style={{ height: `${val}%` }}
                    className="w-[3px] bg-[#D2F000] rounded-full transition-all duration-100"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Recording Footer controls HUD panel */}
      <footer className="h-24 bg-[#16180F] border-t border-[#2C2E1F] px-8 flex justify-between items-center">
        
        {/* Left Timer stats */}
        <div className="flex items-center gap-4">
          <div className="text-3xl font-sans font-bold text-center tracking-tight text-white w-24">
            {formatTime(seconds)}
          </div>
          <div className="text-xs text-[#C6C9AB]">
            <span className="font-bold text-[#D2F000]">OUTPUT QUALITY</span>
            <span className="block">{config.quality} Lossless</span>
          </div>
        </div>

        {/* Center Control triggers */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="w-12 h-12 rounded-full bg-[#292B1D] text-[#C6C9AB] hover:text-white flex items-center justify-center border border-[#454932] transition-transform active:scale-95 cursor-pointer"
            title={isPaused ? "Resume Capture" : "Pause Capture"}
          >
            {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
          </button>

          <button 
            onClick={() => onStopCapture(seconds)}
            className="px-6 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95 select-none font-sans font-bold text-xs uppercase cursor-pointer"
            title="Stop & Save Walkthrough"
          >
            <Square className="w-4 h-4 fill-current" />
            Stop Recording
          </button>
        </div>

        {/* Right audio active toggle status */}
        <div className="text-right">
          <span className="text-[10px] uppercase font-sans font-bold text-[#C6C9AB] tracking-widest block">Input channel</span>
          <span className="text-xs font-semibold text-white">{config.audio ? "● Macbook Array Mic" : "✕ Mic Muted"}</span>
        </div>

      </footer>
    </div>
  );
}
