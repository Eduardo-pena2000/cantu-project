import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-muted/50 rounded-md animate-pulse relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-sidebar-primary/20 before:to-transparent",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
