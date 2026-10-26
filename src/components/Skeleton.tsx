import * as React from "react";
import { cn } from "@/utils/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Formato do placeholder ('text' | 'circular' | 'rectangular') */
  shape?: "text" | "circular" | "rectangular";
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, shape = "rectangular", ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          "animate-pulse bg-slate-200 dark:bg-slate-800",
          shape === "circular" && "rounded-full",
          shape === "text" && "h-4 w-full rounded-sm",
          shape === "rectangular" && "rounded-md",
          className,
        )}
        {...props}
      />
    );
  },
);

Skeleton.displayName = "Skeleton";
