import { 
  User, 
  Crown, 
  Layers, 
  CreditCard, 
  CheckCircle, 
  Zap, 
  Video, 
  FileText, 
  Database,
  ArrowUpRight
} from "lucide-react";
import { UserProfile } from "../types";

interface ProfileProps {
  profile: UserProfile;
}

export default function Profile({ profile }: ProfileProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 pb-24 md:pb-8 space-y-8 select-none">
      
      {/* Top Identity Block Card */}
      <div className="bg-white dark:bg-[#1E2113] p-6 rounded-lg border border-[#E9EBE0] dark:border-[#2C2E1F] shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
        
        {/* Background glow strip logo */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-[#D2F000]/5 dark:bg-[#D2F000]/10 [clip-path:polygon(40px_0%,100%_0%,100%_100%,0%_100%)] pointer-events-none" />

        {/* Avatar */}
        <div className="w-20 h-20 rounded-full border-2 border-[#D2F000] overflow-hidden shrink-0 shadow-lg relative">
          <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute bottom-0 right-0 bg-[#D2F000] text-[#1C1D17] p-0.5 rounded-full border border-white">
            <Crown className="w-3.5 h-3.5 text-[#1C1D17] fill-current" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center md:text-left space-y-1 z-10 flex-1">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <h2 className="text-xl font-sans font-bold text-[#1C1D17] dark:text-white">{profile.displayName}</h2>
            <span className="bg-[#1C1D17] text-[#D2F000] dark:bg-[#D2F000] dark:text-[#2C3400] text-[9px] font-sans font-bold px-2 py-0.5 rounded tracking-wider uppercase">
              PRO USER LICENSE
            </span>
          </div>
          <p className="text-xs text-[#7B7E6B] dark:text-[#C6C9AB] font-mono">{profile.email}</p>
          <p className="text-xs text-[#1C1D17] dark:text-neutral-300 font-sans pt-1">
            Role: <span className="font-semibold">{profile.role}</span> under <span className="font-semibold">{profile.activeWorkspace}</span>
          </p>
        </div>
      </div>

      {/* Plan & Usage telemetry counters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Storage card */}
        <div className="bg-white dark:bg-[#1A1A1A] p-5 rounded-lg border border-[#E9EBE0] dark:border-[#2A2A2A] shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-sans font-bold text-[#7B7E6B] dark:text-[#C6C9AB] uppercase tracking-wider">Cloud Storage</span>
              <Database className="w-4 h-4 text-[#7B7E6B]" />
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-sans font-bold text-[#1C1D17] dark:text-white">
                4.2 GB <span className="text-xs font-normal text-[#7B7E6B]">/ 500 GB</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-[#FAFBF7] dark:bg-stone-800">
                <div className="h-1.5 rounded-full bg-[#D2F000]" style={{ width: "3.5%" }} />
              </div>
            </div>
          </div>
          
          <div className="text-[10px] text-[#7B7E6B] pt-4">Workspace uses 0.8% of allotted premium quotas.</div>
        </div>

        {/* Recording minutes */}
        <div className="bg-white dark:bg-[#1A1A1A] p-5 rounded-lg border border-[#E9EBE0] dark:border-[#2A2A2A] shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-sans font-bold text-[#7B7E6B] dark:text-[#C6C9AB] uppercase tracking-wider">WALKTHROUGHS TIME</span>
              <Video className="w-4 h-4 text-[#7B7E6B]" />
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-sans font-bold text-[#1C1D17] dark:text-white">
                128 mins <span className="text-xs font-normal text-[#7B7E6B]">/ Unlimited</span>
              </div>
              
              <div className="w-full h-1.5 rounded-full bg-[#FAFBF7] dark:bg-stone-800">
                <div className="h-1.5 rounded-full bg-[#D2F000]" style={{ width: "25%" }} />
              </div>
            </div>
          </div>
          
          <div className="text-[10px] text-[#7B7E6B] pt-4">No recording duration restrictions applied.</div>
        </div>

        {/* SOP Extractions */}
        <div className="bg-white dark:bg-[#1A1A1A] p-5 rounded-lg border border-[#E9EBE0] dark:border-[#2A2A2A] shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-sans font-bold text-[#7B7E6B] dark:text-[#C6C9AB] uppercase tracking-wider">AI SOP PROCEDURES</span>
              <FileText className="w-4 h-4 text-[#7B7E6B]" />
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-sans font-bold text-[#1C1D17] dark:text-white">
                24 SOPs <span className="text-xs font-normal text-[#7B7E6B]">/ 500 Month</span>
              </div>
              
              <div className="w-full h-1.5 rounded-full bg-[#FAFBF7] dark:bg-stone-800">
                <div className="h-1.5 rounded-full bg-[#D2F000]" style={{ width: "4.8%" }} />
              </div>
            </div>
          </div>
          
          <div className="text-[10px] text-[#7B7E6B] pt-4">Extraction limits reset on 1st of next month.</div>
        </div>

      </div>

      {/* Workspace switcher & Bill plans */}
      <div className="bg-[#FAFBF7] dark:bg-[#1E2113] p-6 rounded-lg border border-[#D9DCCB] dark:border-[#2C2E1F] shadow-sm">
        <h3 className="text-xs font-sans font-bold text-[#1C1D17] dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#D2F000]" />
          Loomless Subscription Status
        </h3>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="text-sm font-semibold text-[#1C1D17] dark:text-neutral-200">
              Loomless Pro Workspace Plan — $19/mo (Active)
            </div>
            <p className="text-xs text-[#7B7E6B] dark:text-[#C6C9AB]">
              Auto-billed next on July 1st, 2026. Card ending in •••• 4242.
            </p>
          </div>

          <button 
            type="button"
            className="px-4 py-2 bg-[#1C1D17] text-[#D2F000] dark:bg-[#D2F000] dark:text-[#2C3400] text-xs font-sans font-bold rounded flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer shadow whitespace-nowrap"
          >
            Upgrade workspace quotas
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
