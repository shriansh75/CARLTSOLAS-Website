import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // Off-scale opacity steps used by the hero scrims. Tailwind's slash
      // modifier resolves against theme.opacity and SILENTLY generates nothing
      // for a step that is absent — no error, no warning, the class just does
      // nothing. Four scrims shipped invisible because of this, including the
      // hard anchor behind the hero wordmark (`from-ink/78`), which is why the
      // hero text looked unreadable over bright footage.
      // `scripts/check-opacity.mjs` fails the build if a used step is missing.
      opacity: {
        12: ".12",
        16: ".16",
        62: ".62",
        72: ".72",
        78: ".78",
      },
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
