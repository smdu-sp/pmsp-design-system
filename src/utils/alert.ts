import { cva, type VariantProps } from "class-variance-authority";

export const alertVariants = cva(
  "relative w-full rounded-lg border p-4 text-sm transition-all flex items-start gap-3",
  {
    variants: {
      variant: {
        info:
          "bg-blue-50/80 border-blue-200 text-blue-900 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-200 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400",
        success:
          "bg-emerald-50/80 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-200 [&>svg]:text-emerald-600 dark:[&>svg]:text-emerald-400",
        warning:
          "bg-amber-50/80 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-200 [&>svg]:text-amber-600 dark:[&>svg]:text-amber-400",
        destructive:
          "bg-rose-50/80 border-rose-200 text-rose-900 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-200 [&>svg]:text-rose-600 dark:[&>svg]:text-rose-400",
        neutral:
          "bg-slate-50 border-slate-200 text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 [&>svg]:text-slate-600 dark:[&>svg]:text-slate-400",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);

export type AlertVariant = VariantProps<typeof alertVariants>["variant"];
