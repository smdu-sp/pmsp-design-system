import * as React from "react";
import { createPortal } from "react-dom";
import { ChevronDown, MoreVertical } from "lucide-react";
import { cn } from "@/utils/cn";

export interface DropdownProps {
  /** Estado de abertura controlado */
  open?: boolean;
  /** Estado de abertura inicial em modo não controlado */
  defaultOpen?: boolean;
  /** Callback acionado ao alterar o estado de abertura */
  onOpenChange?: (open: boolean) => void;
  /** Elemento ou função renderizadora que atua como gatilho customizado do dropdown */
  trigger?: React.ReactNode | ((props: { isOpen: boolean; toggle: () => void }) => React.ReactNode);
  /** Texto ou rótulo exibido no botão gatilho padrão */
  label?: React.ReactNode;
  /** Alias para o rótulo do gatilho padrão */
  triggerText?: React.ReactNode;
  /** Exibir ícone à esquerda no botão gatilho padrão */
  iconLeft?: boolean;
  /** Exibir ícone à direita no botão gatilho padrão */
  iconRight?: boolean;
  /** Elemento de ícone personalizado à esquerda */
  leftIcon?: React.ReactNode;
  /** Elemento de ícone personalizado à direita */
  rightIcon?: React.ReactNode;
  /** Classes CSS adicionais para o botão gatilho padrão */
  triggerClassName?: string;
  /** Variante visual do botão gatilho padrão */
  triggerVariant?: "outline" | "primary" | "secondary" | "ghost";
  /** Tamanho do botão gatilho padrão */
  size?: "sm" | "md" | "lg";
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
  /** Duração em milissegundos da animação de opacidade ao abrir e fechar (padrão: 200) */
  animationDuration?: number;
  /** Se o dropdown deve ser renderizado via Portal diretamente no document.body (padrão: true) */
  portal?: boolean;
  /** Rótulo acessível da janela do dropdown */
  ariaLabel?: string;
}

const DropdownComponent = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      open,
      defaultOpen = false,
      onOpenChange,
      trigger,
      label,
      triggerText,
      iconLeft,
      iconRight,
      leftIcon,
      rightIcon,
      triggerClassName,
      triggerVariant = "outline",
      size = "md",
      children,
      align = "left",
      className,
      style,
      width = 260,
      animationDuration = 200,
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

    // Calcula as coordenadas do dropdown com base na posição do trigger na tela
    const calculateCoords = React.useCallback(() => {
      if (!triggerContainerRef.current) return null;
      const rect = triggerContainerRef.current.getBoundingClientRect();

      // Fecha se o gatilho foi rolado completamente para fora da tela
      if (rect.bottom < -50 || rect.top > window.innerHeight + 50) {
        return null;
      }

      const dropdownWidth = width;
      const dropdownEstimatedHeight = 320;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Inverte para cima se o espaço inferior for insuficiente
      const spaceBelow = viewportHeight - rect.bottom;
      const shouldFlipToTop =
        spaceBelow < dropdownEstimatedHeight && rect.top > dropdownEstimatedHeight;

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

      return {
        top: rect.bottom + 6,
        left: clampedLeft,
        placement: shouldFlipToTop ? ("top" as const) : ("bottom" as const),
      };
    }, [align, width]);

    // Atualiza o posicionamento fixo do popover ancorado ao trigger
    const updatePosition = React.useCallback(() => {
      const nextCoords = calculateCoords();
      if (!nextCoords) {
        handleSetOpen(false);
        return;
      }
      setCoords(nextCoords);
    }, [calculateCoords, handleSetOpen]);

    // Animação de entrada (fade-in) e saída (fade-out) fluida com opacidade
    const isFirstRender = React.useRef(true);

    React.useEffect(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        if (!isOpen) return;
      }

      if (isOpen) {
        // Pré-posiciona antes de iniciar a transição para evitar saltos visuais
        const initialCoords = calculateCoords();
        if (initialCoords) {
          setCoords(initialCoords);
        }
        setIsMounted(true);
        // Garante que o elemento seja montado com opacity-0 antes de transicionar para opacity-100
        const raf = requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsVisible(true);
          });
        });
        return () => cancelAnimationFrame(raf);
      } else {
        // Inicia a animação de fade-out (opacidade 100 -> 0)
        setIsVisible(false);
        // Aguarda a duração total da transição antes de remover do DOM
        const timer = setTimeout(() => {
          setIsMounted(false);
        }, animationDuration);
        return () => clearTimeout(timer);
      }
    }, [isOpen, animationDuration, calculateCoords]);

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
      transitionDuration: `${animationDuration}ms`,
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
          "transform-gpu motion-reduce:transition-none",
          "transition-[opacity,transform] will-change-[opacity,transform]",
          isVisible
            ? "opacity-100 scale-100 translate-y-0 ease-out"
            : coords.placement === "top"
              ? "opacity-0 scale-95 translate-y-2 ease-in pointer-events-none"
              : "opacity-0 scale-95 -translate-y-2 ease-in pointer-events-none",
          className,
        )}
      >
        {children}
      </div>
    );

    const resolvedLabel = label !== undefined ? label : triggerText;
    const hasText =
      resolvedLabel !== undefined &&
      resolvedLabel !== null &&
      resolvedLabel !== "";

    const showIconLeft = iconLeft !== undefined ? iconLeft : Boolean(leftIcon);
    const showIconRight = iconRight !== undefined ? iconRight : Boolean(rightIcon);

    const defaultChevron = (
      <ChevronDown
        className={cn(
          "w-4 h-4 text-slate-500 transition-transform duration-200",
          isOpen && "rotate-180",
        )}
      />
    );
    const defaultLeftIcon = <MoreVertical className="w-4 h-4 text-slate-500" />;

    const resolvedLeftIcon = leftIcon ?? (showIconLeft ? defaultLeftIcon : null);
    const resolvedRightIcon = rightIcon ?? (showIconRight ? defaultChevron : null);

    // Se nenhum gatilho customizado for fornecido e nenhum texto/ícone for configurado
    const fallbackNeeded = !trigger && !hasText && !showIconLeft && !showIconRight;

    // Detecta se é um botão de apenas um ícone (sem texto e com apenas um dos lados com ícone)
    const isSingleIcon =
      !hasText &&
      ((showIconLeft && !showIconRight) ||
        (!showIconLeft && showIconRight) ||
        fallbackNeeded);

    const sizeClasses = {
      sm: hasText
        ? "h-8 px-2.5 text-xs rounded-md gap-1.5"
        : isSingleIcon
          ? "w-8 h-8 p-0 rounded-md justify-center"
          : "h-8 px-2 text-xs rounded-md gap-1 justify-center",
      md: hasText
        ? "h-9 px-3.5 text-sm rounded-lg gap-2"
        : isSingleIcon
          ? "w-9 h-9 p-0 rounded-lg justify-center"
          : "h-9 px-2.5 text-sm rounded-lg gap-1.5 justify-center",
      lg: hasText
        ? "h-11 px-4 text-base rounded-xl gap-2.5"
        : isSingleIcon
          ? "w-11 h-11 p-0 rounded-xl justify-center"
          : "h-11 px-3 text-base rounded-xl gap-2 justify-center",
    };

    const variantClasses = {
      outline:
        "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 shadow-2xs",
      primary:
        "bg-slate-900 border border-slate-900 text-white hover:bg-slate-800 active:scale-[0.98] shadow-sm",
      secondary:
        "bg-slate-100 border border-slate-200 text-slate-900 hover:bg-slate-200 active:scale-[0.98]",
      ghost:
        "bg-transparent border border-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200",
    };

    const renderDefaultTrigger = () => (
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={
          typeof resolvedLabel === "string" && resolvedLabel
            ? resolvedLabel
            : ariaLabel || "Menu de opções"
        }
        className={cn(
          "inline-flex items-center font-medium transition-all duration-150 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
          variantClasses[triggerVariant],
          sizeClasses[size],
          isOpen &&
            (triggerVariant === "primary"
              ? "ring-2 ring-slate-950/20"
              : "bg-slate-50 border-slate-400 ring-2 ring-slate-400/20"),
          triggerClassName,
        )}
      >
        {fallbackNeeded ? (
          <span className="shrink-0 inline-flex items-center justify-center">
            <MoreVertical className="w-4 h-4 text-slate-600" />
          </span>
        ) : (
          <>
            {showIconLeft && resolvedLeftIcon && (
              <span className="shrink-0 inline-flex items-center justify-center">
                {resolvedLeftIcon}
              </span>
            )}
            {hasText && <span className="truncate">{resolvedLabel}</span>}
            {showIconRight && resolvedRightIcon && (
              <span className="shrink-0 inline-flex items-center justify-center">
                {resolvedRightIcon}
              </span>
            )}
          </>
        )}
      </button>
    );

    const triggerElement = trigger
      ? typeof trigger === "function"
        ? trigger({ isOpen, toggle })
        : trigger
      : renderDefaultTrigger();

    return (
      <div ref={triggerContainerRef} className="relative inline-flex items-center">
        <div
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
          className="inline-flex items-center"
        >
          {triggerElement}
        </div>

        {isMounted &&
          typeof document !== "undefined" &&
          (portal ? createPortal(popoverContent, document.body) : popoverContent)}
      </div>
    );
  },
);

