import { useState } from "react";
import { 
  Video, 
  Search, 
  SlidersHorizontal, 
  Clock, 
  User, 
  Trash2, 
  Eye, 
  MoreVertical, 
  Share2, 
  Lock, 
  Globe 
} from "lucide-react";
import { Recording } from "../types";

interface DashboardProps {
  recordings: Recording[];
  onSelectVideo: (rec: Recording) => void;
  onDeleteVideo: (id: string) => void;
  onOpenShareModal: (rec: Recording) => void;
  toggleConfigModal: () => void;
}

export default function Dashboard({
  recordings,
  onSelectVideo,
  onDeleteVideo,
  onOpenShareModal,
  toggleConfigModal
}: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "personal" | "shared">("all");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Filter & Search Logic
  const filtered = recordings.filter(rec => {
    const matchesSearch = rec.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          rec.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === "personal") {
      return matchesSearch && rec.category === "Personal";
    }
    if (activeFilter === "shared") {
      return matchesSearch && rec.category === "Team Shared";
    }
    return matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 pb-24 md:pb-8">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-sans font-bold text-[#1C1D17] dark:text-[#FFFFFF] tracking-tight">
            Recent Recordings
          </h1>
          <p className="text-xs md:text-sm text-[#7B7E6B] dark:text-[#C6C9AB]">
            View and manage your logged walkthroughs, transcribes, and SOP exports.
          </p>
        </div>
        
        {/* Quick Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative flex-grow md:flex-grow-0 w-full md:w-64">
            <Search className="w-4 h-4 text-[#7B7E6B] dark:text-[#C6C9AB] absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search workspaces..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm rounded bg-white dark:bg-[#1E2113] border border-[#D9DCCB] dark:border-[#454932] text-[#1C1D17] dark:text-[#E3E4CE] dark:placeholder-[#C6C9AB]/60 focus:border-[#D2F000] focus:ring-1 focus:ring-[#D2F000] outline-none"
            />
          </div>

          {/* Quick Category filter buttons */}
          <div className="flex bg-[#EAF0DF] dark:bg-[#1B1D10] p-1 rounded border border-[#D9DCCB] dark:border-[#454932]">
            <button 
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1 text-xs font-sans rounded select-none cursor-pointer ${
                activeFilter === "all" ? "bg-white dark:bg-[#292B1D] text-[#1C1D17] dark:text-[#D2F000] font-medium shadow-sm" : "text-[#7B7E6B] dark:text-[#C6C9AB]"
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setActiveFilter("personal")}
              className={`px-3 py-1 text-xs font-sans rounded select-none cursor-pointer ${
                activeFilter === "personal" ? "bg-white dark:bg-[#292B1D] text-[#1C1D17] dark:text-[#D2F000] font-medium shadow-sm" : "text-[#7B7E6B] dark:text-[#C6C9AB]"
              }`}
            >
              Personal
            </button>
            <button 
              onClick={() => setActiveFilter("shared")}
              className={`px-3 py-1 text-xs font-sans rounded select-none cursor-pointer ${
                activeFilter === "shared" ? "bg-white dark:bg-[#292B1D] text-[#1C1D17] dark:text-[#D2F000] font-medium shadow-sm" : "text-[#7B7E6B] dark:text-[#C6C9AB]"
              }`}
            >
              Shared
            </button>
          </div>
        </div>
      </div>

      {/* Grid Content / Bento Card Feed */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((rec, i) => {
            // Check if this is the giant highlighted item (index 0 when un-filtered)
            const isFeatured = i === 0 && searchQuery === "" && activeFilter === "all";
            
            return (
              <div 
                key={rec.id}
                className={`group bg-white dark:bg-[#1A1A1A] border border-[#E9EBE0] dark:border-[#2A2A2A] rounded-lg overflow-hidden flex flex-col relative transition-all duration-300 hover:border-[#D2F000] shadow-sm select-none ${
                  isFeatured ? "md:col-span-2 lg:col-span-2" : ""
                }`}
              >
                {/* Visual Thumbnail */}
                <div 
                  onClick={() => onSelectVideo(rec)}
                  className={`relative w-full overflow-hidden bg-[#ECEFE2] dark:bg-[#222222] cursor-pointer ${
                    isFeatured ? "aspect-video" : "aspect-video"
                  }`}
                >
                  <img 
                    src={rec.thumbnail} 
                    alt={rec.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />

                  {/* Play Action Hover overlay indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-[#1C1D17]/90 dark:bg-[#D2F000]/95 text-[#D2F000] dark:text-[#191E00] flex items-center justify-center scale-90 group-hover:scale-100 transition-transform shadow-lg backdrop-blur-xs">
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>

                  {/* Status Badges Overlay */}
                  <div className="absolute top-2 left-2 flex gap-2">
                    {rec.isNew && (
                      <span className="bg-[#1C1D17] text-white dark:bg-[#D2F000] dark:text-[#2C3400] text-[9px] font-sans font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">
                        NEW
                      </span>
                    )}
                    {rec.isHd && (
                      <span className="bg-[#E7ECC2] text-[#556900] dark:bg-[#343627] dark:text-[#D2F000] text-[9px] font-sans font-bold px-1.5 py-0.5 rounded tracking-wider border border-[#D0DAAA] dark:border-[#454932]">
                        HD
                      </span>
                    )}
                    {rec.privacy === "live" && (
                      <span className="bg-red-600 text-white text-[9px] font-sans font-bold px-1.5 py-0.5 rounded tracking-wider uppercase animate-pulse flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-white"></span>
                        LIVE
                      </span>
                    )}
                  </div>

                  {/* Recording Time Duration Tag */}
                  <div className="absolute bottom-2.5 right-2.5 bg-black/85 text-xs text-white px-1.5 py-0.5 rounded font-mono border border-white/10 select-none">
                    {rec.duration}
                  </div>
                </div>

                {/* Video Info Descriptor */}
                <div className="p-4 flex flex-col flex-grow relative">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 
                      onClick={() => onSelectVideo(rec)}
                      className={`font-sans font-semibold text-[#1C1D17] dark:text-white cursor-pointer hover:text-[#8D9B00] dark:hover:text-[#D2F000] transition-colors truncate-2-lines leading-snug select-none ${
                        isFeatured ? "text-base md:text-lg" : "text-sm"
                      }`}
                    >
                      {rec.title}
                    </h3>

                    {/* Options context menu */}
                    <div className="relative shrink-0">
                      <button 
                        onClick={() => setMenuOpenId(menuOpenId === rec.id ? null : rec.id)}
                        className="text-[#7B7E6B] dark:text-[#C6C9AB] hover:text-[#1C1D17] dark:hover:text-[#FFFFFF] p-1 rounded-full hover:bg-[#EAF0DF] dark:hover:bg-[#292B1D] cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {menuOpenId === rec.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-30" 
                            onClick={() => setMenuOpenId(null)}
                          />
                          <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-[#1E2113] border border-[#D9DCCB] dark:border-[#454932] rounded-lg shadow-xl z-40 py-1 font-sans text-xs">
                            <button 
                              onClick={() => {
                                onOpenShareModal(rec);
                                setMenuOpenId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-[#1C1D17] dark:text-[#E3E4CE] hover:bg-[#F2F4EB] dark:hover:bg-[#292B1D] flex items-center gap-2 cursor-pointer"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              Share link
                            </button>
                            <button 
                              onClick={() => {
                                onDeleteVideo(rec.id);
                                setMenuOpenId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-red-600 dark:text-red-400 hover:bg-[#FDF2F2] dark:hover:bg-red-950/20 flex items-center gap-2 font-medium cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete video
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {rec.description && (
                    <p className={`text-xs text-[#5C5E54] dark:text-[#C6C9AB] select-none mb-4 ${
                      isFeatured ? "line-clamp-2 md:line-clamp-3" : "line-clamp-2"
                    }`}>
                      {rec.description}
                    </p>
                  )}

                  {/* Metadata bottom row */}
                  <div className="mt-auto flex justify-between items-center pt-2 border-t border-[#E9EBE0] dark:border-[#2A2A2A] text-[11px] text-[#7B7E6B] dark:text-[#C6C9AB]">
                    <div className="flex items-center gap-2 min-w-0">
                      {rec.authorAvatar ? (
                        <div className="w-5 h-5 rounded-full border border-[#D9DCCB] dark:border-[#454932] overflow-hidden shrink-0">
                          <img src={rec.authorAvatar} alt="Author" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-[#E5ECD7] dark:bg-[#292B1D] text-[#5C5E54] dark:text-white flex items-center justify-center shrink-0">
                          <User className="w-3 h-3" />
                        </div>
                      )}
                      <span className="truncate font-sans font-medium">{rec.author || "Anonymous"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>{rec.createdAt}</span>
                      
                      {rec.privacy === "locked" ? (
                        <Lock className="w-3 h-3 text-[#7B7E6B] dark:text-[#C6C9AB]" title="Private Video" />
                      ) : (
                        <Globe className="w-3 h-3 text-[#D2F000]" title="Shared Publicly" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Dynamic SVG Empty State Container */
        <div className="flex flex-col items-center justify-center py-16 px-4 max-w-md mx-auto text-center">
          <div className="w-24 h-24 mb-6 relative flex items-center justify-center">
            {/* Ambient Background Aura */}
            <div className="absolute inset-0 bg-[#D2F000]/10 dark:bg-[#D2F000]/5 rounded-full blur-xl scale-125" />
            
            {/* Custom precise mechanical target path indicator rendering */}
            <div className="relative w-16 h-16 rounded-full bg-white dark:bg-[#1E2113] border border-[#D9DCCB] dark:border-[#454932] flex items-center justify-center shadow-md">
              <Video className="w-7 h-7 text-[#1C1D17] dark:text-[#D2F000]" />
            </div>
            
            <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-red-600 border border-white" />
          </div>

          <h2 className="text-xl font-sans font-bold text-[#1C1D17] dark:text-white mb-2">
            No Recordings Found
          </h2>
          
          <p className="text-sm text-[#7B7E6B] dark:text-[#C6C9AB] mb-6">
            We couldn't find any recorded clips matching "{searchQuery}" in our local indexed history storage database.
          </p>
          
          {searchQuery ? (
            <button 
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
              }}
              className="px-4 py-2 border border-[#909378] dark:border-[#454932] text-xs font-sans rounded hover:bg-slate-100 dark:hover:bg-[#292B1D] text-[#1C1D17] dark:text-white cursor-pointer select-none"
            >
              Clear search filter
            </button>
          ) : (
            <button 
              onClick={toggleConfigModal}
              className="px-6 py-3 bg-[#1C1D17] text-[#D2F000] dark:bg-[#D2F000] dark:text-[#2C3400] text-sm font-sans font-semibold rounded-lg hover:opacity-90 active:scale-95 transition-transform flex items-center gap-2 cursor-pointer shadow-md select-none"
            >
              <Video className="w-4 h-4 fill-current" />
              Start Your First Recording
            </button>
          )}
        </div>
      )}

      {/* Floating Action Button for recording (desktop only, bottom-right) */}
      <button 
        onClick={toggleConfigModal}
        className="hidden md:flex fixed bottom-8 right-8 z-50 bg-[#1C1D17] dark:bg-[#D2F000] text-[#D2F000] dark:text-[#191E00] hover:scale-105 active:scale-95 px-6 py-4 rounded-full items-center gap-3 shadow-xl transition-all border border-[#909378] dark:border-transparent font-sans font-bold tracking-wider text-sm select-none cursor-pointer"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse inline-block"></span>
        NEW RECORD
      </button>
    </div>
  );
}
