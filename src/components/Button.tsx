import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import {
  buttonVariants,
  type ButtonRoundedOption,
  type ButtonTheme,
  normalizeButtonRounded,
  resolveButtonStyles,
  resolveButtonIconFlags,
  resolveButtonVariant,
} from "@/utils/button";

export { buttonVariants, resolveButtonVariant };
export type { ButtonRoundedOption, ButtonTheme };

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof buttonVariants>, "rounded"> {
  asChild?: boolean;
  theme?: ButtonTheme;
  rounded?: ButtonRoundedOption | boolean;
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
  /** Indica se o botão está em estado de carregamento / ação assíncrona */
  isLoading?: boolean;
  /** Texto anunciado para leitores de tela durante o carregamento (padrão: "Carregando...") */
  loadingText?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      theme,
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
      isLoading = false,
      loadingText = "Carregando...",
      disabled,
      style,
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    const normalizedRounded = normalizeButtonRounded(rounded);

    const resolvedVariant = resolveButtonVariant(variant, theme);

    const dynamicStyles = resolveButtonStyles({
      backgroundColor,
      textColor,
      borderRadius,
      style,
      rawProps: props,
    });

    const { showIconLeft, showIconRight } = resolveButtonIconFlags({
      iconLeft,
      iconRight,
      rawProps: props,
    });

    const isEffectivelyDisabled = Boolean(disabled || isLoading);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isEffectivelyDisabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onClick?.(e);
    };

    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant: resolvedVariant, size, rounded: normalizedRounded, className }))}
          style={dynamicStyles}
          ref={ref}
          aria-busy={isLoading ? "true" : undefined}
          aria-disabled={isEffectivelyDisabled ? "true" : undefined}
          onClick={handleClick}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant: resolvedVariant, size, rounded: normalizedRounded, className }))}
        style={dynamicStyles}
        ref={ref}
        disabled={isEffectivelyDisabled}
        aria-busy={isLoading ? "true" : undefined}
        aria-disabled={isEffectivelyDisabled ? "true" : undefined}
        onClick={handleClick}
        {...props}
      >
        {isLoading && (
          <span className="inline-flex shrink-0 animate-spin" aria-hidden="true">
            <Loader2 className="w-4 h-4" />
          </span>
        )}
        {isLoading && loadingText && (
          <span className="sr-only">{loadingText}</span>
        )}
        {!isLoading && showIconLeft && leftIcon && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        {children}
        {!isLoading && showIconRight && rightIcon && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </Comp>
    );
  },
);

Button.displayName = "Button";
