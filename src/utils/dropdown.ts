import * as React from "react";

export type DropdownAlign = "left" | "center" | "right";
export type DropdownPlacement = "bottom" | "top";
export type DropdownSize = "sm" | "md" | "lg";
export type DropdownVariant = "outline" | "primary" | "secondary" | "ghost";

export interface DropdownCoords {
  top: number;
  left: number;
  placement: DropdownPlacement;
}

export interface CalculateDropdownCoordsOptions {
  triggerElement: HTMLElement | null;
  align?: DropdownAlign;
  width?: number;
  estimatedHeight?: number;
  viewportMargin?: number;
}

/**
 * Calcula o posicionamento e alinhamento do popover do dropdown relativo ao elemento gatilho na tela.
 * Suporta alinhamento à esquerda, centro e direita, e inverte automaticamente para cima
 * caso o espaço inferior do viewport seja insuficiente.
 */
export function calculateDropdownCoords({
  triggerElement,
  align = "left",
  width = 260,
  estimatedHeight = 320,
  viewportMargin = 12,
}: CalculateDropdownCoordsOptions): DropdownCoords | null {
  if (!triggerElement || typeof window === "undefined") return null;

  const rect = triggerElement.getBoundingClientRect();

  // Fecha ou não calcula se o gatilho foi rolado completamente para fora da tela
  if (rect.bottom < -50 || rect.top > window.innerHeight + 50) {
    return null;
  }

  const dropdownWidth = width;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Inverte para cima se o espaço inferior for insuficiente e houver espaço no topo
  const spaceBelow = viewportHeight - rect.bottom;
  const shouldFlipToTop =
    spaceBelow < estimatedHeight && rect.top > estimatedHeight;

  let left: number;
  if (align === "right") {
    left = rect.right - dropdownWidth;
  } else if (align === "center") {
    left = rect.left + rect.width / 2 - dropdownWidth / 2;
  } else {
    left = rect.left;
  }

  // Garante margem de segurança das bordas horizontais da tela
  const clampedLeft = Math.max(
    viewportMargin,
    Math.min(left, viewportWidth - dropdownWidth - viewportMargin),
  );

  return {
    top: rect.bottom + 6,
    left: clampedLeft,
    placement: shouldFlipToTop ? "top" : "bottom",
  };
}

/**
 * Retorna os estilos inline com posicionamento fixo e duração de transição para o popover flutuante.
 */
export function getDropdownFixedStyles(
  coords: DropdownCoords,
  triggerElement: HTMLElement | null,
  animationDuration: number,
  customStyle?: React.CSSProperties,
): React.CSSProperties {
  const isTop = coords.placement === "top";
  const bottomOffset =
    triggerElement && typeof window !== "undefined"
      ? window.innerHeight - triggerElement.getBoundingClientRect().top + 6
      : 0;

  return {
    position: "fixed",
    left: `${coords.left}px`,
    ...(isTop ? { bottom: `${bottomOffset}px` } : { top: `${coords.top}px` }),
    transitionDuration: `${animationDuration}ms`,
    ...customStyle,
  };
}

/**
 * Classes utilitárias do Tailwind para os tamanhos do botão gatilho padrão do dropdown.
 */
export const DROPDOWN_SIZE_CLASSES: Record<
  DropdownSize,
  { withText: string; singleIcon: string; multipleIcons: string }
> = {
  sm: {
    withText: "h-8 px-2.5 text-xs rounded-md gap-1.5",
    singleIcon: "w-8 h-8 p-0 rounded-md justify-center",
    multipleIcons: "h-8 px-2 text-xs rounded-md gap-1 justify-center",
  },
  md: {
    withText: "h-9 px-3.5 text-sm rounded-lg gap-2",
    singleIcon: "w-9 h-9 p-0 rounded-lg justify-center",
    multipleIcons: "h-9 px-2.5 text-sm rounded-lg gap-1.5 justify-center",
  },
  lg: {
    withText: "h-11 px-4 text-base rounded-xl gap-2.5",
    singleIcon: "w-11 h-11 p-0 rounded-xl justify-center",
    multipleIcons: "h-11 px-3 text-base rounded-xl gap-2 justify-center",
  },
};

/**
 * Obtém a classe de dimensionamento do botão gatilho do dropdown.
 */
export function getDropdownTriggerSizeClass(
  size: DropdownSize = "md",
  hasText: boolean,
  isSingleIcon: boolean,
): string {
  const sizeConfig = DROPDOWN_SIZE_CLASSES[size] ?? DROPDOWN_SIZE_CLASSES.md;
  if (hasText) {
    return sizeConfig.withText;
  }
  return isSingleIcon ? sizeConfig.singleIcon : sizeConfig.multipleIcons;
}

/**
 * Classes utilitárias do Tailwind para os estilos visuais (variantes) do gatilho do dropdown.
 */
export const DROPDOWN_VARIANT_CLASSES: Record<DropdownVariant, string> = {
  outline:
    "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 shadow-2xs",
  primary:
    "bg-slate-900 border border-slate-900 text-white hover:bg-slate-800 active:scale-[0.98] shadow-sm",
  secondary:
    "bg-slate-100 border border-slate-200 text-slate-900 hover:bg-slate-200 active:scale-[0.98]",
  ghost:
    "bg-transparent border border-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200",
};

