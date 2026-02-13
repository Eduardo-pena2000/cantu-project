import { cn } from "@/lib/utils";

export function Subtitle({ children, className }) {
  return (
    <h2
      className={cn(
        "font-semibold flex items-center gap-1.5 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
        className
      )}
    >
      {children}
    </h2>
  );
}
