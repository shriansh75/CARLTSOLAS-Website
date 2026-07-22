/**
 * Shared motion tokens so every reveal reads as one system.
 * GSAP-string eases for GSAP; cubic arrays for framer-motion / CSS.
 */
export const EASE = {
  expo: "expo.out",
  io: "power4.inOut",
  soft: "power3.out",
  mech: "none",
} as const;

export const DUR = {
  fast: 0.4,
  base: 0.8,
  reveal: 1.0,
  slow: 1.25,
  cross: 0.6,
} as const;

export const STAGGER = {
  chars: 0.02,
  words: 0.055,
  lines: 0.09,
  cards: 0.12,
  ticks: 0.03,
} as const;

/** cubic-bezier equivalents for framer-motion / inline CSS. */
export const CUBIC = {
  expo: [0.16, 1, 0.3, 1] as [number, number, number, number],
  io: [0.86, 0, 0.07, 1] as [number, number, number, number],
};
