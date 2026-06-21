import type { Config } from "tailwindcss";

/**
 * All colors resolve to CSS custom properties defined in app/globals.css under
 * `:root` (light, default) and `.dark` (dark override). Components must reference
 * these Tailwind tokens — never raw hex values. See DESIGN_SYSTEM.md.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          0: "var(--surface-0)",
          1: "var(--surface-1)",
          2: "var(--surface-2)",
        },
        border: {
          DEFAULT: "var(--border)",
          active: "var(--border-active)",
        },
        fg: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          dim: "var(--accent-dim)",
          // Full-brightness lime, reserved for small high-contrast accents
          // (badges, dots, record-button fill) that sit on a dark chip.
          lime: "var(--accent-lime)",
        },
        "on-accent": "var(--on-accent)",
        error: {
          DEFAULT: "var(--error)",
          container: "var(--error-container)",
        },
      },
      fontFamily: {
        // Geist for everything per DESIGN_SYSTEM.md — headings, body, labels,
        // and "mono"-style metadata (numerics use tabular-nums for alignment).
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        // Sharp 4px radii are the system standard.
        DEFAULT: "4px",
        sm: "2px",
        md: "4px",
        lg: "4px",
        xl: "4px",
      },
      boxShadow: {
        // Barely-perceptible elevation — light mode only (see globals.css).
        card: "0 1px 2px rgba(0,0,0,0.04)",
      },
      maxWidth: {
        container: "1440px",
      },
      letterSpacing: {
        caps: "0.05em",
      },
    },
  },
  plugins: [],
};

export default config;
