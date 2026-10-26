import * as React from "react";
import { cn } from "@/utils/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Indica estado de erro */
  isInvalid?: boolean;
  /** Exibe contador dinâmico de caracteres quando maxLength é informado */
  showCount?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      isInvalid = false,
      showCount = false,
      maxLength,
      value,
      defaultValue,
      onChange,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [currentLength, setCurrentLength] = React.useState<number>(() => {
      if (typeof value === "string") return value.length;
      if (typeof defaultValue === "string") return defaultValue.length;
      return 0;
    });

    React.useEffect(() => {
      if (typeof value === "string") {
        setCurrentLength(value.length);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCurrentLength(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className="flex flex-col w-full">
        <textarea
          ref={ref}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          aria-invalid={isInvalid}
          className={cn(
            "flex min-h-[90px] w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500",
            isInvalid
              ? "border-rose-500 focus-visible:border-rose-600 focus-visible:ring-rose-500/20 dark:border-rose-700"
              : "border-slate-300 focus-visible:border-[#0b3299] focus-visible:ring-[#0b3299]/20 dark:border-slate-700 dark:focus-visible:border-slate-100",
            className,
          )}
          {...props}
        />
        {showCount && maxLength !== undefined && (
          <div className="mt-1 text-right text-xs text-slate-400 dark:text-slate-500 select-none">
            {currentLength} / {maxLength}
          </div>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