/**
 * Obtém a classe da variante visual do botão gatilho do dropdown.
 */
export function getDropdownTriggerVariantClass(variant: DropdownVariant = "outline"): string {
  return DROPDOWN_VARIANT_CLASSES[variant] ?? DROPDOWN_VARIANT_CLASSES.outline;
}

export interface ResolveDropdownTriggerOptions {
  label?: React.ReactNode;
  triggerText?: React.ReactNode;
  iconLeft?: boolean;
  iconRight?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hasCustomTrigger?: boolean;
}

/**
 * Resolve o estado dos ícones, textos e fallbacks para o botão gatilho do Dropdown.
 */
export function resolveDropdownTriggerState({
  label,
  triggerText,
  iconLeft,
  iconRight,
  leftIcon,
  rightIcon,
  hasCustomTrigger,
}: ResolveDropdownTriggerOptions) {
  const resolvedLabel = label !== undefined ? label : triggerText;
  const hasText = resolvedLabel !== undefined && resolvedLabel !== null && resolvedLabel !== "";

  const showIconLeft = iconLeft !== undefined ? iconLeft : Boolean(leftIcon);
  const showIconRight = iconRight !== undefined ? iconRight : Boolean(rightIcon);

  // Se nenhum gatilho customizado for fornecido e nenhum texto/ícone for configurado
  const fallbackNeeded = !hasCustomTrigger && !hasText && !showIconLeft && !showIconRight;

  // Detecta se é um botão de apenas um ícone (sem texto e com apenas um dos lados com ícone)
  const isSingleIcon =
    !hasText &&
    ((showIconLeft && !showIconRight) ||
      (!showIconLeft && showIconRight) ||
      fallbackNeeded);

  return {
    resolvedLabel,
    hasText,
    showIconLeft,
    showIconRight,
    fallbackNeeded,
    isSingleIcon,
  };
}

export interface UseDropdownStateParams {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: DropdownAlign;
  width?: number;
  animationDuration?: number;
}

/**
 * Hook utilitário que gerencia o estado aberto/fechado, cálculo de coordenadas,
 * ciclo de montagem com animações suaves de fade, focus trap e listeners de tela para o Dropdown.
 */
export function useDropdownState({
  open,
  defaultOpen = false,
  onOpenChange,
  align = "left",
  width = 260,
  animationDuration = 200,
}: UseDropdownStateParams) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const [isMounted, setIsMounted] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const [coords, setCoords] = React.useState<DropdownCoords>({
    top: 0,
    left: 0,
    placement: "bottom",
  });

  const triggerContainerRef = React.useRef<HTMLDivElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);

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

  // Função utilitária para calcular as coordenadas atuais do popover
  const getCoords = React.useCallback(() => {
    return calculateDropdownCoords({
      triggerElement: triggerContainerRef.current,
      align,
      width,
    });
  }, [align, width]);

  // Atualiza o posicionamento fixo do popover ancorado ao trigger
  const updatePosition = React.useCallback(() => {
    const nextCoords = getCoords();
    if (!nextCoords) {
      handleSetOpen(false);
      return;
    }
    setCoords(nextCoords);
  }, [getCoords, handleSetOpen]);

  // Animação de entrada (fade-in) e saída (fade-out) fluida com opacidade e transferência de foco
  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (!isOpen) return;
    }

    if (isOpen) {
      const initialCoords = getCoords();
      if (initialCoords) {
        setCoords(initialCoords);
      }
      setIsMounted(true);
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
          setTimeout(() => {
            if (popoverRef.current) {
              const focusables = popoverRef.current.querySelectorAll<HTMLElement>(
                'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
              );
              if (focusables.length > 0) {
                focusables[0].focus();
              } else {
                popoverRef.current.focus();
              }
            }
          }, 30);
        });
      });
      return () => cancelAnimationFrame(raf);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsMounted(false);
      }, animationDuration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, animationDuration, getCoords]);

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

  // Fecha ao clicar fora ou ao pressionar Escape e gerencia navegação por teclado (Tab e Setas)
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
        const button = triggerContainerRef.current?.querySelector<HTMLElement>("button, [tabindex]");
        button?.focus();
        return;
      }

      // Focus trap quando o popover estiver aberto (WCAG 2.4.3 / 2.1.2)
      if (event.key === "Tab" && popoverRef.current) {
        const focusables = Array.from(
          popoverRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (focusables.length > 0) {
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }

      // Navegação rápida por setas Up / Down entre itens
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        if (popoverRef.current) {
          const items = Array.from(
            popoverRef.current.querySelectorAll<HTMLElement>(
              'button:not([disabled]), [role="menuitem"]:not([disabled])',
            ),
          );
          if (items.length > 0) {
            event.preventDefault();
            const currentIndex = items.indexOf(document.activeElement as HTMLElement);
            if (event.key === "ArrowDown") {
              const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
              items[nextIndex].focus();
            } else {
              const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
              items[prevIndex].focus();
            }
          }
        }
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

  return {
    isOpen,
    handleSetOpen,
    toggle,
    coords,
    isMounted,
    isVisible,
    triggerContainerRef,
    popoverRef,
    updatePosition,
  };
}

