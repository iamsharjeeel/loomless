"use client";

import { useState, useTransition } from "react";
import { createWorkspace } from "@/app/onboarding/actions";

export default function CreateWorkspaceForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await createWorkspace(formData);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="ws-name" className="block text-[11px] font-bold uppercase tracking-caps text-fg-secondary">
          Workspace name
        </label>
        <input
          id="ws-name"
          name="name"
          type="text"
          required
          autoFocus
          placeholder="e.g. Acme Team"
          className="w-full rounded border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-border-active"
        />
        <p className="text-[11px] text-fg-tertiary">A URL slug is generated automatically.</p>
      </div>

      {error && <p className="text-xs text-error">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-accent py-2.5 text-xs font-bold text-on-accent shadow-card transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create workspace"}
      </button>
    </form>
  );
}
