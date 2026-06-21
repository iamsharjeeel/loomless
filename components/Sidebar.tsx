"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderHeart, LayoutDashboard, Plus, Settings, User } from "lucide-react";
import { useShell } from "@/components/shell-context";
import ThemeToggle from "@/components/ThemeToggle";
import SignOutButton from "@/components/SignOutButton";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/library", label: "Library", icon: FolderHeart },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/profile", label: "Profile", icon: User },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar() {
  const pathname = usePathname();
  const { openCapture } = useShell();

  return (
    <>
      {/* Mobile top header */}
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface-1 px-4 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded border border-border bg-fg-primary">
            <span className="text-sm font-bold uppercase tracking-tighter text-accent-lime">L</span>
          </div>
          <span className="select-none text-lg font-bold tracking-tight">Loomless</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle className="flex h-9 w-9 items-center justify-center rounded border border-border text-fg-secondary hover:text-fg-primary" />
          <Link
            href="/profile"
            aria-label="Profile"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-2 text-fg-secondary"
          >
            <User className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Desktop left rail */}
      <aside className="fixed left-0 top-0 z-50 hidden h-full w-16 flex-col items-center border-r border-border bg-surface-1 py-6 md:flex">
        {/* Brand */}
        <div className="mb-6 flex select-none flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded border border-accent/40 bg-fg-primary shadow-card">
            <span className="text-xl font-bold uppercase tracking-tighter text-accent-lime">L</span>
          </div>
        </div>

        {/* New record CTA */}
        <button
          type="button"
          onClick={openCapture}
          title="New record"
          className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-accent text-on-accent shadow-card transition-transform hover:scale-105 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          <span className="pointer-events-none absolute left-14 z-50 whitespace-nowrap rounded bg-surface-2 px-2 py-1 text-xs text-fg-primary opacity-0 shadow-card transition-opacity group-hover:opacity-100">
            New record
          </span>
        </button>

        {/* Primary nav */}
        <nav className="mt-8 flex w-full flex-1 flex-col items-center space-y-5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`group relative flex h-10 w-10 items-center justify-center rounded transition-colors hover:bg-surface-2 ${
                  active ? "bg-surface-2 text-accent" : "text-fg-tertiary hover:text-fg-primary"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="pointer-events-none absolute left-14 z-50 whitespace-nowrap rounded bg-surface-2 px-2 py-1 text-xs text-fg-primary opacity-0 shadow-card transition-opacity group-hover:opacity-100">
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Theme toggle + sign out + profile shortcut */}
        <div className="mt-auto flex flex-col items-center space-y-4">
          <ThemeToggle className="flex h-10 w-10 items-center justify-center rounded border border-border text-fg-tertiary transition-colors hover:bg-surface-2 hover:text-fg-primary" />
          <SignOutButton
            variant="icon"
            className="flex h-10 w-10 items-center justify-center rounded border border-border text-fg-tertiary transition-colors hover:bg-surface-2 hover:text-fg-primary"
          />
          <Link
            href="/profile"
            aria-label="Profile"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-2 text-fg-secondary transition-colors hover:border-border-active"
          >
            <User className="h-4 w-4" />
          </Link>
        </div>
      </aside>

      {/* Mobile bottom tab bar with raised record FAB */}
      <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-border bg-surface-1 px-4 md:hidden">
        <MobileTab href="/" label="Home" icon={LayoutDashboard} pathname={pathname} />
        <MobileTab href="/library" label="Library" icon={FolderHeart} pathname={pathname} />

        <div className="relative -top-5">
          <button
            type="button"
            onClick={openCapture}
            aria-label="New record"
            className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-surface-0 bg-accent text-on-accent shadow-card transition-transform active:scale-90"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>

        <MobileTab href="/settings" label="Settings" icon={Settings} pathname={pathname} />
        <MobileTab href="/profile" label="Profile" icon={User} pathname={pathname} />
      </nav>
    </>
  );
}

function MobileTab({
  href,
  label,
  icon: Icon,
  pathname,
}: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  pathname: string;
}) {
  const active = isActive(pathname, href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex flex-col items-center justify-center rounded p-2 transition-transform ${
        active ? "scale-105 text-accent" : "text-fg-tertiary"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="mt-1 text-[10px]">{label}</span>
    </Link>
  );
}
