import * as React from "react";
import { cn } from "@/utils/cn";

export interface TooltipProps {
  /** Texto ou conteúdo explicativo do tooltip */
  content: React.ReactNode;
  /** Posição relativa ao elemento gatilho ('top' | 'bottom' | 'left' | 'right') */
  position?: "top" | "bottom" | "left" | "right";
  /** Delay em milissegundos antes de exibir (padrão: 150ms) */
  delay?: number;
  /** Elemento que recebe o tooltip */
  children: React.ReactElement;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = "top",
  delay = 150,
  children,
  className,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const timeoutRef = React.useRef<any>(null);
  const tooltipId = React.useId();

  const show = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const hide = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide}>
      {React.cloneElement(children as React.ReactElement<any>, {
        onFocus: (e: any) => {
          show();
          (children as any).props?.onFocus?.(e);
        },
        onBlur: (e: any) => {
          hide();
          (children as any).props?.onBlur?.(e);
        },
        "aria-describedby": isVisible ? tooltipId : undefined,
      })}

      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={cn(
            "absolute z-50 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1 text-xs text-white shadow-md dark:bg-slate-100 dark:text-slate-900 pointer-events-none animate-in fade-in-0 zoom-in-95 duration-150",
            positionClasses[position],
            className,
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};

Tooltip.displayName = "Tooltip";
