# CARLTSOLAS Engineering — Website

A premium, Awwwards-caliber corporate portfolio site for **CARLTSOLAS Engineering Private Limited**, a technology-driven company built on the marine engineering foundation of **SOLAS MODU Marine Services** and serving the maritime sector and the wider software industry. Its two technology offerings are business automation & custom software and digital product engineering (bespoke web apps, platforms, dashboards, enterprise interfaces, AI-powered and immersive experiences); it also sources maritime safety equipment and delivers marine engineering in collaboration with SOLAS MODU (the established marine services business, offshore since 2013). The visual identity, a deep-navy **naval-architecture blueprint**, is derived directly from the company's investor presentation.

> **Status.** Home page (cinematic loader, fullscreen video hero, THE COMPANY, TECHNOLOGY, THE SOLAS MODU FOUNDATION, contact footer) plus **Privacy Policy** and **Terms & Conditions** pages. Fully responsive, with a maximal-but-restrained motion layer (GSAP, Lenis, a Three.js and an OGL WebGL piece, Rive-ready), all engineered fallback-first.

## Stack

- **Next.js 14** (App Router) · **TypeScript** · **Tailwind CSS**
- **GSAP** + **ScrollTrigger** + **ScrambleText** (timeline & scroll choreography)
- **Lenis** (smooth scroll, wired to the GSAP ticker)
- **framer-motion** (mobile menu)
- **Three.js / @react-three/fiber** (3D blueprint centerpiece) · **OGL** (aurora background)
- **@rive-app/react-canvas** (wired fallback-first; the SVG twin renders until a `.riv` ships)
- Self-hosted **General Sans** (display/body) + **JetBrains Mono** (mono/meta)

All WebGL/Rive runtimes are code-split (`next/dynamic({ ssr: false })`), lazy-mounted on approach, gated behind `prefers-reduced-motion`, paused offscreen / on tab blur / on the global HOLD control, and DPR-capped.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build (also runs the CSP parity check, then type-checks):

```bash
npm run build && npm run start
```

## Project structure

```
app/
  layout.tsx           # fonts, metadata, <html> scroll-lock, Providers
  template.tsx         # CSS route-fade transition
  page.tsx             # Hero → Positioning → Technology → Capabilities → Footer
  privacy/ terms/      # legal pages
  globals.css          # Tailwind + design tokens (RGB channels) + keyframes
components/
  loader/              # Blueprint-to-Render preloader (~8s, asset-gated, home-only)
  hero/                # dual-video hero (crossfade loop) + overlay + kinetic type
  sections/            # Positioning, Technology, Capabilities
  chrome/              # Header, MobileMenu, Footer
  three/  ogl/  rive/  # fallback-first WebGL centerpiece, OGL aurora, Rive slot
  legal/               # shared legal-page shell
  ui/                  # TextReveal, Reveal, Marquee, Decode, ShinyText, TickFrame, …
  providers/           # LoaderGate, MotionHold, SmoothScroll (Lenis), Providers
lib/                   # fonts, gsap, motion tokens, reduced-motion, assetLoading, heroReadiness
content/site.ts        # ALL on-site copy (single source); content/pages/ = legal copy
scripts/check-headers.mjs  # fails the build if next.config CSP drifts from public/_headers
public/
  video/               # hero.mp4 + hero.webm (1080p, all devices) / hero-poster.{jpg,webp}
  fonts/               # General Sans woff2
```

## Design system

Tokens live as CSS variables in `app/globals.css` (stored as space-separated **RGB channels**, e.g. `--ink: 8 16 32;`) and are mapped in `tailwind.config.ts` as `rgb(var(--x) / <alpha-value>)`, which is what makes opacity modifiers (`bg-ink/80`, `border-navy/15`) valid.

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#081020` | base dark ground |
| `--surface` | `#F0F0F8` | light section |
| `--accent` | `#1D5BD8` | primary, data / interactive |
| `--flare` | `#E8622C` | secondary, rare highlight |
| `--steel` | `#78B0F0` | labels / "ENGINEERING" |
| `--meta` | `#8090A0` | mono eyebrows / captions |

Dark-dominant, disciplined single-accent usage. Type: General Sans (grotesque) + JetBrains Mono (instrument voice).

## Accessibility & performance

- `prefers-reduced-motion` honored throughout: the loader shortens, the video falls back to its poster, the cursor/parallax and every WebGL/Rive surface do not mount, and animated text renders resolved.
- A global **HOLD** control pauses every ambient effect (WebGL, aurora, marquee, grain) per WCAG 2.2.2.
- Scroll locked during the preloader; semantic landmarks; visible focus states; decorative SVG/canvas marked `aria-hidden`; screen-reader copy kept for animated text.
- Hero preloads; heavy runtimes are lazy chunks loaded on approach; the header's scroll probe does no per-frame layout reads.

## Deployment

Deploys to **Vercel**: import the repository in the Vercel dashboard, the framework is auto-detected, the default `npm run build` is used, and no environment variables are required. Security headers (CSP, HSTS, `X-Frame-Options`, etc.) apply natively via `next.config.mjs` `headers()`. `public/_headers` is a Cloudflare Pages mirror of the same CSP (inert on Vercel) and is kept in sync by `scripts/check-headers.mjs`, which runs in `build`. The production build ships no source maps and strips `console.*`.

## Assets

The hero video is a single high-quality ~1080p encode (H.264 + VP9) served to **every** device, re-encoded from the source master with **ffmpeg** into `public/video/`. `HeroVideo` crossfades two stacked `<video>` for a seamless loop, and the preloader waits for the clip's `canplaythrough` before revealing. Paths and loop timing are centralized in `content/site.ts` (`site.heroVideo`); to swap the clip, drop in re-encoded files with the same names and update `durationMs`:

```bash
ffmpeg -y -i SOURCE.mp4 -an -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p -movflags +faststart public/video/hero.mp4
ffmpeg -y -i SOURCE.mp4 -an -c:v libvpx-vp9 -crf 24 -b:v 0 -row-mt 1 public/video/hero.webm
ffmpeg -y -ss 2 -i SOURCE.mp4 -frames:v 1 -q:v 2 public/video/hero-poster.jpg
ffmpeg -y -ss 2 -i SOURCE.mp4 -frames:v 1 -c:v libwebp -quality 88 public/video/hero-poster.webp
```

## Security

See [SECURITY.md](SECURITY.md). Strong security headers + CSP on every response (all assets self-hosted), no production source maps, `console.*` stripped in production, and no client-side secrets.

## Conventions

- **No em dashes** in UI copy; use commas, periods, colons, or `·`.
- Write **SOLAS MODU** as two words. The group attribution line is **"A SOLAS MODU GROUP COMPANY"**.
- Awwwards-first for new UI; GSAP + Lenis are the animation backbone; install libraries on demand.
