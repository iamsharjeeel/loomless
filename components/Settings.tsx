"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Crown,
  Mail,
  Plus,
  Save,
  Settings as SettingsIcon,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useShell } from "@/components/shell-context";
import { createClient } from "@/lib/supabase/client";
import type { UserProfile, WorkspaceMember, WorkspacePreferences } from "@/lib/types";

interface SettingsProps {
  preferences: WorkspacePreferences;
  members: WorkspaceMember[];
  profile: UserProfile | null;
}

export default function Settings({ preferences, members, profile }: SettingsProps) {
  const router = useRouter();
  const { workspaceId } = useShell();
  const [activeTab, setActiveTab] = useState<"general" | "team">("general");

  // Workspace name + display name persist. Capture/SOP toggles are client-only
  // until a workspace-settings table exists (not in the Phase 1 schema).
  const [quality, setQuality] = useState(preferences.defaultVideoQuality);
  const [autoSop, setAutoSop] = useState(preferences.autoGenerateSops);
  const [highlightCursor, setHighlightCursor] = useState(preferences.highlightCursor);
  const [workspaceName, setWorkspaceName] = useState(preferences.workspaceName);
  const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Team invites are local in Phase 1 (real invite delivery is out of scope).
  const [memberList, setMemberList] = useState<WorkspaceMember[]>(members);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<WorkspaceMember["role"]>("viewer");

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const supabase = createClient();
    await supabase.auth.updateUser({ data: { full_name: displayName.trim() } });
    if (workspaceName.trim()) {
      await supabase.from("workspaces").update({ name: workspaceName.trim() }).eq("id", workspaceId);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    router.refresh();
  };

  const handleAddMember = (e: FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setMemberList((prev) => [
      ...prev,
      {
        id: `draft-${Date.now()}`,
        workspaceId: "",
        name: newName.trim() || newEmail.split("@")[0],
        email: newEmail.trim(),
        role: newRole,
        status: "pending",
        avatarUrl: null,
      },
    ]);
    setNewName("");
    setNewEmail("");
    setNewRole("viewer");
  };

  return (
    <div className="mx-auto w-full max-w-container p-4 pb-24 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Workspace settings</h1>
        <p className="text-sm text-fg-secondary">
          Manage capture defaults, members, and your profile.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`flex select-none items-center gap-2 px-4 py-2 text-xs font-bold ${
            activeTab === "general"
              ? "border-b-2 border-accent text-accent"
              : "text-fg-secondary"
          }`}
        >
          <SettingsIcon className="h-4 w-4" />
          General
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("team")}
          className={`flex select-none items-center gap-2 px-4 py-2 text-xs font-bold ${
            activeTab === "team" ? "border-b-2 border-accent text-accent" : "text-fg-secondary"
          }`}
        >
          <Users className="h-4 w-4" />
          Members ({memberList.length})
        </button>
      </div>

      {activeTab === "general" ? (
        <form onSubmit={handleSave} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="space-y-6 rounded border border-border bg-surface-1 p-6 shadow-card">
              <h2 className="text-sm font-bold uppercase tracking-caps">Capture & SOP defaults</h2>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold">Default recording quality</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full rounded border border-border bg-surface-2 px-3 py-2 text-xs outline-none focus:border-border-active"
                >
                  <option>4K Lossless</option>
                  <option>1080p High Definition</option>
                  <option>720p Compressed</option>
                </select>
              </div>

              <div className="space-y-4 pt-2">
                <ToggleRow
                  id="auto-sop"
                  label="Automatically generate SOP chapters"
                  description="Runs extraction when a recording finishes processing."
                  checked={autoSop}
                  onChange={setAutoSop}
                />
                <ToggleRow
                  id="cursor"
                  label="Enable cursor highlighting"
                  description="Renders a halo on click gestures during capture."
                  checked={highlightCursor}
                  onChange={setHighlightCursor}
                />
              </div>

              <div className="space-y-1.5 border-t border-border pt-4">
                <label className="block text-xs font-semibold">Workspace name</label>
                <input
                  type="text"
                  value={workspaceName}
                  placeholder="Your workspace"
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full rounded border border-border bg-surface-2 px-3 py-2 text-xs outline-none focus:border-border-active"
                />
              </div>
            </div>
          </div>

          {/* Identity card */}
          <div className="lg:col-span-1">
            <div className="flex h-full flex-col justify-between space-y-6 rounded border border-border bg-surface-1 p-6 shadow-card">
              <div className="space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-caps">Your profile</h2>

                <div className="flex flex-col items-center">
                  <span className="mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-accent bg-surface-2 text-fg-secondary">
                    <Users className="h-7 w-7" />
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-fg-secondary">
                      DISPLAY NAME
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      placeholder="Your name"
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full rounded border border-border bg-surface-2 px-3 py-1.5 text-xs outline-none focus:border-border-active"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-fg-secondary">EMAIL</label>
                    <div className="truncate rounded border border-border bg-surface-2 px-3 py-1.5 font-mono text-xs text-fg-secondary">
                      {profile?.email ?? "Not signed in"}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex w-full select-none items-center justify-center gap-2 rounded bg-accent py-2.5 text-xs font-bold text-on-accent shadow-card hover:opacity-90 disabled:opacity-60"
              >
                <Save className="h-3.5 w-3.5" />
                {saving ? "Saving…" : saved ? "Saved" : "Save preferences"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-8">
          {/* Invite */}
          <form
            onSubmit={handleAddMember}
            className="rounded border border-border bg-surface-1 p-6 shadow-card"
          >
            <h2 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-caps text-fg-secondary">
              <UserPlus className="h-4 w-4 text-accent" />
              Invite members
            </h2>
            <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-fg-secondary">NAME</label>
                <input
                  type="text"
                  placeholder="e.g. David Kim"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded border border-border bg-surface-2 px-3 py-2 text-xs outline-none focus:border-border-active"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-fg-secondary">EMAIL</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fg-tertiary" />
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full rounded border border-border bg-surface-2 py-2 pl-9 pr-3 text-xs outline-none focus:border-border-active"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-fg-secondary">ROLE</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as WorkspaceMember["role"])}
                  className="w-full rounded border border-border bg-surface-2 px-3 py-2 text-xs outline-none focus:border-border-active"
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <button
                type="submit"
                className="flex h-9 select-none items-center justify-center gap-1.5 rounded bg-accent px-4 text-xs font-bold text-on-accent shadow-card hover:opacity-90"
              >
                <Plus className="h-3.5 w-3.5" />
                Invite
              </button>
            </div>
          </form>

          {/* Member list */}
          <div className="overflow-hidden rounded border border-border bg-surface-1 shadow-card">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-2 text-[10px] font-bold uppercase tracking-caps text-fg-secondary">
                  <th className="px-6 py-4">Member</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((m) => (
                  <tr key={m.id} className="border-b border-border transition-colors last:border-0 hover:bg-surface-2">
                    <td className="flex items-center gap-3 px-6 py-3.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 font-bold text-fg-secondary">
                        {m.name ? m.name[0].toUpperCase() : "U"}
                      </span>
                      <span>
                        <span className="flex items-center gap-1.5 font-bold leading-tight">
                          {m.name}
                          {m.role === "owner" && (
                            <Crown className="h-3 w-3 fill-current text-accent" />
                          )}
                        </span>
                        <span className="mt-0.5 block font-mono text-[10px] text-fg-tertiary">
                          {m.email}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-mono capitalize text-fg-secondary">{m.role}</td>
                    <td className="px-6 py-3.5">
                      {m.status === "pending" ? (
                        <span className="w-fit rounded-sm bg-surface-2 px-2 py-0.5 text-[9px] font-bold uppercase text-fg-secondary">
                          pending
                        </span>
                      ) : (
                        <span className="flex w-fit items-center gap-1 rounded-sm bg-surface-2 px-2 py-0.5 text-[9px] font-bold uppercase text-accent">
                          <span className="h-1 w-1 rounded-full bg-accent" />
                          active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      {profile && m.email === profile.email ? (
                        <span className="text-[10px] italic text-fg-tertiary">You</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setMemberList((prev) => prev.filter((x) => x.id !== m.id))}
                          title="Remove member"
                          className="rounded p-1.5 text-fg-tertiary hover:bg-error-container hover:text-error"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {memberList.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-fg-tertiary">
                      No members yet. Invite someone to your workspace.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleRow({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-0.5">
        <label htmlFor={id} className="block cursor-pointer text-xs font-semibold">
          {label}
        </label>
        <span className="block text-[10px] text-fg-secondary">{description}</span>
      </div>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 cursor-pointer accent-accent"
      />
    </div>
  );
}
