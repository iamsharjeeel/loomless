"use client";

import { ArrowUpRight, CreditCard, Database, FileText, User, Video } from "lucide-react";
import SignOutButton from "@/components/SignOutButton";
import type { UserProfile } from "@/lib/types";

interface ProfileProps {
  profile: UserProfile | null;
}

export default function Profile({ profile }: ProfileProps) {
  const displayName = profile?.displayName ?? "Your profile";
  const email = profile?.email ?? "Not signed in";

  return (
    <div className="mx-auto w-full max-w-4xl select-none space-y-8 p-4 pb-24 md:p-8">
      {/* Identity */}
      <div className="flex flex-col items-center gap-6 rounded border border-border bg-surface-1 p-6 shadow-card md:flex-row">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-accent bg-surface-2 text-fg-secondary">
          {profile?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatarUrl} alt={displayName} className="h-full w-full object-cover" />
          ) : (
            <User className="h-9 w-9" />
          )}
        </div>
        <div className="flex-1 space-y-1 text-center md:text-left">
          <h2 className="text-xl font-bold">{displayName}</h2>
          <p className="font-mono text-xs text-fg-secondary">{email}</p>
          {profile?.role && (
            <p className="pt-1 text-xs text-fg-secondary">
              Role: <span className="font-semibold capitalize text-fg-primary">{profile.role}</span>
              {profile.activeWorkspaceName && (
                <>
                  {" "}
                  in{" "}
                  <span className="font-semibold text-fg-primary">
                    {profile.activeWorkspaceName}
                  </span>
                </>
              )}
            </p>
          )}
        </div>
        <SignOutButton />
      </div>

      {/* Usage (placeholder metrics until billing/usage lands) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <UsageCard label="Cloud storage" icon={Database} value="0 GB" total="/ 500 GB" pct={0} />
        <UsageCard label="Recording time" icon={Video} value="0 min" total="/ Unlimited" pct={0} />
        <UsageCard label="AI SOPs" icon={FileText} value="0" total="/ 500 mo" pct={0} />
      </div>

      {/* Subscription */}
      <div className="rounded border border-border bg-surface-1 p-6 shadow-card">
        <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-caps">
          <CreditCard className="h-4 w-4 text-accent" />
          Subscription
        </h3>
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-1">
            <div className="text-sm font-semibold">Free plan</div>
            <p className="text-xs text-fg-secondary">
              Upgrade to unlock higher quotas and team features.
            </p>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 whitespace-nowrap rounded bg-accent px-4 py-2 text-xs font-bold text-on-accent shadow-card hover:opacity-90"
          >
            Upgrade workspace
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function UsageCard({
  label,
  icon: Icon,
  value,
  total,
  pct,
}: {
  label: string;
  icon: typeof Database;
  value: string;
  total: string;
  pct: number;
}) {
  return (
    <div className="flex flex-col justify-between rounded border border-border bg-surface-1 p-5 shadow-card">
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-caps text-fg-secondary">{label}</span>
          <Icon className="h-4 w-4 text-fg-tertiary" />
        </div>
        <div className="space-y-2">
          <div className="text-2xl font-bold">
            {value} <span className="text-xs font-normal text-fg-tertiary">{total}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-surface-2">
            <div className="h-1.5 rounded-full bg-accent" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
