import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-slate-900 text-white shadow-sm hover:bg-slate-800 active:scale-[0.98] focus-visible:ring-slate-950 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-100",
        secondary:
          "bg-slate-100 text-slate-900 border border-slate-200 hover:bg-slate-200 active:scale-[0.98] focus-visible:ring-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-700",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 py-2 text-sm",
        lg: "h-12 px-6 text-base",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      rounded: "md",
    },
  }
);

type RoundedOption = "none" | "sm" | "md" | "lg" | "full";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof buttonVariants>, "rounded"> {
  asChild?: boolean;
  rounded?: RoundedOption | boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const normalizedRounded: RoundedOption =
      typeof rounded === "boolean" ? (rounded ? "full" : "none") : (rounded ?? "md");

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, rounded: normalizedRounded, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
