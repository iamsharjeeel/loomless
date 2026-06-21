import { useState } from "react";
import { 
  X, 
  Copy, 
  Check, 
  Globe, 
  Lock, 
  Calendar, 
  CheckCircle2,
  LockKeyhole
} from "lucide-react";
import { Recording } from "../types";

interface ShareModalProps {
  recording: Recording;
  onClose: () => void;
}

export default function ShareModal({ recording, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [expiry, setExpiry] = useState("7 Days (Standard)");
  const [passwordRequired, setPasswordRequired] = useState(false);
  
  // Custom mock URL referencing applet architecture
  const shareUrl = `${window.location.origin}/share/video/${recording.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-55">
      <div 
        className="bg-white dark:bg-[#1E2113] border border-[#CBD0B9] dark:border-[#454932] rounded-xl w-full max-w-md shadow-2xl relative overflow-hidden select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="p-4 border-b border-[#DCDFCF] dark:border-[#454932] flex justify-between items-center bg-[#FAFBF7] dark:bg-[#121408]">
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-[#D2F000]" />
            <h2 className="font-sans font-bold text-sm tracking-tight text-[#1C1D17] dark:text-white uppercase">
              Configure share options
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-[#7B7E6B] dark:text-[#C6C9AB] hover:text-red-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal content body */}
        <div className="p-6 space-y-6 relative">
          
          <div className="space-y-1">
            <span className="text-[10px] text-[#7B7E6B] dark:text-[#C6C9AB] uppercase font-bold tracking-wider">WALKTHROUGHS SOURCE</span>
            <h3 className="font-sans font-bold text-sm text-[#1C1D17] dark:text-white truncate">
              {recording.title}
            </h3>
          </div>

          {/* Share URL input element */}
          <div className="space-y-1.5 pt-2">
            <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#7B7E6B] dark:text-[#C6C9AB]">
              Shared video link
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 text-xs bg-[#F4F6EE] dark:bg-[#121408] border border-[#CBD0B9] dark:border-[#454932] text-[#5C5E54] dark:text-[#C6C9AB] rounded outline-none font-mono select-all"
              />
              <button 
                onClick={handleCopy}
                className="px-3.5 bg-[#1C1D17] text-[#D2F000] dark:bg-[#D2F000] dark:text-[#191E00] font-sans font-bold text-xs rounded hover:opacity-90 flex items-center justify-center gap-1 cursor-pointer select-none"
              >
                {copied ? <Check className="w-3.5 h-3.5 shrink-0 text-[#D2F000] dark:text-[#191E00]" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            {copied && (
              <span className="text-[10px] font-bold text-green-605 dark:text-green-400 block font-sans">
                ✓ Recorded link saved to your clipboard buffer!
              </span>
            )}
          </div>

          {/* Expiration selection */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            
            <div className="space-y-1.5">
              <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-[#7B7E6B] dark:text-[#C6C9AB] flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Expiration
              </label>
              <select 
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full text-xs bg-[#F4F6EE] dark:bg-[#121408] border border-[#CBD0B9] dark:border-[#454932] text-[#1C1D17] dark:text-white px-2 py-1.5 rounded outline-none"
              >
                <option>7 Days (Standard)</option>
                <option>30 Days Pro Expiry</option>
                <option>Unlimited (Never)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-[#7B7E6B] dark:text-[#C6C9AB] flex items-center gap-1">
                <LockKeyhole className="w-3 h-3" />
                Access lock
              </label>
              <button 
                type="button"
                onClick={() => setPasswordRequired(!passwordRequired)}
                className={`w-full text-left px-3 py-1.5 bg-[#F4F6EE] dark:bg-[#121408] border border-[#CBD0B9] dark:border-[#454932] text-xs text-[#1C1D17] dark:text-white rounded outline-none flex justify-between items-center cursor-pointer ${
                  passwordRequired ? "bg-[#ECEFE2] text-[#556900] dark:bg-[#1F2113] dark:text-[#D2F000]" : ""
                }`}
              >
                <span>{passwordRequired ? "Password Protect" : "Open Access"}</span>
                <span className="text-[9px] opacity-75">{passwordRequired ? "ON" : "OFF"}</span>
              </button>
            </div>

          </div>

          {/* Actions Bottom section */}
          <div className="pt-4 border-t border-[#DCDFCF] dark:border-[#454932]">
            <button 
              onClick={onClose}
              className="w-full py-2.5 bg-[#1C1D17] text-[#D2F000] dark:bg-[#D2F000] dark:text-[#2C3400] text-xs font-sans font-bold rounded flex items-center justify-center cursor-pointer shadow select-none"
            >
              Verify & Complete Share
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
