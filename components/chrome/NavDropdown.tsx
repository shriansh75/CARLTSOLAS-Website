"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export interface NavChild {
  label: string;
  href: string;
}

/**
 * Disclosure-navigation dropdown for a nav entry that has children.
 *
 * Deliberately NOT `role="menu"`: that role belongs to application menus and
 * makes assistive tech promise a different keyboard contract (arrow-only
 * navigation, Tab exits the whole widget). This is a list of links, so it
 * follows the ARIA disclosure navigation pattern - the parent stays a real
 * link and a separate caret button owns `aria-expanded`. That keeps /marine
 * clickable while the submenu is fully operable from the keyboard.
 *
 * The panel carries its own solid ground because the header is transparent by
 * design. No `backdrop-filter` here: on a fixed subtree it re-blurs every
 * scroll frame, which is the documented cause of this site's earlier
 * scroll-lag regression (DESIGN_SYSTEM.md).
 */
export function NavDropdown({
  label,
  href,
  items,
  light,
  linkClassName,
  onNavigate,
  closeWhen,
}: {
  label: string;
  href: string;
  items: readonly NavChild[];
  light: boolean;
  linkClassName: string;
  /** Shared Header nav handler: routes children through router.push. */
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  /** Changes to force the panel closed (header hiding on scroll, route change). */
  closeWhen: unknown;
}) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const wrapRef = useRef<HTMLLIElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const hoverTimer = useRef<number | null>(null);
  // Set when hover (rather than the user) opened the panel. Without this the
  // caret click blind-toggles a hover-opened panel straight shut, so on a
  // mouse the caret looks broken: hover opens it, the click closes it again.
  const openedByHover = useRef(false);

  const close = useCallback((focusTrigger = false) => {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  }, []);

  // Entrance transition: mount first, then flip the class on the next frame so
  // the transition actually runs. Closing unmounts immediately, which also
  // removes the links from the tab order.
  useEffect(() => {
    if (!open) {
      setShown(false);
      return;
    }
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, [open]);

  // The header slides fully off-screen on scroll-down and would carry an open
  // panel with it, so the parent flips `closeWhen` and we close instead.
  useEffect(() => {
    setOpen(false);
  }, [closeWhen]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close(true);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  useEffect(
    () => () => {
      if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    },
    [],
  );

  const canHover = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const onEnter = () => {
    if (!canHover()) return;
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    setOpen((wasOpen) => {
      if (!wasOpen) openedByHover.current = true;
      return true;
    });
  };
  const onLeave = () => {
    if (!canHover()) return;
    // Grace period so the diagonal travel from trigger to panel does not close
    // it mid-move.
    hoverTimer.current = window.setTimeout(() => {
      openedByHover.current = false;
      setOpen(false);
    }, 120);
  };

  const onTriggerClick = () => {
    // A click on a panel hover already opened should pin it open, not close
    // it. The next click then closes, which is what a mouse user expects.
    if (open && openedByHover.current) {
      openedByHover.current = false;
      return;
    }
    openedByHover.current = false;
    setOpen((v) => !v);
  };

  const focusItem = (i: number) => {
    const list = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];
    if (!list.length) return;
    list[(i + list.length) % list.length]?.focus();
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(-1));
    }
  };

  const onItemKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>, i: number) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusItem(i + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusItem(i - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusItem(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusItem(-1);
    }
  };

  return (
    <li
      ref={wrapRef}
      className="relative"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      // Tabbing out of the group closes it; focus moving between the trigger
      // and its own items keeps it open.
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <span className="inline-flex items-center gap-1.5">
        <a
          href={href}
          onClick={(e) => {
            setOpen(false);
            onNavigate(e, href);
          }}
          className={linkClassName}
          data-cursor="hover"
        >
          {label}
        </a>
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={`${label} submenu`}
          onClick={onTriggerClick}
          onKeyDown={onTriggerKeyDown}
          className={cn(
            "inline-flex h-6 w-4 items-center justify-center transition-colors",
            light ? "text-slate hover:text-navy" : "text-white/70 hover:text-white",
          )}
          data-cursor="hover"
        >
          <svg
            viewBox="0 0 10 6"
            className={cn(
              "h-[5px] w-[9px] transition-transform duration-300 ease-expo",
              open && "rotate-180",
            )}
            fill="none"
            aria-hidden
          >
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
          </svg>
        </button>
      </span>

      {open ? (
        <div
          id={panelId}
          className={cn(
            "absolute left-0 top-full z-10 mt-3 min-w-[16.5rem] border border-[var(--hairline)] bg-ink/95 p-1.5",
            "transition-[opacity,transform] duration-200 ease-expo [text-shadow:none]",
            shown ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
          )}
        >
          <ul>
            {items.map((child, i) => (
              <li key={`${child.href}-${child.label}`}>
                <a
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  href={child.href}
                  onClick={(e) => {
                    setOpen(false);
                    onNavigate(e, child.href);
                  }}
                  onKeyDown={(e) => onItemKeyDown(e, i)}
                  className="group flex items-center gap-3 px-3 py-2.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-white/75 transition-colors hover:bg-white/[0.05] hover:text-white"
                  data-cursor="hover"
                >
                  <span
                    className="h-1 w-1 shrink-0 rotate-45 border border-accent transition-colors group-hover:bg-accent"
                    aria-hidden
                  />
                  {child.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}
