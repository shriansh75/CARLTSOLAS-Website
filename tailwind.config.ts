import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tokens are RGB channel triples in globals.css, so opacity modifiers
        // (bg-ink/80, border-navy/15, from-ink/95) resolve to valid CSS.
        ink: "rgb(var(--ink) / <alpha-value>)",
        "ink-2": "rgb(var(--ink-2) / <alpha-value>)",
        navy: "rgb(var(--navy) / <alpha-value>)",
        slate: "rgb(var(--slate) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        steel: "rgb(var(--steel) / <alpha-value>)",
        flare: "rgb(var(--flare) / <alpha-value>)",
        meta: "rgb(var(--meta) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      maxWidth: {
        shell: "1680px",
      },
      letterSpacing: {
        widest2: "0.24em",
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
        io: "cubic-bezier(0.86, 0, 0.07, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
