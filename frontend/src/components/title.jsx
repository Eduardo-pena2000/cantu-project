import { cn } from "@/lib/utils";

export function Title({ children, className }) {
  return (
    <h1
      className={cn(
        "text-lg font-semibold flex items-center gap-1.5 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
        className
      )}
    >
      {children}
    </h1>
  );
}
