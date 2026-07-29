"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { site } from "@/content/site";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Lenis = { start: () => void; stop: () => void; scrollTo: (t: string, o?: object) => void };
const getLenis = () => (window as unknown as { lenis?: Lenis }).lenis;

const EXPO = [0.16, 1, 0.3, 1] as const;

/**
 * Mobile hamburger + full-screen nav overlay (shown below `md`). Locks Lenis and
 * body scroll while open, traps focus, and closes on ESC / nav / resize-to-desktop.
 * The hamburger colour follows the header's section theme (`light`).
 */
export function MobileMenu({ light }: { light: boolean }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const reduced = useReducedMotion();
  const uid = useId();
  // Which parent entry has its children expanded. Collapsed by default so the
  // list never overflows a short viewport, but pre-expanded when the visitor is
  // already inside that section, which is where they most likely want to move.
  const [expanded, setExpanded] = useState<string | null>(() =>
    pathname.startsWith("/marine") ? "/marine" : null,
  );

  // scroll lock + focus trap while open
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = panelRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (!items || items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    }, 60);

    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      document.documentElement.style.overflow = prevOverflow;
      lenis?.start();
    };
  }, [open]);

  // never leave a stranded scroll-locked overlay if the viewport grows to desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Real route: close the overlay (which releases the scroll lock) and
    // client-navigate. Without this the overlay would stay mounted while the
    // browser performed a full document load.
    if (href.startsWith("/")) {
      e.preventDefault();
      setOpen(false);
      router.push(href);
      return;
    }
    if (!href.startsWith("#")) return; // let mailto: etc. behave normally
    e.preventDefault();
    setOpen(false);
    // Off-home: the hash targets live on the home page, so route there.
    if (pathname !== "/") {
      router.push(href === "#top" ? "/" : `/${href}`);
      return;
    }
    window.setTimeout(() => {
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(href, { offset: 0, duration: 1.2 });
      else document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 90);
  };

  const barCls = open ? "bg-white" : light ? "bg-navy" : "bg-white";

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative z-[95] -mr-1 flex h-11 w-11 items-center justify-center"
        data-cursor="hover"
      >
        <span className="relative block h-3 w-6">
          <span
            className={cn(
              "absolute left-0 top-0 h-px w-6 transition-all duration-300 ease-expo",
              open && "translate-y-[5px] rotate-45",
              barCls,
            )}
          />
          <span
            className={cn(
              "absolute bottom-0 left-0 h-px w-6 transition-all duration-300 ease-expo",
              open && "-translate-y-[6px] -rotate-45",
              barCls,
            )}
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: EXPO }}
            className="fixed inset-0 z-[90] flex flex-col bg-ink text-white"
          >
            <div className="u-shell flex flex-1 flex-col justify-center pb-16 pt-24">
              <motion.ul
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
                className="flex flex-col gap-1"
              >
                {site.nav.map((n) => {
                  const children = "children" in n ? n.children : undefined;
                  const isExpanded = expanded === n.href;
                  const subId = `${uid}-${n.href.replace(/\W+/g, "-")}`;
                  const linkCls =
                    "block py-2 text-[clamp(2rem,11vw,3.5rem)] font-medium tracking-[-0.01em] text-white transition-colors hover:text-steel";
                  return (
                    <motion.li
                      key={n.href}
                      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
                      transition={{ duration: 0.5, ease: EXPO }}
                    >
                      {children ? (
                        <>
                          <div className="flex items-center justify-between gap-3">
                            <a href={n.href} onClick={(e) => go(e, n.href)} className={linkCls}>
                              {n.label}
                            </a>
                            <button
                              type="button"
                              aria-expanded={isExpanded}
                              aria-controls={subId}
                              aria-label={`${n.label} submenu`}
                              onClick={() => setExpanded(isExpanded ? null : n.href)}
                              className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center text-steel transition-colors hover:text-white"
                            >
                              <svg
                                viewBox="0 0 14 8"
                                className={cn(
                                  "h-[7px] w-[13px] transition-transform duration-300 ease-expo",
                                  isExpanded && "rotate-180",
                                )}
                                fill="none"
                                aria-hidden
                              >
                                <path
                                  d="M1 1L7 7L13 1"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                  strokeLinecap="square"
                                />
                              </svg>
                            </button>
                          </div>
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.ul
                                id={subId}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: reduced ? 0 : 0.32, ease: EXPO }}
                                className="overflow-hidden pl-1"
                              >
                                {children.map((c) => (
                                  <li key={c.href}>
                                    <a
                                      href={c.href}
                                      onClick={(e) => go(e, c.href)}
                                      className="flex items-center gap-3 py-2.5 font-mono text-[0.78rem] uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white"
                                    >
                                      <span
                                        className="h-1 w-1 shrink-0 rotate-45 border border-accent"
                                        aria-hidden
                                      />
                                      {c.label}
                                    </a>
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <a href={n.href} onClick={(e) => go(e, n.href)} className={linkCls}>
                          {n.label}
                        </a>
                      )}
                    </motion.li>
                  );
                })}
              </motion.ul>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5, ease: EXPO }}
                className="mt-10 flex flex-col gap-4 border-t border-[var(--hairline)] pt-8 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-meta"
              >
                <a
                  href="#contact"
                  onClick={(e) => go(e, "#contact")}
                  className="text-steel transition-colors hover:text-white"
                >
                  Get in touch
                </a>
                <a
                  href={`mailto:${site.footer.email}`}
                  className="tracking-normal text-white/70 transition-colors hover:text-white"
                >
                  {site.footer.email}
                </a>
                <span>{site.group}</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
