"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLoaderGate } from "@/components/providers/LoaderGate";
import { cn } from "@/lib/cn";
import { site } from "@/content/site";
import { MobileMenu } from "./MobileMenu";

/** Minimal running header. Fades in after reveal; hides on scroll-down. */
export function Header() {
  const { revealed } = useLoaderGate();
  const [hidden, setHidden] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const lastY = useRef(0);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  // On the legal pages, hash targets live on the home page, so point there.
  const hrefFor = (h: string) => (isHome ? h : h === "#top" ? "/" : `/${h}`);

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

    let ticking = false;
    const compute = () => {
      ticking = false;
      const y = window.scrollY;
      setHidden(y > 140 && y > lastY.current);
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
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const onNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
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
        "fixed inset-x-0 top-0 z-[70] transition-[transform,opacity] duration-500 ease-expo",
        revealed ? "opacity-100" : "-translate-y-2 opacity-0",
        hidden && "-translate-y-full",
      )}
    >
      <div
        className={cn(
          "u-shell flex items-center justify-between py-5 transition-colors duration-300",
          light ? "" : "[text-shadow:0_1px_3px_rgba(8,16,32,0.55)]",
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

        <nav className="hidden items-center gap-8 md:flex">
          {site.nav.map((n) => (
            <a
              key={n.href}
              href={hrefFor(n.href)}
              onClick={(e) => onNav(e, n.href)}
              className={cn(
                "inline-flex min-h-[24px] items-center py-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] transition-colors",
                light ? "text-slate hover:text-navy" : "text-white/90 hover:text-white",
              )}
              data-cursor="hover"
            >
              {n.label}
            </a>
          ))}
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
