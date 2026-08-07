import { cn } from "@/lib/cn";

/** Section marker echoing the deck's drafting system: an optional index, a rule,
 *  and the label. Omit `index` for a clean, un-numbered section title.
 *
 *  Three contexts, not two. `onDark` assumes a flat ink panel, where the muted
 *  `text-meta` label is a deliberate hierarchy choice. Over a PHOTOGRAPH the
 *  same grey measured 3.66:1 against a bright sky on the flag-state hero, under
 *  the 4.5:1 floor for text this size. `onPhoto` keeps the drafting look but
 *  lifts the label and the rule to a luminance that survives whatever is behind
 *  it. */
export function SectionIndex({
  index,
  label,
  variant = "onDark",
  className,
}: {
  index?: string;
  label: string;
  variant?: "onLight" | "onDark" | "onPhoto";
  className?: string;
}) {
  const numberCls = variant === "onLight" ? "text-accent" : "text-steel";
  const labelCls =
    variant === "onLight" ? "text-slate" : variant === "onPhoto" ? "text-white/85" : "text-meta";
  const ruleCls =
    variant === "onLight" ? "bg-slate" : variant === "onPhoto" ? "bg-white/45" : "bg-[var(--hairline-strong)]";
  return (
    <div
      className={cn(
        "flex items-center gap-4 font-mono text-[0.7rem] uppercase tracking-[0.2em]",
        className,
      )}
    >
      {index ? <span className={numberCls}>{index}</span> : null}
      <span className={cn("h-px w-10", ruleCls)} />
      <span className={labelCls}>{label}</span>
    </div>
  );
}
