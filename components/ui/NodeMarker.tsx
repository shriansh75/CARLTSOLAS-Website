import { cn } from "@/lib/cn";

/** Small square "node" marker used on hairlines and relationship diagrams. */
export function NodeMarker({
  filled = false,
  className,
}: {
  filled?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block h-2 w-2 rotate-45 border border-accent",
        filled ? "bg-accent" : "bg-transparent",
        className,
      )}
    />
  );
}
