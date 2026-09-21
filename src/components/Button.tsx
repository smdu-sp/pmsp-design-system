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
  /** Cor de fundo customizada (hexadecimal '#...' ou variável CSS 'var(--...)' / '--...') */
  backgroundColor?: string;
  /** Cor do texto customizada (hexadecimal '#...' ou variável CSS 'var(--...)' / '--...') */
  textColor?: string;
  /** Raio da borda customizado (ex: '8px', '1rem', '9999px' ou valor numérico) */
  borderRadius?: string | number;
  /** Exibir ícone à esquerda (booleano) */
  iconLeft?: boolean;
  /** Exibir ícone à direita (booleano) */
  iconRight?: boolean;
  /** Elemento de ícone personalizado à esquerda */
  leftIcon?: React.ReactNode;
  /** Elemento de ícone personalizado à direita */
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      rounded = "md",
      asChild = false,
      backgroundColor,
      textColor,
      borderRadius,
      iconLeft = false,
      iconRight = false,
      leftIcon,
      rightIcon,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const normalizedRounded: RoundedOption =
      typeof rounded === "boolean" ? (rounded ? "full" : "none") : (rounded ?? "md");

    // Resolução de background-color (variável CSS ou hex)
    const rawBg = backgroundColor ?? (props as Record<string, any>)["background-color"];
    const resolvedBg = rawBg
      ? rawBg.startsWith("--")
        ? `var(${rawBg})`
        : rawBg
      : undefined;

    // Resolução de color / text-color (variável CSS ou hex)
    const rawTextColor = textColor ?? (props as Record<string, any>)["text-color"];
    const resolvedTextColor = rawTextColor
      ? rawTextColor.startsWith("--")
        ? `var(${rawTextColor})`
        : rawTextColor
      : undefined;

    // Resolução de border-radius (string ou number)
    const rawBr = borderRadius ?? (props as Record<string, any>)["border-radius"];
    const resolvedBr =
      typeof rawBr === "number"
        ? `${rawBr}px`
        : rawBr
        ? rawBr.startsWith("--")
          ? `var(${rawBr})`
          : rawBr
        : undefined;

    const dynamicStyles: React.CSSProperties = {
      ...(resolvedBg ? { backgroundColor: resolvedBg } : {}),
      ...(resolvedTextColor ? { color: resolvedTextColor } : {}),
      ...(resolvedBr ? { borderRadius: resolvedBr } : {}),
      ...style,
    };

    const showIconLeft = Boolean(iconLeft || (props as Record<string, any>)["icon-left"]);
    const showIconRight = Boolean(iconRight || (props as Record<string, any>)["icon-right"]);

    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, rounded: normalizedRounded, className }))}
          style={Object.keys(dynamicStyles).length > 0 ? dynamicStyles : undefined}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, rounded: normalizedRounded, className }))}
        style={Object.keys(dynamicStyles).length > 0 ? dynamicStyles : undefined}
        ref={ref}
        {...props}
      >
        {showIconLeft && leftIcon}
        {children}
        {showIconRight && rightIcon}
      </Comp>
    );
  }
);

Button.displayName = "Button";