DropdownComponent.displayName = "Dropdown";

export interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Rótulo ou conteúdo textual do item */
  label?: React.ReactNode;
  /** Exibir ícone à esquerda */
  iconLeft?: boolean;
  /** Exibir ícone à direita */
  iconRight?: boolean;
  /** Elemento de ícone personalizado à esquerda */
  leftIcon?: React.ReactNode;
  /** Elemento de ícone personalizado à direita */
  rightIcon?: React.ReactNode;
  /** Variante de cor do item ('default' | 'danger') */
  variant?: "default" | "danger";
}

export const DropdownItem = React.forwardRef<HTMLButtonElement, DropdownItemProps>(
  (
    {
      children,
      label,
      iconLeft,
      iconRight,
      leftIcon,
      rightIcon,
      variant = "default",
      className,
      ...props
    },
    ref,
  ) => {
    const rawLabel = label ?? children;
    const hasText = rawLabel !== undefined && rawLabel !== null && rawLabel !== "";
    const showIconLeft = iconLeft !== undefined ? iconLeft : Boolean(leftIcon);
    const showIconRight = iconRight !== undefined ? iconRight : Boolean(rightIcon);

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors text-left cursor-pointer text-xs",
          variant === "danger"
            ? "text-rose-600 hover:bg-rose-50 font-medium"
            : "text-slate-700 hover:bg-slate-100",
          !hasText && "justify-center",
          className,
        )}
        {...props}
      >
        {showIconLeft && leftIcon && (
          <span className="shrink-0 inline-flex items-center">{leftIcon}</span>
        )}
        {hasText && <span className="grow truncate">{rawLabel}</span>}
        {showIconRight && rightIcon && (
          <span className="shrink-0 inline-flex items-center ml-auto">{rightIcon}</span>
        )}
      </button>
    );
  },
);

DropdownItem.displayName = "DropdownItem";

export const Dropdown = Object.assign(DropdownComponent, {
  Item: DropdownItem,
});
