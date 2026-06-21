"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Folder,
  FolderPlus,
  Grid,
  List,
  Lock,
  Share2,
  Trash2,
  Video,
} from "lucide-react";
import { useShell } from "@/components/shell-context";
import { createClient } from "@/lib/supabase/client";
import { formatDuration, type Folder as FolderType, type Recording } from "@/lib/types";

interface LibraryProps {
  folders: FolderType[];
  recordings: Recording[];
}

export default function Library({ folders, recordings }: LibraryProps) {
  const router = useRouter();
  const { openShare, workspaceId } = useShell();
  const [activeFolder, setActiveFolder] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [newFolderName, setNewFolderName] = useState("");
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = recordings.filter((rec) =>
    activeFolder === "all" ? true : rec.folderId === activeFolder
  );

  const openPlayback = (rec: Recording) => router.push(`/playback/${rec.id}`);

  const handleAddFolder = async (e: FormEvent) => {
    e.preventDefault();
    const name = newFolderName.trim();
    if (!name) return;
    setNewFolderName("");
    setShowAddFolder(false);
    const supabase = createClient();
    const { error } = await supabase.from("folders").insert({ workspace_id: workspaceId, name });
    if (!error) router.refresh();
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/recordings/${id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-container p-4 pb-24 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Library</h1>
          <p className="text-sm text-fg-secondary">
            Organize recordings into folders across your workspace.
          </p>
        </div>

        <div className="flex rounded border border-border bg-surface-2 p-1">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            title="List view"
            className={`rounded p-1.5 ${
              viewMode === "list" ? "bg-surface-1 text-accent shadow-card" : "text-fg-secondary"
            }`}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            title="Grid view"
            className={`rounded p-1.5 ${
              viewMode === "grid" ? "bg-surface-1 text-accent shadow-card" : "text-fg-secondary"
            }`}
          >
            <Grid className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Folder rail */}
        <div className="lg:col-span-1">
          <div className="rounded border border-border bg-surface-1 p-4 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-caps text-fg-secondary">
                Folders
              </span>
              <button
                type="button"
                onClick={() => setShowAddFolder((v) => !v)}
                title="Create folder"
                className="rounded p-1 text-fg-secondary hover:text-accent"
              >
                <FolderPlus className="h-4 w-4" />
              </button>
            </div>

            {showAddFolder && (
              <form onSubmit={handleAddFolder} className="mb-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Folder name..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  autoFocus
                  className="w-full rounded border border-border bg-surface-2 px-2 py-1 text-xs outline-none focus:border-border-active"
                />
                <button
                  type="submit"
                  className="rounded bg-accent px-2 py-1 text-xs font-semibold text-on-accent"
                >
                  Add
                </button>
              </form>
            )}

            <div className="space-y-1">
              <FolderRow
                label="All recordings"
                count={recordings.length}
                active={activeFolder === "all"}
                onClick={() => setActiveFolder("all")}
              />
              {folders.map((f) => (
                <FolderRow
                  key={f.id}
                  label={f.name}
                  count={f.recordingCount}
                  active={activeFolder === f.id}
                  onClick={() => setActiveFolder(f.id)}
                />
              ))}
              {folders.length === 0 && (
                <p className="px-3 py-2 text-xs text-fg-tertiary">No folders yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Recordings panel */}
        <div className="lg:col-span-3">
          {viewMode === "list" ? (
            <div className="overflow-hidden rounded border border-border bg-surface-1 shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-border bg-surface-2 text-[10px] font-semibold uppercase tracking-caps text-fg-secondary">
                      <th className="w-1/2 px-4 py-4">Recording</th>
                      <th className="px-4 py-4">Duration</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((rec) => (
                      <tr
                        key={rec.id}
                        onClick={() => openPlayback(rec)}
                        className="group cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-surface-2"
                      >
                        <td className="flex items-center gap-3 px-4 py-3.5">
                          <span className="flex h-10 w-16 shrink-0 items-center justify-center overflow-hidden rounded border border-border bg-surface-2">
                            {rec.thumbnailUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={rec.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <Video className="h-4 w-4 text-fg-tertiary" />
                            )}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-semibold group-hover:text-accent">
                              {rec.title}
                            </span>
                            <span className="block truncate text-[10px] text-fg-tertiary">
                              {rec.createdAt} • {rec.authorName ?? "Unknown"}
                            </span>
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-mono tabular-nums text-fg-secondary">
                          {formatDuration(rec.durationSeconds)}
                        </td>
                        <td className="px-4 py-3.5">
                          <VisibilityChip recording={rec} />
                        </td>
                        <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openShare(rec)}
                              title="Share link"
                              className="rounded p-1 text-fg-tertiary hover:text-fg-primary"
                            >
                              <Share2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              title="Delete"
                              disabled={busyId === rec.id}
                              onClick={() => handleDelete(rec.id)}
                              className="rounded p-1 text-fg-tertiary hover:text-error disabled:opacity-60"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <ChevronRight className="h-4 w-4 text-fg-tertiary" />
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-12 text-center text-fg-tertiary">
                          No recordings in this folder yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((rec) => (
                <button
                  key={rec.id}
                  type="button"
                  onClick={() => openPlayback(rec)}
                  className="group flex flex-col overflow-hidden rounded border border-border bg-surface-1 text-left shadow-card transition-colors hover:border-border-active"
                >
                  <span className="relative flex aspect-video items-center justify-center bg-surface-2">
                    {rec.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={rec.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Video className="h-7 w-7 text-fg-tertiary" />
                    )}
                    <span className="absolute bottom-2 right-2 rounded-sm bg-black/70 px-1 py-0.5 font-mono text-[10px] tabular-nums text-white">
                      {formatDuration(rec.durationSeconds)}
                    </span>
                  </span>
                  <span className="flex flex-1 flex-col p-4">
                    <span className="truncate text-sm font-semibold group-hover:text-accent">
                      {rec.title}
                    </span>
                    {rec.description && (
                      <span className="mb-3 mt-1 line-clamp-2 text-[10px] text-fg-secondary">
                        {rec.description}
                      </span>
                    )}
                    <span className="mt-auto flex items-center justify-between border-t border-border pt-2 text-[10px] text-fg-tertiary">
                      <span>{rec.createdAt}</span>
                      <span className="capitalize">{rec.visibility}</span>
                    </span>
                  </span>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full py-12 text-center text-fg-tertiary">
                  No recordings in this folder yet.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FolderRow({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded px-3 py-2 text-left text-xs ${
        active
          ? "bg-accent font-semibold text-on-accent"
          : "text-fg-primary hover:bg-surface-2"
      }`}
    >
      <span className="flex items-center gap-2 truncate">
        <Folder className="h-3.5 w-3.5" />
        <span className="truncate">{label}</span>
      </span>
      <span className="text-[10px] opacity-75">{count}</span>
    </button>
  );
}

function VisibilityChip({ recording }: { recording: Recording }) {
  if (recording.visibility === "private") {
    return (
      <span className="flex w-fit items-center gap-1 rounded-sm bg-surface-2 px-2 py-0.5 text-[10px] font-semibold capitalize text-fg-secondary">
        <Lock className="h-2.5 w-2.5" />
        private
      </span>
    );
  }
  return (
    <span className="flex w-fit items-center gap-1 rounded-sm bg-surface-2 px-2 py-0.5 text-[10px] font-semibold capitalize text-accent">
      <span className="h-1 w-1 rounded-full bg-accent" />
      {recording.visibility}
    </span>
  );
}
