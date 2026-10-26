import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { inputVariants, type InputVariant, type InputSize } from "@/utils/input";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  /** Ícone exibido à esquerda dentro do campo */
  leftIcon?: React.ReactNode;
  /** Ícone ou elemento exibido à direita dentro do campo */
  rightIcon?: React.ReactNode;
  /** Indica estado de erro visual e semântico */
  isInvalid?: boolean;
  /** Exibe indicador de carregamento à direita */
  isLoading?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = "default",
      inputSize = "md",
      type = "text",
      leftIcon,
      rightIcon,
      isInvalid = false,
      isLoading = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    const resolvedVariant: InputVariant = isInvalid ? "error" : variant;

    if (!leftIcon && !rightIcon && !isLoading) {
      return (
        <input
          type={type}
          ref={ref}
          disabled={disabled || isLoading}
          aria-invalid={isInvalid}
          className={cn(inputVariants({ variant: resolvedVariant, inputSize }), className)}
          {...props}
        />
      );
    }

    return (
      <div className="relative flex w-full items-center">
        {leftIcon && (
          <div className="absolute left-3 flex items-center justify-center pointer-events-none text-slate-400 dark:text-slate-500 [&>svg]:h-4 [&>svg]:w-4">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          disabled={disabled || isLoading}
          aria-invalid={isInvalid}
          className={cn(
            inputVariants({ variant: resolvedVariant, inputSize }),
            leftIcon && "pl-9",
            (rightIcon || isLoading) && "pr-9",
            className,
          )}
          {...props}
        />
        {(rightIcon || isLoading) && (
          <div className="absolute right-3 flex items-center justify-center text-slate-400 dark:text-slate-500 [&>svg]:h-4 [&>svg]:w-4">
            {isLoading ? <Loader2 className="animate-spin" /> : rightIcon}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Rótulo textual do campo */
  label?: string;
  /** Identificador único do input associado */
  htmlFor?: string;
  /** Marca o campo com asterisco de obrigatoriedade */
  required?: boolean;
  /** Texto explicativo ou de instrução */
  helperText?: string;
  /** Mensagem de erro exibida quando o campo é inválido */
  errorMessage?: string;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, label, htmlFor, required, helperText, errorMessage, children, ...props }, ref) => {
    const errorId = htmlFor ? `${htmlFor}-error` : undefined;
    const helperId = htmlFor ? `${htmlFor}-helper` : undefined;

    return (
      <div ref={ref} className={cn("flex flex-col gap-1.5 w-full", className)} {...props}>
        {label && (
          <label
            htmlFor={htmlFor}
            className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center gap-1 select-none"
          >
            {label}
            {required && <span className="text-rose-500 font-semibold" aria-hidden="true">*</span>}
          </label>
        )}
        {children}
        {errorMessage ? (
          <p id={errorId} role="alert" className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
            {errorMessage}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

FormField.displayName = "FormField";
