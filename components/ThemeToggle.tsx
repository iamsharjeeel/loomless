"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
}

/**
 * Quick-access light/dark toggle (sidebar + mobile header). Guards against
 * hydration mismatch by only rendering the resolved icon after mount.
 */
export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title="Toggle light/dark theme"
      aria-label="Toggle light/dark theme"
      className={className}
    >
      {/* Render a neutral placeholder until mounted to avoid a wrong-icon flash. */}
      {!mounted ? (
        <span className="block h-5 w-5" />
      ) : isDark ? (
        <Sun className="h-5 w-5 text-accent" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}
