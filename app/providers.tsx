"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Theme persistence per DESIGN_SYSTEM.md: light is the default, the choice is
 * persisted to localStorage, and the system preference is the first-load
 * fallback. next-themes toggles the `.dark` class on <html> before paint.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
