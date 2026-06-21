import { useState, FormEvent } from "react";
import { 
  Folder, 
  FolderPlus, 
  Grid, 
  List, 
  Eye, 
  Trash2, 
  Share2, 
  MessageSquare, 
  Lock, 
  FileVideo,
  ChevronRight
} from "lucide-react";
import { Recording } from "../types";

interface LibraryProps {
  recordings: Recording[];
  onSelectVideo: (rec: Recording) => void;
  onDeleteVideo: (id: string) => void;
  onOpenShareModal: (rec: Recording) => void;
}

export default function Library({
  recordings,
  onSelectVideo,
  onDeleteVideo,
  onOpenShareModal
}: LibraryProps) {
  const [activeFolder, setActiveFolder] = useState<"all" | "personal" | "team">("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [folders, setFolders] = useState([
    { id: "personal", name: "Personal Walks", count: 4, type: "personal" },
    { id: "team", name: "Shared SOP Syncs", count: 2, type: "team" }
  ]);
  const [newFolderName, setNewFolderName] = useState("");
  const [showAddFolder, setShowAddFolder] = useState(false);

  // Filter recordings by selected folder
  const filtered = recordings.filter(rec => {
    if (activeFolder === "personal") return rec.category === "Personal";
    if (activeFolder === "team") return rec.category === "Team Shared";
    return true;
  });

  const handleAddFolder = (e: FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    setFolders([
      ...folders,
      {
        id: "folder-" + Date.now(),
        name: newFolderName,
        count: 0,
        type: "personal"
      }
    ]);
    setNewFolderName("");
    setShowAddFolder(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 pb-24 md:pb-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-sans font-bold text-[#1C1D17] dark:text-white tracking-tight">
            Document Library
          </h1>
          <p className="text-xs md:text-sm text-[#7B7E6B] dark:text-[#C6C9AB]">
            Organize recordings into spaces and categorize Standard Operating Procedures.
          </p>
        </div>

        {/* View mode toggle triggers */}
        <div className="flex items-center gap-2">
          <div className="flex bg-[#EAF0DF] dark:bg-[#1B1D10] p-1 rounded border border-[#D9DCCB] dark:border-[#454932]">
            <button 
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded cursor-pointer ${
                viewMode === "list" ? "bg-white dark:bg-[#292B1D] text-[#1C1D17] dark:text-[#D2F000]" : "text-[#7B7E6B] dark:text-[#C6C9AB]"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded cursor-pointer ${
                viewMode === "grid" ? "bg-white dark:bg-[#292B1D] text-[#1C1D17] dark:text-[#D2F000]" : "text-[#7B7E6B] dark:text-[#C6C9AB]"
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Structural row: Folders on Left, Entries on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: Folder Tree Management */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-[#1E2113] p-4 rounded-lg border border-[#E9EBE0] dark:border-[#292C1D] shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <span className="font-sans font-bold text-xs uppercase tracking-wider text-[#7B7E6B] dark:text-[#C6C9AB]">
                Workspaces folders
              </span>
              <button 
                onClick={() => setShowAddFolder(!showAddFolder)}
                className="text-[#5C5E54] dark:text-[#C6C9AB] hover:text-[#D2F000] p-1 rounded-md"
                title="Create Folder"
              >
                <FolderPlus className="w-4 h-4" />
              </button>
            </div>

            {showAddFolder && (
              <form onSubmit={handleAddFolder} className="mb-4 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Folder name..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-[#121408] border border-[#D9DCCB] dark:border-[#454932] text-[#1C1D17] dark:text-white outline-none"
                  autoFocus
                />
                <button 
                  type="submit"
                  className="bg-[#1C1D17] text-[#D2F000] dark:bg-[#D2F000] dark:text-[#2C3400] text-xs px-2 py-1 rounded font-bold cursor-pointer"
                >
                  Add
                </button>
              </form>
            )}

            {/* Folder Rows */}
            <div className="space-y-1">
              <button 
                onClick={() => setActiveFolder("all")}
                className={`w-full text-left px-3 py-2 text-xs font-sans rounded-md flex items-center justify-between cursor-pointer ${
                  activeFolder === "all" ? "bg-[#1C1D17] text-white dark:bg-[#D2F000] dark:text-[#2C3400] font-bold" : "text-[#1C1D17] dark:text-[#C6C9AB] hover:bg-[#F2F4EB] dark:hover:bg-[#292B1D]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Folder className="w-3.5 h-3.5" />
                  <span>All Documents</span>
                </div>
                <span className="text-[10px] opacity-75">{recordings.length}</span>
              </button>

              {folders.map(f => (
                <button 
                  key={f.id}
                  onClick={() => setActiveFolder(f.id as any)}
                  className={`w-full text-left px-3 py-2 text-xs font-sans rounded-md flex items-center justify-between cursor-pointer ${
                    activeFolder === f.id ? "bg-[#1C1D17] text-white dark:bg-[#D2F000] dark:text-[#2C3400] font-bold" : "text-[#1C1D17] dark:text-[#C6C9AB] hover:bg-[#F2F4EB] dark:hover:bg-[#292B1D]"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Folder className="w-3.5 h-3.5" />
                    <span className="truncate">{f.name}</span>
                  </div>
                  <span className="text-[10px] opacity-75">
                    {f.id === "personal" ? recordings.filter(r => r.category === "Personal").length : recordings.filter(r => r.category === "Team Shared").length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Files display panel */}
        <div className="lg:col-span-3">
          
          {viewMode === "list" ? (
            /* Tabular List Viewport */
            <div className="bg-white dark:bg-[#121408] rounded-lg border border-[#E9EBE0] dark:border-[#292C1D] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans text-xs">
                  <thead>
                    <tr className="bg-[#FAFBF7] dark:bg-[#1E2113] border-b border-[#E9EBE0] dark:border-[#292C1D] text-[#7B7E6B] dark:text-[#C6C9AB] font-bold tracking-wider uppercase text-[10px]">
                      <th className="py-4 px-4 w-1/2">Recording Name</th>
                      <th className="py-4 px-4">Duration</th>
                      <th className="py-4 px-4">Status / Privacy</th>
                      <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9EBE0] dark:divide-[#292C1D]">
                    {filtered.map(rec => (
                      <tr 
                        key={rec.id}
                        className="hover:bg-[#FAFBF7] dark:hover:bg-[#1E2113]/40 transition-colors group cursor-pointer"
                        onClick={() => onSelectVideo(rec)}
                      >
                        {/* Name Column */}
                        <td className="py-3.5 px-4 flex items-center gap-3">
                          <div className="w-16 h-10 rounded overflow-hidden bg-[#ECEFE2] dark:bg-[#292B1D] shrink-0 border border-[#D9DCCB] dark:border-transparent">
                            <img src={rec.thumbnail} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-[#1C1D17] dark:text-white truncate group-hover:text-[#8D9B00] dark:group-hover:text-[#D2F000]">{rec.title}</div>
                            <div className="text-[10px] text-[#7B7E6B] dark:text-[#C6C9AB] truncate">{rec.createdAt} • by {rec.author || "Alex Chen"}</div>
                          </div>
                        </td>

                        {/* Duration Column */}
                        <td className="py-3.5 px-4 font-mono text-[#1C1D17] dark:text-[#C6C9AB]">
                          {rec.duration}
                        </td>

                        {/* Status Column */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            {rec.privacy === "public" && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-150 text-green-700 dark:bg-green-950/40 dark:text-green-400 capitalize flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-green-500"></span>
                                public
                              </span>
                            )}
                            {rec.privacy === "draft" && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF0DF] text-[#5C5E54] dark:bg-[#292B1D] dark:text-[#C6C9AB] capitalize flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-yellow-500"></span>
                                draft
                              </span>
                            )}
                            {rec.privacy === "locked" && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700 dark:bg-[#1E2113] dark:text-stone-300 capitalize flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5" />
                                private
                              </span>
                            )}
                            {rec.privacy === "live" && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 capitalize flex items-center gap-1 animate-pulse">
                                <span className="w-1 h-1 rounded-full bg-red-600"></span>
                                LIVE
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Actions Column */}
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              onClick={() => onOpenShareModal(rec)}
                              className="p-1 rounded text-[#7B7E6B] dark:text-[#C6C9AB] hover:text-[#1C1D17] dark:hover:text-white cursor-pointer"
                              title="Share video link"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => onDeleteVideo(rec.id)}
                              className="p-1 rounded text-[#7B7E6B] dark:text-[#C6C9AB] hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
                              title="Delete permanently"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <ChevronRight className="w-4 h-4 text-[#7B7E6B]" />
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-[#7B7E6B] dark:text-[#C6C9AB]">
                          No records indexed in this fold space. Create one from the layout button.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Compact Bento Grid Viewport */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(rec => (
                <div 
                  key={rec.id}
                  onClick={() => onSelectVideo(rec)}
                  className="bg-white dark:bg-[#1E2113] border border-[#E9EBE0] dark:border-[#292C1D] rounded-lg overflow-hidden flex flex-col relative group cursor-pointer hover:border-[#D2F000]"
                >
                  <div className="relative aspect-video">
                    <img src={rec.thumbnail} alt="" className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 right-2 bg-black/80 px-1 py-0.5 rounded text-[10px] font-mono text-white">{rec.duration}</div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-sm text-[#1C1D17] dark:text-white truncate group-hover:text-[#D2F000]">{rec.title}</h3>
                    <p className="text-[10px] text-[#7B7E6B] dark:text-[#C6C9AB] mt-1 mb-3 line-clamp-2">{rec.description}</p>
                    
                    <div className="mt-auto flex justify-between items-center text-[10px] text-[#7B7E6B] dark:text-[#C6C9AB] pt-2 border-t border-[#FAFBF7]">
                      <span>{rec.createdAt}</span>
                      <span className="capitalize">{rec.privacy}</span>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full py-12 text-center text-[#7B7E6B] dark:text-[#C6C9AB]">
                  No records indexed in this fold space.
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
