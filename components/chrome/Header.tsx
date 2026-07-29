"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useLoaderGate } from "@/components/providers/LoaderGate";
import { cn } from "@/lib/cn";
import { site } from "@/content/site";
import { NavDropdown } from "./NavDropdown";

// framer-motion lives only in the mobile overlay; load it as its own client
// chunk so it stays out of the initial bundle on every device.
const MobileMenu = dynamic(() => import("./MobileMenu").then((m) => m.MobileMenu), { ssr: false });

/** Minimal running header. Fades in after reveal; hides on scroll-down. */
export function Header() {
  const { revealed } = useLoaderGate();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const lastY = useRef(0);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  // Nav entries are either a real route ("/marine") or a home-page hash
  // ("#company"). Routes are already absolute, so they must never be prefixed:
  // `/${"/marine"}` yields "//marine", a protocol-relative URL that resolves to
  // an external host. On the legal pages, hash targets live on the home page.
  const isRoute = (h: string) => h.startsWith("/");
  const hrefFor = (h: string) =>
    isRoute(h) ? h : isHome ? h : h === "#top" ? "/" : `/${h}`;

  useEffect(() => {
    // The section whose background sits under the header baseline sets the nav
    // text theme: dark text over light sections, white over dark ones.
    // Section positions are measured once (and on resize), so per-scroll-frame
    // work is pure arithmetic instead of a querySelectorAll + getBoundingClientRect
    // layout read every frame (which janked the smooth scroll).
    const PROBE = 44;
    let bands: { top: number; bottom: number; theme: "dark" | "light" }[] = [];
    const measure = () => {
      const sy = window.scrollY;
      bands = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-theme]")).map((el) => {
        const r = el.getBoundingClientRect();
        const top = r.top + sy;
        return {
          top,
          bottom: top + r.height,
          theme: el.dataset.navTheme === "light" ? "light" : "dark",
        };
      });
    };

    // Past this point the header earns a solid tint so nav links stay legible
    // over imagery and text-heavy bands. Only background-color/border-color
    // animate, so there is no per-frame paint cost. Never use backdrop-filter
    // on this fixed element: it re-blurs the region every scroll frame and is
    // the documented cause of the earlier scroll-lag regression.
    const TINT_AT = 80;
    let ticking = false;
    const compute = () => {
      ticking = false;
      const y = window.scrollY;
      setHidden(y > 140 && y > lastY.current);
      setScrolled(y > TINT_AT);
      lastY.current = y;
      const probeY = y + PROBE;
      let next: "dark" | "light" = "dark";
      for (const band of bands) {
        if (probeY >= band.top && probeY < band.bottom) next = band.theme;
      }
      setTheme(next);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(compute);
      }
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    compute();
    // re-measure once after fonts/layout settle so band positions stay accurate
    const settle = window.setTimeout(measure, 1200);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    // late layout shifts (images/fonts settling, lazy content) move every band
    // below them; re-measure on body size changes so the nav theme never
    // mis-samples (e.g. dark-on-dark) after below-the-fold content settles.
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => measure()) : null;
    ro?.observe(document.body);
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
    };
  }, []);

  const onNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Real routes: client-navigate. Never hand these to Lenis, whose scrollTo
    // passes the string to querySelector and throws on "/marine".
    if (isRoute(href)) {
      e.preventDefault();
      router.push(href);
      return;
    }
    if (!isHome) {
      // Route to the home page (optionally to a section) via client navigation.
      e.preventDefault();
      router.push(href === "#top" ? "/" : `/${href}`);
      return;
    }
    const lenis = (window as unknown as {
      lenis?: { scrollTo: (target: string, options?: object) => void };
    }).lenis;
    if (lenis) {
      e.preventDefault();
      lenis.scrollTo(href, { offset: 0, duration: 1.2 });
    }
  };

  const light = theme === "light";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[70] border-b transition-[transform,opacity,background-color,border-color] duration-500 ease-expo",
        revealed ? "opacity-100" : "-translate-y-2 opacity-0",
        hidden && "-translate-y-full",
        // Transparent over the hero so the art direction reads; a solid tint
        // matched to the section underneath once scrolled.
        // Use opacity steps Tailwind actually generates: `bg-ink/92` is not in
        // the default scale, so it compiles to nothing and the bar silently
        // stays transparent. That shipped broken once; keep to /95.
        scrolled
          ? light
            ? "border-navy/10 bg-surface/95"
            : "border-[var(--hairline)] bg-ink/95"
          : "border-transparent bg-transparent",
      )}
    >
      <div
        className={cn(
          "u-shell flex items-center justify-between py-5 transition-colors duration-300",
          // The text shadow only earns its keep while the bar is transparent
          // over dark media; on the tinted bar it just muddies the type.
          light || scrolled ? "" : "[text-shadow:0_1px_3px_rgba(8,16,32,0.55)]",
        )}
      >
        <a
          href={hrefFor("#top")}
          onClick={(e) => onNav(e, "#top")}
          className="flex items-baseline gap-2"
          data-cursor="hover"
        >
          <span
            className={cn(
              "font-sans text-lg font-semibold tracking-tight transition-colors",
              light ? "text-navy" : "text-white",
            )}
          >
            {site.wordmark.primary}
          </span>
          <span
            className={cn(
              "hidden font-mono text-[0.55rem] uppercase tracking-[0.35em] transition-colors sm:inline",
              light ? "text-accent" : "text-steel",
            )}
          >
            {site.wordmark.secondary}
          </span>
        </a>

        <nav className="hidden md:block" aria-label="Primary">
          <ul className="flex items-center gap-8">
            {site.nav.map((n) => {
              const linkClass = cn(
                "inline-flex min-h-[24px] items-center py-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] transition-colors",
                light ? "text-slate hover:text-navy" : "text-white/90 hover:text-white",
              );
              const children = "children" in n ? n.children : undefined;
              return children ? (
                <NavDropdown
                  key={n.href}
                  label={n.label}
                  href={hrefFor(n.href)}
                  items={children}
                  light={light}
                  linkClassName={linkClass}
                  onNavigate={onNav}
                  // The header translates fully off-screen on scroll-down; an
                  // open panel would ride along, so close it instead.
                  closeWhen={hidden || pathname}
                />
              ) : (
                <li key={n.href}>
                  <a
                    href={hrefFor(n.href)}
                    onClick={(e) => onNav(e, n.href)}
                    className={linkClass}
                    data-cursor="hover"
                  >
                    {n.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <a
          href={hrefFor("#contact")}
          onClick={(e) => onNav(e, "#contact")}
          className={cn(
            "hidden min-h-[24px] items-center py-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] transition-colors sm:inline-flex",
            light ? "text-accent hover:text-navy" : "text-white/85 hover:text-white",
          )}
          data-cursor="hover"
        >
          Get in touch
        </a>

        <MobileMenu light={light} />
      </div>
    </header>
  );
}
