import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";
import {
  buttonVariants,
  type ButtonRoundedOption,
  normalizeButtonRounded,
  resolveButtonStyles,
  resolveButtonIconFlags,
} from "@/utils/button";

export { buttonVariants };
export type { ButtonRoundedOption };

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof buttonVariants>, "rounded"> {
  asChild?: boolean;
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
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    const normalizedRounded = normalizeButtonRounded(rounded);

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

    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, rounded: normalizedRounded, className }))}
          style={dynamicStyles}
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
        style={dynamicStyles}
        ref={ref}
        {...props}
      >
        {showIconLeft && leftIcon}
        {children}
        {showIconRight && rightIcon}
      </Comp>
    );
  },
);

Button.displayName = "Button";
