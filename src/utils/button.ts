import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

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
  },
);

export type ButtonRoundedOption = "none" | "sm" | "md" | "lg" | "full";
export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Normaliza a opção de arredondamento do botão aceitando valores booleanos ou opções pré-definidas.
 */
export function normalizeButtonRounded(
  rounded?: ButtonRoundedOption | boolean,
): ButtonRoundedOption {
  if (typeof rounded === "boolean") {
    return rounded ? "full" : "none";
  }
  return rounded ?? "md";
}

/**
 * Resolve strings com variáveis CSS ('--...') ou valores literais e numéricos com unidade padrão.
 */
export function resolveCssVariableOrValue(
  value?: string | number,
  defaultUnit = "px",
): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "number") return `${value}${defaultUnit}`;
  const trimmed = String(value).trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("--")) return `var(${trimmed})`;
  return trimmed;
}

export interface ResolveButtonStylesParams {
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string | number;
  style?: React.CSSProperties;
  rawProps?: Record<string, any>;
}

/**
 * Resolve estilos CSS dinâmicos inline para o botão (cor de fundo, cor do texto e raio de borda).
 */
export function resolveButtonStyles({
  backgroundColor,
  textColor,
  borderRadius,
  style,
  rawProps,
}: ResolveButtonStylesParams): React.CSSProperties | undefined {
  const rawBg = backgroundColor ?? rawProps?.["background-color"];
  const resolvedBg = resolveCssVariableOrValue(rawBg);

  const rawTextColor = textColor ?? rawProps?.["text-color"];
  const resolvedTextColor = resolveCssVariableOrValue(rawTextColor);

  const rawBr = borderRadius ?? rawProps?.["border-radius"];
  const resolvedBr = resolveCssVariableOrValue(rawBr);

  const dynamicStyles: React.CSSProperties = {
    ...(resolvedBg ? { backgroundColor: resolvedBg } : {}),
    ...(resolvedTextColor ? { color: resolvedTextColor } : {}),
    ...(resolvedBr ? { borderRadius: resolvedBr } : {}),
    ...style,
  };

  return Object.keys(dynamicStyles).length > 0 ? dynamicStyles : undefined;
}

export interface ResolveButtonIconFlagsParams {
  iconLeft?: boolean;
  iconRight?: boolean;
  rawProps?: Record<string, any>;
}

/**
 * Resolve as flags de visibilidade de ícones à esquerda e à direita do botão.
 */
export function resolveButtonIconFlags({
  iconLeft = false,
  iconRight = false,
  rawProps,
}: ResolveButtonIconFlagsParams): { showIconLeft: boolean; showIconRight: boolean } {
  const showIconLeft = Boolean(iconLeft || rawProps?.["icon-left"]);
  const showIconRight = Boolean(iconRight || rawProps?.["icon-right"]);
  return { showIconLeft, showIconRight };
}
