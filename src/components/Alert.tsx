import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { alertVariants } from "@/utils/alert";

const DEFAULT_ALERT_ICONS = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  destructive: AlertCircle,
  neutral: Info,
};

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof alertVariants> {
  /** Título em destaque do alerta */
  title?: React.ReactNode;
  /** Ícone customizado ou false para ocultar */
  icon?: React.ReactNode | boolean;
  /** Callback acionado ao clicar no botão de fechar */
  onClose?: () => void;
  /** Label de acessibilidade para o botão fechar */
  closeAriaLabel?: string;
  /** Ação ou botão opcional exibido à direita/rodapé */
  action?: React.ReactNode;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = "info",
      title,
      icon,
      onClose,
      closeAriaLabel = "Fechar alerta",
      action,
      children,
      ...props
    },
    ref,
  ) => {
    const resolvedVariant = variant || "info";
    const DefaultIcon = DEFAULT_ALERT_ICONS[resolvedVariant];

    let renderedIcon: React.ReactNode = null;
    if (icon === false) {
      renderedIcon = null;
    } else if (icon) {
      renderedIcon = icon;
    } else {
      renderedIcon = <DefaultIcon className="h-5 w-5 shrink-0 mt-0.5" />;
    }

    return (
      <div
        ref={ref}
        role={resolvedVariant === "destructive" || resolvedVariant === "warning" ? "alert" : "status"}
        className={cn(alertVariants({ variant: resolvedVariant }), className)}
        {...props}
      >
        {renderedIcon}
        <div className="flex-1 space-y-1">
          {title && <div className="font-semibold text-sm leading-tight">{title}</div>}
          {children && <div className="text-sm opacity-90 leading-relaxed">{children}</div>}
          {action && <div className="pt-2">{action}</div>}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label={closeAriaLabel}
            className="shrink-0 p-1 -mr-1 -mt-1 rounded-md opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-opacity cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  },
);

Alert.displayName = "Alert";
