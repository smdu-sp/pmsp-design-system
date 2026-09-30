import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";

export interface DropdownProps {
  /** Estado de abertura controlado */
  open?: boolean;
  /** Estado de abertura inicial em modo não controlado */
  defaultOpen?: boolean;
  /** Callback acionado ao alterar o estado de abertura */
  onOpenChange?: (open: boolean) => void;
  /** Elemento ou função renderizadora que atua como gatilho do dropdown */
  trigger: React.ReactNode | ((props: { isOpen: boolean; toggle: () => void }) => React.ReactNode);
  /** Conteúdo exibido dentro do menu dropdown */
  children: React.ReactNode;
  /** Alinhamento horizontal do menu em relação ao gatilho */
  align?: "left" | "center" | "right";
  /** Classes CSS adicionais para o container flutuante do popover */
  className?: string;
  /** Estilos inline adicionais para o container do popover */
  style?: React.CSSProperties;
  /** Largura máxima ou largura personalizada do dropdown (padrão: 260px) */
  width?: number;
  /** Se o dropdown deve ser renderizado via Portal diretamente no document.body (padrão: true) */
  portal?: boolean;
  /** Rótulo acessível da janela do dropdown */
  ariaLabel?: string;
}

export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      open,
      defaultOpen = false,
      onOpenChange,
      trigger,
      children,
      align = "left",
      className,
      style,
      width = 260,
      portal = true,
      ariaLabel = "Menu de opções",
    },
    ref,
  ) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;

    const [isMounted, setIsMounted] = React.useState(false);
    const [isVisible, setIsVisible] = React.useState(false);
    const [coords, setCoords] = React.useState<{ top: number; left: number; placement: "bottom" | "top" }>({
      top: 0,
      left: 0,
      placement: "bottom",
    });

    const triggerContainerRef = React.useRef<HTMLDivElement>(null);
    const popoverRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => triggerContainerRef.current!);

    const handleSetOpen = React.useCallback(
      (nextOpen: boolean) => {
        if (!isControlled) {
          setInternalOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
      },
      [isControlled, onOpenChange],
    );

    const toggle = React.useCallback(() => {
      handleSetOpen(!isOpen);
    }, [handleSetOpen, isOpen]);

    // Atualiza o posicionamento fixo do popover na tela ancorado ao trigger
    const updatePosition = React.useCallback(() => {
      if (!triggerContainerRef.current) return;
      const rect = triggerContainerRef.current.getBoundingClientRect();

      // Fecha se o gatilho foi rolado completamente para fora da tela
      if (rect.bottom < -50 || rect.top > window.innerHeight + 50) {
        handleSetOpen(false);
        return;
      }

      const dropdownWidth = width;
      const dropdownEstimatedHeight = 320;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Inverte para cima se o espaço inferior for insuficiente
      const spaceBelow = viewportHeight - rect.bottom;
      const shouldFlipToTop = spaceBelow < dropdownEstimatedHeight && rect.top > dropdownEstimatedHeight;

      let left: number;
      if (align === "right") {
        left = rect.right - dropdownWidth;
      } else if (align === "center") {
        left = rect.left + rect.width / 2 - dropdownWidth / 2;
      } else {
        left = rect.left;
      }

      // Garante margem de segurança de 12px das bordas da tela
      const clampedLeft = Math.max(12, Math.min(left, viewportWidth - dropdownWidth - 12));

      setCoords({
        top: rect.bottom + 6,
        left: clampedLeft,
        placement: shouldFlipToTop ? "top" : "bottom",
      });
    }, [align, width, handleSetOpen]);

    // Animação de entrada e saída (abertura e fechamento fluidos)
    React.useEffect(() => {
      if (isOpen) {
        updatePosition();
        setIsMounted(true);
        const raf = requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsVisible(true);
          });
        });
        return () => cancelAnimationFrame(raf);
      } else {
        setIsVisible(false);
        const timer = setTimeout(() => {
          setIsMounted(false);
        }, 150);
        return () => clearTimeout(timer);
      }
    }, [isOpen, updatePosition]);

    // Acompanha a rolagem da página e da tabela para reposicionar o menu
    React.useEffect(() => {
      if (!isOpen) return;

      const handleScrollOrResize = () => {
        updatePosition();
      };

      window.addEventListener("scroll", handleScrollOrResize, true);
      window.addEventListener("resize", handleScrollOrResize);

      return () => {
        window.removeEventListener("scroll", handleScrollOrResize, true);
        window.removeEventListener("resize", handleScrollOrResize);
      };
    }, [isOpen, updatePosition]);

    // Fecha ao clicar fora ou ao pressionar Escape
    React.useEffect(() => {
      if (!isOpen) return;

      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        const target = event.target as Node;
        if (
          popoverRef.current &&
          !popoverRef.current.contains(target) &&
          triggerContainerRef.current &&
          !triggerContainerRef.current.contains(target)
        ) {
          handleSetOpen(false);
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          handleSetOpen(false);
          const button = triggerContainerRef.current?.querySelector("button");
          button?.focus();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [isOpen, handleSetOpen]);

    const fixedStyles: React.CSSProperties = {
      position: "fixed",
      left: `${coords.left}px`,
      ...(coords.placement === "top"
        ? {
            bottom: `${
              triggerContainerRef.current
                ? window.innerHeight - triggerContainerRef.current.getBoundingClientRect().top + 6
                : 0
            }px`,
          }
        : { top: `${coords.top}px` }),
      ...style,
    };

    const popoverContent = (
      <div
        ref={popoverRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        onClick={(e) => e.stopPropagation()}
        style={fixedStyles}
        className={cn(
          "z-[9999] min-w-[220px] max-w-xs w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl shadow-slate-900/20 border border-slate-200/90 ring-1 ring-slate-900/5 p-3.5 text-xs text-slate-800",
          "transform-gpu transition-all motion-reduce:transition-none",
          isVisible
            ? "opacity-100 scale-100 translate-y-0 duration-200 ease-out"
            : coords.placement === "top"
              ? "opacity-0 scale-95 translate-y-2 duration-150 ease-in pointer-events-none"
              : "opacity-0 scale-95 -translate-y-2 duration-150 ease-in pointer-events-none",
          className,
        )}
      >
        {children}
      </div>
    );

    return (
      <div ref={triggerContainerRef} className="relative inline-flex items-center">
        <div
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
          className="inline-flex items-center"
        >
          {typeof trigger === "function" ? trigger({ isOpen, toggle }) : trigger}
        </div>

        {isMounted &&
          typeof document !== "undefined" &&
          (portal ? createPortal(popoverContent, document.body) : popoverContent)}
      </div>
    );
  },
);

Dropdown.displayName = "Dropdown";
