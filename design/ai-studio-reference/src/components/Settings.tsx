import { useState, useEffect, FormEvent } from "react";
import { 
  Plus, 
  Trash2, 
  Save, 
  Settings as SettingsIcon, 
  Users, 
  Mail, 
  ShieldAlert, 
  UserPlus, 
  Crown,
  CheckCircle,
  HelpCircle,
  Undo
} from "lucide-react";
import { Member, UserProfile, WorkspacePreferences } from "../types";

interface SettingsProps {
  preferences: WorkspacePreferences;
  profile: UserProfile;
  onUpdateSettings: (data: { preferences: any; profile: any }) => void;
}

export default function Settings({ preferences, profile, onUpdateSettings }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<"general" | "team">("general");

  // General Settings inputs
  const [quality, setQuality] = useState(preferences.defaultVideoQuality);
  const [autoSOP, setAutoSOP] = useState(preferences.autoGenerateSOPs);
  const [highlightCursor, setHighlightCursor] = useState(preferences.showCursorHighlighting);
  const [workspaceName, setWorkspaceName] = useState(preferences.workspaceName);
  
  // Profile settings
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [avatar, setAvatar] = useState(profile.avatarUrl);

  // Team settings
  const [members, setMembers] = useState<Member[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("VIEWER");
  const [newName, setNewName] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch team members from backend
  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/members");
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSaveGeneral = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: {
            defaultVideoQuality: quality,
            autoGenerateSOPs: autoSOP,
            showCursorHighlighting: highlightCursor,
            workspaceName
          },
          profile: {
            displayName,
            avatarUrl: avatar
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        onUpdateSettings({ preferences: data.preferences, profile: data.profile });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddMember = async (e: FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail,
          name: newName.trim(),
          role: newRole
        })
      });
      if (res.ok) {
        setNewEmail("");
        setNewName("");
        setNewRole("VIEWER");
        fetchMembers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      const res = await fetch(`/api/members/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchMembers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 pb-24 md:pb-8">
      {/* Top Header info */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-sans font-bold text-[#1C1D17] dark:text-white tracking-tight">
          Loomless Workspace Settings
        </h1>
        <p className="text-xs md:text-sm text-[#7B7E6B] dark:text-[#C6C9AB]">
          Customize automatic process logs properties, invite developers, and manage profile schemas.
        </p>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex border-b border-[#E9EBE0] dark:border-[#2C2E1F] mb-8">
        <button 
          onClick={() => setActiveTab("general")}
          className={`py-2 px-4 text-xs font-sans font-bold flex items-center gap-2 select-none cursor-pointer ${
            activeTab === "general" 
              ? "border-b-2 border-[#1C1D17] dark:border-[#D2F000] text-[#1C1D17] dark:text-[#D2F000]" 
              : "text-[#7B7E6B] dark:text-[#C6C9AB]"
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          General Preferences
        </button>
        <button 
          onClick={() => setActiveTab("team")}
          className={`py-2 px-4 text-xs font-sans font-bold flex items-center gap-2 select-none cursor-pointer ${
            activeTab === "team" 
              ? "border-b-2 border-[#1C1D17] dark:border-[#D2F000] text-[#1C1D17] dark:text-[#D2F000]" 
              : "text-[#7B7E6B] dark:text-[#C6C9AB]"
          }`}
        >
          <Users className="w-4 h-4" />
          Workspace Members ({members.length})
        </button>
      </div>

      {activeTab === "general" ? (
        /* General Setup Preferences page */
        <form onSubmit={handleSaveGeneral} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Inputs cards layout */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-[#1E2113] p-6 rounded-lg border border-[#E9EBE0] dark:border-[#2C2E1F] shadow-sm space-y-6">
              <h2 className="text-sm font-sans font-bold text-[#1C1D17] dark:text-white uppercase tracking-wider">
                Video & SOP Defaults
              </h2>

              {/* Target Quality drop-down */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1C1D17] dark:text-neutral-200">
                  Default Record Resolution Quality
                </label>
                <select 
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full text-xs bg-[#FAFBF7] dark:bg-[#121408] border border-[#CBD0B9] dark:border-[#454932] text-[#1C1D17] dark:text-white px-3 py-2 rounded outline-none"
                >
                  <option>4K Lossless</option>
                  <option>1080p High Definition</option>
                  <option>720p Compressed</option>
                </select>
                <span className="text-[10px] text-[#7B7E6B] dark:text-[#C6C9AB] block">
                  Determines initial capture frame-rate presets inside workspace dashboards.
                </span>
              </div>

              {/* Switch toggles */}
              <div className="space-y-4 pt-2">
                {/* Auto generate SOP */}
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <label className="block text-xs font-semibold text-[#1C1D17] dark:text-neutral-200 cursor-pointer" htmlFor="auto-sop-check">
                      Automatically generate SOP chapters
                    </label>
                    <span className="text-[10px] text-[#7B7E6B] dark:text-[#C6C9AB] block">
                      Enables immediate extraction algorithms on stopping walkthrough recorder.
                    </span>
                  </div>
                  <input 
                    type="checkbox"
                    id="auto-sop-check"
                    checked={autoSOP}
                    onChange={(e) => setAutoSOP(e.target.checked)}
                    className="w-4 h-4 accent-[#D2F000] cursor-pointer mt-1"
                  />
                </div>

                {/* Cursor Highlighter */}
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <label className="block text-xs font-semibold text-[#1C1D17] dark:text-neutral-200 cursor-pointer" htmlFor="cursor-check">
                      Enable cursor highlighters
                    </label>
                    <span className="text-[10px] text-[#7B7E6B] dark:text-[#C6C9AB] block">
                      Renders a visual halo on click gestures during video capture.
                    </span>
                  </div>
                  <input 
                    type="checkbox"
                    id="cursor-check"
                    checked={highlightCursor}
                    onChange={(e) => setHighlightCursor(e.target.checked)}
                    className="w-4 h-4 accent-[#D2F000] cursor-pointer mt-1"
                  />
                </div>
              </div>

              {/* Workspace naming properties */}
              <div className="space-y-1.5 pt-4 border-t border-[#FAFBF7] dark:border-[#2C2E1F]">
                <label className="block text-xs font-semibold text-[#1C1D17] dark:text-neutral-200">
                  Workspace Namespace
                </label>
                <input 
                  type="text" 
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full text-xs bg-[#FAFBF7] dark:bg-[#121408] border border-[#CBD0B9] dark:border-[#454932] text-[#1C1D17] dark:text-white px-3 py-2 rounded outline-none"
                />
              </div>

            </div>
          </div>

          {/* User profile config card on Right */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#FAFBF7] dark:bg-[#1E2113] p-6 rounded-lg border border-[#D9DCCB] dark:border-[#2C2E1F] shadow-sm space-y-6 flex flex-col justify-between h-full">
              <div className="space-y-6">
                <h2 className="text-sm font-sans font-bold text-[#1C1D17] dark:text-white uppercase tracking-wider">
                  Personal Identity Info
                </h2>

                <div className="flex flex-col items-center select-none">
                  <div className="w-16 h-16 rounded-full border border-[#D2F000] overflow-hidden mb-3 shadow">
                    <img src={avatar} alt="Identity avatar" className="w-full h-full object-cover" />
                  </div>
                  
                  <input 
                    type="text" 
                    placeholder="Avatar URL..."
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full text-[10px] bg-white dark:bg-[#121408] border border-[#CBD0B9] dark:border-[#454932] text-[#7B7E6B] dark:text-white px-2 py-1 rounded text-center outline-none"
                  />
                </div>

                <div className="space-y-3">
                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[#7B7E6B] dark:text-[#C6C9AB]">DISPLAY NAME</label>
                    <input 
                      type="text" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full text-xs bg-white dark:bg-[#121408] border border-[#CBD0B9] dark:border-[#454932]/70 text-[#1C1D17] dark:text-white px-3 py-1.5 rounded outline-none"
                    />
                  </div>

                  {/* Readonly info */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-[#7B7E6B] dark:text-[#C6C9AB]">IDENTITY EMAIL</label>
                    <div className="text-xs text-[#1C1D17] dark:text-white bg-[#EAF0DF]/40 dark:bg-[#121408] px-3 py-1.5 rounded truncate font-mono border border-[#CBD0B9]/40">
                      {profile.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* General CTA save row */}
              <div className="pt-6 border-t border-[#CBD0B9]/40 flex flex-col gap-2">
                <button 
                  type="submit"
                  disabled={saving}
                  className="w-full py-2.5 bg-[#1C1D17] text-[#D2F000] dark:bg-[#D2F000] dark:text-[#2C3400] text-xs font-sans font-bold rounded flex items-center justify-center gap-2 cursor-pointer shadow-md select-none"
                >
                  <Save className="w-3.5 h-3.5" />
                  {saving ? "Storing values..." : "Save Preferences"}
                </button>
                
                {saveSuccess && (
                  <div className="text-center text-[10px] text-green-600 dark:text-green-400 font-bold font-sans flex items-center justify-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500 fill-current" />
                    Updated system database successfully!
                  </div>
                )}
              </div>
            </div>
          </div>

        </form>
      ) : (
        /* Team Members list management area */
        <div className="space-y-8">
          
          {/* Invite email row */}
          <form onSubmit={handleAddMember} className="bg-white dark:bg-[#1E2113] p-6 rounded-lg border border-[#E9EBE0] dark:border-[#2C2E1F] shadow-sm">
            <h2 className="text-xs font-sans font-bold text-[#1C1D17] dark:text-[#C6C9AB] uppercase tracking-wider mb-4 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#D2F000]" />
              Invite Team Members
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-sans font-bold text-[#7B7E6B] dark:text-[#C6C9AB]" htmlFor="memb-name-id">
                  DEVELOPER NAME
                </label>
                <input 
                  type="text" 
                  id="memb-name-id"
                  placeholder="e.g. David Kim"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full text-xs bg-[#FAFBF7] dark:bg-[#121408] border border-[#CBD0B9] dark:border-[#454932] text-[#1C1D17] dark:text-white px-3 py-2 rounded outline-none"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-sans font-bold text-[#7B7E6B] dark:text-[#C6C9AB]" htmlFor="memb-email-id">
                  WORK EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-[#7B7E6B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="email" 
                    id="memb-email-id"
                    placeholder="name@domain.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 bg-[#FAFBF7] dark:bg-[#121408] border border-[#CBD0B9] dark:border-[#454932] text-[#1C1D17] dark:text-white rounded outline-none"
                    required
                  />
                </div>
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-sans font-bold text-[#7B7E6B] dark:text-[#C6C9AB]">ROLE ACCESS LICENSE</label>
                <select 
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full text-xs bg-[#FAFBF7] dark:bg-[#121408] border border-[#CBD0B9] dark:border-[#454932] text-[#1C1D17] dark:text-white px-3 py-2 rounded outline-none"
                >
                  <option value="ADMIN">ADMIN (Read, Record, Update)</option>
                  <option value="EDITOR">EDITOR (Read & Record)</option>
                  <option value="VIEWER">VIEWER (Read Only)</option>
                </select>
              </div>

              {/* CTA trigger button */}
              <button 
                type="submit"
                className="py-2 px-4 bg-[#1C1D17] text-[#D2F000] dark:bg-[#D2F000] dark:text-[#2C3400] text-xs font-sans font-bold rounded flex items-center justify-center gap-1.5 cursor-pointer h-9 shadow-md select-none mt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Invite Developer
              </button>
            </div>
          </form>

          {/* Members list table */}
          <div className="bg-white dark:bg-[#1E2113] rounded-lg border border-[#E9EBE0] dark:border-[#2C2E1F] overflow-hidden shadow-xs">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAFBF7] dark:bg-[#121408] border-b border-[#E9EBE0] dark:border-[#2C2E1F] text-[#7B7E6B] dark:text-[#C6C9AB] text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Developer Details</th>
                  <th className="py-4 px-6">Assigned Permissions Role</th>
                  <th className="py-4 px-6">Status Info</th>
                  <th className="py-4 px-6 text-right">Revoke Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9EBE0] dark:divide-[#2C2E1F]">
                {members.map(memb => (
                  <tr key={memb.id} className="hover:bg-[#FAFBF7]/60 dark:hover:bg-[#121408]/35 transition-colors">
                    
                    {/* User info */}
                    <td className="py-3.5 px-6 flex items-center gap-3">
                      {memb.avatar ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-[#D9DCCB] shrink-0">
                          <img src={memb.avatar} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#E5ECD7] dark:bg-[#292B1D] text-[#5C5E54] dark:text-neutral-300 font-bold flex items-center justify-center shrink-0">
                          {memb.name ? memb.name[0].toUpperCase() : "U"}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-[#1C1D17] dark:text-white leading-tight flex items-center gap-1.5">
                          {memb.name || "Colleague User"}
                          {memb.role === "ADMIN" && <Crown className="w-3 h-3 text-[#D2F000] fill-current" title="Workspace Owner" />}
                        </div>
                        <div className="text-[10px] mt-0.5 text-[#7B7E6B] dark:text-[#C6C9AB] font-mono">{memb.email}</div>
                      </div>
                    </td>

                    {/* Permission status */}
                    <td className="py-3.5 px-6 font-mono font-medium text-xs text-[#1C1D17] dark:text-[#C6C9AB]">
                      {memb.role}
                    </td>

                    {/* Status item */}
                    <td className="py-3.5 px-6">
                      {memb.status === "Pending" ? (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 capitalize flex items-center gap-1 w-fit border border-amber-200 dark:border-transparent">
                          pending invite
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-450 capitalize flex items-center gap-1 w-fit">
                          ● Active License
                        </span>
                      )}
                    </td>

                    {/* Delete actions */}
                    <td className="py-3.5 px-6 text-right">
                      {memb.email === profile.email ? (
                        <span className="text-[10px] text-[#7B7E6B] dark:text-[#C6C9AB] italic">Self Profile</span>
                      ) : (
                        <button 
                          onClick={() => handleDeleteMember(memb.id)}
                          className="text-[#7B7E6B] dark:text-stone-400 hover:text-red-500 p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer transition-all"
                          title="Revoke access"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );
}
