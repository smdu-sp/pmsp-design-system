import { cva, type VariantProps } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-medium transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900",
        secondary:
          "bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
        info:
          "bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
        success:
          "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
        warning:
          "bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
        destructive:
          "bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
        outline:
          "bg-transparent text-slate-700 border border-slate-300 dark:text-slate-300 dark:border-slate-700",
        pmsp:
          "bg-[#0b3299] text-white border border-[#082878] shadow-xs",
      },
      size: {
        sm: "text-[11px] px-2 py-0.5 rounded-sm",
        md: "text-xs px-2.5 py-1 rounded-md",
        lg: "text-sm px-3 py-1.5 rounded-lg",
      },
      pill: {
        true: "!rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      pill: false,
    },
  },
);

export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];
export type BadgeSize = VariantProps<typeof badgeVariants>["size"];
