import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import { badgeVariants } from "@/utils/badge";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Ícone exibido à esquerda */
  icon?: React.ReactNode;
  /** Exibir botão de remoção/fechar no badge */
  onRemove?: () => void;
  /** Label de acessibilidade para o botão de remoção */
  removeAriaLabel?: string;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      pill,
      icon,
      onRemove,
      removeAriaLabel = "Remover",
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size, pill }), className)}
        {...props}
      >
        {icon && <span className="inline-flex shrink-0">{icon}</span>}
        <span>{children}</span>
        {onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            aria-label={removeAriaLabel}
            className="ml-0.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        )}
      </span>
    );
  },
);

Badge.displayName = "Badge";
