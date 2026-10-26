import { cva, type VariantProps } from "class-variance-authority";

export const inputVariants = cva(
  "flex w-full rounded-md border bg-white text-slate-900 transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500",
  {
    variants: {
      variant: {
        default:
          "border-slate-300 focus-visible:border-slate-900 focus-visible:ring-slate-950/20 dark:border-slate-700 dark:focus-visible:border-slate-100 dark:focus-visible:ring-slate-100/20",
        pmsp:
          "border-slate-300 focus-visible:border-[#0b3299] focus-visible:ring-[#0b3299]/20 shadow-xs",
        error:
          "border-rose-500 text-rose-900 focus-visible:border-rose-600 focus-visible:ring-rose-500/20 dark:border-rose-700 dark:text-rose-200",
      },
      inputSize: {
        sm: "h-8 px-2.5 text-xs",
        md: "h-10 px-3 py-2 text-sm",
        lg: "h-12 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
    },
  },
);

export type InputVariant = VariantProps<typeof inputVariants>["variant"];
export type InputSize = VariantProps<typeof inputVariants>["inputSize"];
